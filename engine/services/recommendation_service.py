from utils.filters import *
from utils.geo_utils import haversine
from db.mongo import get_collection
from models.ml_model import get_models
import numpy as np


def recommend(data):
    collection = get_collection()
    bi_encoder, cross_encoder = get_models()

    if bi_encoder is None or cross_encoder is None or collection is None:
        return {"error": "Server is not ready due to a startup failure."}, 503

    user_vector = data.get("embedding")
    filters = data.get("filters", {})
    resume_summary = data.get("resumeSummary", "").lower()

    if not user_vector or not isinstance(user_vector, list):
        return {"error": "Invalid input. Provide 'embedding' as a list of floats."}, 400

    match_conditions = {}

    if filters.get("duration"):
        match_conditions["duration"] = {"$in": filters["duration"]}

    type_filters = build_or_regex_for_values(filters.get("type", []))
    jobtype_filters = build_or_regex_for_values(filters.get("jobType", []))

    if type_filters and jobtype_filters:
        match_conditions["$or"] = (
            [{"type": r} for r in type_filters] +
            [{"jobType": r} for r in jobtype_filters]
        )
    elif type_filters:
        match_conditions["type"] = {"$in": type_filters}
    elif jobtype_filters:
        match_conditions["jobType"] = {"$in": jobtype_filters}

    stipend_filters = []
    if filters.get("stipend"):
        for s in filters["stipend"]:
            r = parse_filter_stipend_range(str(s))
            if r:
                stipend_filters.append(r)

    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": user_vector,
                "numCandidates": 500,
                "limit": 200
            }
        }
    ]

    if match_conditions:
        pipeline.append({"$match": match_conditions})

    pipeline.append({
        "$project": {
            "_id": 1,
            "jobTitle": 1, "company": 1, "description": 1,
            "jobRole": 1, "jobTopic": 1,
            "duration": 1, "type": 1,
            "stipend": 1, "jobType": 1,
            "lastDate": 1, "skills": 1,
            "numOfQns": 1,
            "locationName": 1, "location": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    })

    try:
        candidates = list(collection.aggregate(pipeline))
    except Exception as e:
        return {"error": f"Database query failed: {e}"}, 500

    if not candidates:
        return []


    location_filters = filters.get("location", [])

    if location_filters:
        loc_docs = list(collection.find(
            {"locationName": {"$in": location_filters}},
            {"location": 1}
        ))

        target_coords = [
            doc["location"]["coordinates"]
            for doc in loc_docs if doc.get("location")
        ]

        if target_coords:
            filtered = []

            for cand in candidates:
                coords = cand.get("location", {}).get("coordinates")
                if not coords:
                    continue

                if cand.get("locationName") in location_filters:
                    filtered.append(cand)
                    continue

                for tc in target_coords:
                    if haversine(tc, coords) <= 500:
                        filtered.append(cand)
                        break

            if filtered:
                candidates = filtered


    filtered_after_meta = []

    available_open = False
    if filters.get("available"):
        if "open" in [x.lower() for x in filters["available"]]:
            available_open = True

    for cand in candidates:
        ok = True

        if stipend_filters:
            val = parse_stipend_to_number(cand.get("stipend"))
            if val is None:
                ok = False
            else:
                ok = any(mn <= val <= mx for (mn, mx) in stipend_filters)

        if ok and available_open:
            if not last_date_is_open(cand.get("lastDate")):
                ok = False

        if ok:
            filtered_after_meta.append(cand)

    if not filtered_after_meta:
        return []


    def is_relevant_job(job):
        text = f"{job.get('jobTitle','')} {job.get('jobRole','')} {job.get('jobTopic','')}".lower()

        if "teaching" in resume_summary:
            return any(k in text for k in ["teacher", "teaching", "tutor", "education"])

        if "software" in resume_summary or "development" in resume_summary:
            return any(k in text for k in ["developer", "software", "engineer", "web"])

        if "marketing" in resume_summary:
            return any(k in text for k in ["marketing", "seo", "campaign"])

        return True

    temp_filtered = [c for c in filtered_after_meta if is_relevant_job(c)]
    if temp_filtered:
        filtered_after_meta = temp_filtered


    try:
        pairs = [
            (
                resume_summary,
                f"{c.get('jobTitle','')} {c.get('jobRole','')} {c.get('jobTopic','')} {c.get('description','')}"
            )
            for c in filtered_after_meta
        ]

        cross_scores = np.array(cross_encoder.predict(pairs)).flatten()
        vector_scores = np.array([c.get("score", 0) for c in filtered_after_meta])

        skill_scores = []
        for c in filtered_after_meta:
            job_skills = " ".join(c.get("skills", [])).lower()
            overlap = sum(1 for skill in job_skills.split() if skill in resume_summary)
            skill_scores.append(overlap)

        skill_scores = np.array(skill_scores)

        final_scores = (
            0.4 * vector_scores +
            0.4 * cross_scores +
            0.2 * skill_scores
        )

        ranked = [
            dict(c, rerank_score=float(score))
            for c, score in zip(filtered_after_meta, final_scores)
        ]

        ranked.sort(key=lambda x: x["rerank_score"], reverse=True)

        seen = set()
        diversified = []

        for item in ranked:
            key = (item.get("company"), item.get("jobRole"))
            if key not in seen:
                diversified.append(item)
                seen.add(key)
            if len(diversified) >= 10:
                break

        for item in diversified:
            item["_id"] = str(item["_id"])
            item.pop("location", None)

            skills = item.get("skills", [])
            if isinstance(skills, str):
                item["skills"] = [s.strip() for s in skills.split(",") if s.strip()]
            elif isinstance(skills, list):
                item["skills"] = skills
            else:
                item["skills"] = []

            topics = item.get("jobTopic", "")
            if isinstance(topics, str):
                item["jobTopic"] = [t.strip() for t in topics.split(",") if t.strip()]
            elif isinstance(topics, list):
                item["jobTopic"] = topics
            else:
                item["jobTopic"] = []

        return diversified

    except Exception as e:
        return {"error": f"Hybrid re-ranking failed: {e}"}, 500