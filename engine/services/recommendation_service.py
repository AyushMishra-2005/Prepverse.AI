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
    print("Filters received:", filters)

    if not user_vector or not isinstance(user_vector, list):
        return {"error": "Invalid input. Provide 'embedding' as a list of floats."}, 400

    match_conditions = {}
    if "duration" in filters and filters["duration"]:
        match_conditions["duration"] = {"$in": filters["duration"]}

    type_filters = build_or_regex_for_values(filters.get("type", []))
    jobtype_filters = build_or_regex_for_values(filters.get("jobType", []))

    if type_filters and jobtype_filters:
        or_conditions = [{"type": r} for r in type_filters] + [{"jobType": r} for r in jobtype_filters]
        match_conditions["$or"] = or_conditions
    elif type_filters:
        match_conditions["type"] = type_filters[0] if len(type_filters) == 1 else {"$in": type_filters}
    elif jobtype_filters:
        match_conditions["jobType"] = jobtype_filters[0] if len(jobtype_filters) == 1 else {"$in": jobtype_filters}

    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": user_vector,
                "numCandidates": 500,
                "limit": 100
            }
        }
    ]

    if match_conditions:
        pipeline.append({"$match": match_conditions})

    pipeline.append({
        "$project": {
            "_id": 1,
            "jobTitle": 1, "company": 1, "description": 1,
            "jobRole": 1, "jobTopic": 1, "duration": 1, "type": 1,
            "stipend": 1, "jobType": 1, "lastDate": 1, "skills": 1,
            "numOfQns": 1, "locationName": 1, "location": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    })

    try:
        print("Executing vector search against MongoDB...")
        candidates = list(collection.aggregate(pipeline))
    except Exception as e:
        return {"error": f"Database query failed: {e}"}, 500

    if not candidates:
        return []

    location_filters = filters.get("location", [])
    if location_filters:
        print("Applying location filter in Python...")
        filtered_by_location = []

        loc_docs = list(collection.find(
            {"locationName": {"$in": location_filters}},
            {"locationName": 1, "location": 1}
        ))

        target_coords = [doc["location"]["coordinates"] for doc in loc_docs if "location" in doc]

        for cand in candidates:
            cand_coords = cand.get("location", {}).get("coordinates")
            if not cand_coords:
                continue

            if cand.get("locationName") in location_filters:
                filtered_by_location.append(cand)
                continue

            for tc in target_coords:
                if haversine(tc, cand_coords) <= 100:
                    filtered_by_location.append(cand)
                    break

        candidates = filtered_by_location if filtered_by_location else candidates

    filtered_after_meta = []
    stipend_filters = []
    if "stipend" in filters and isinstance(filters["stipend"], list):
        for s in filters["stipend"]:
            r = parse_filter_stipend_range(str(s))
            if r:
                stipend_filters.append(r)

    available_open = False
    if "available" in filters and isinstance(filters["available"], list):
        if "open" in [x.lower() for x in filters["available"]]:
            available_open = True

    for cand in candidates:
        ok = True
        if stipend_filters:
            cand_stipend_val = parse_stipend_to_number(cand.get("stipend"))
            if cand_stipend_val is None:
                ok = False
            else:
                ok = any(mn <= cand_stipend_val <= mx for (mn, mx) in stipend_filters)
        if ok and available_open:
            if not last_date_is_open(cand.get("lastDate")):
                ok = False
        if ok:
            filtered_after_meta.append(cand)

    if not filtered_after_meta:
        return []

    try:
        print("Re-ranking internships with Hybrid Score (Vector + Cross-Encoder)...")
        pairs = [
            (
                data.get("resumeSummary", ""),
                f"{c.get('jobTitle', '')}. {c.get('jobRole', '')}. {c.get('jobTopic', '')}. {c.get('description', '')}"
            )
            for c in filtered_after_meta
        ]

        cross_scores = np.array(cross_encoder.predict(pairs)).flatten()
        vector_scores = np.array([c.get("score", 0) for c in filtered_after_meta])

        alpha = 0.6
        hybrid_scores = alpha * vector_scores + (1 - alpha) * cross_scores

        percentile_threshold = np.percentile(hybrid_scores, 60)

        filtered_after_meta = [
            dict(c, rerank_score=float(hs))
            for c, hs in zip(filtered_after_meta, hybrid_scores)
            if hs >= percentile_threshold
        ]

        if not filtered_after_meta:
            return []

        filtered_after_meta.sort(key=lambda x: x["rerank_score"], reverse=True)
        top_results = filtered_after_meta[:10]

        for item in top_results:
            item["_id"] = str(item["_id"])
            item.pop("location", None)

        return top_results

    except Exception as e:
        return {"error": f"Hybrid re-ranking failed: {e}"}, 500