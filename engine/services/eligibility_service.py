from pymongo import MongoClient
from bson import ObjectId
import numpy as np

from models.ml_model import get_models
from config.config import Config   # ✅ FIXED


def eligible_users(data):
    bi_encoder, cross_encoder = get_models()

    if bi_encoder is None or cross_encoder is None:
        return {"error": "Server not ready"}, 503

    internship_id = data.get("internshipId")

    if not internship_id:
        return {"error": "Invalid input. Provide 'internshipId'"}, 400

    try:
        client = MongoClient(Config.MONGO_URI)   # ✅ FIXED
        db = client[Config.DB_NAME]              # ✅ FIXED

        internship_collection = db["new_internships_data"]
        resume_collection = db["resumedatas"]

        internship = internship_collection.find_one(
            {"_id": ObjectId(internship_id)},
            {"embedding": 1, "description": 1, "jobTitle": 1, "jobRole": 1, "jobTopic": 1}
        )

        if not internship or "embedding" not in internship:
            return {"error": "Internship not found or missing embedding"}, 404

        internship_embedding = internship["embedding"]
        internship_desc = internship.get("description", "Internship posting")

        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index2",
                    "path": "embedding",
                    "queryVector": internship_embedding,
                    "numCandidates": 2000,
                    "limit": 200
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "userId": 1,
                    "embedding": 1,
                    "resumeJSONdata": 1,
                    "resumeReview": 1,
                    "vectorScore": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        resumes = list(resume_collection.aggregate(pipeline))
        if not resumes:
            return {"eligible_users": [], "all_ranked_results": []}

        keywords = f"{internship.get('jobTitle','')} {internship.get('jobRole','')} {internship.get('jobTopic','')} {internship.get('description','')}".lower().split()

        filtered_resumes = []
        for r in resumes:
            resume_text = str(r.get("resumeJSONdata", "")).lower()
            if any(k in resume_text for k in keywords):
                filtered_resumes.append(r)

        if not filtered_resumes:
            return {"eligible_users": [], "all_ranked_results": []}

        resumes = filtered_resumes

        pairs = [(internship_desc, str(r.get("resumeJSONdata", ""))) for r in resumes]

        raw_cross_scores = cross_encoder.predict(pairs)
        cross_scores = np.array(raw_cross_scores).flatten()

        if cross_scores.max() != cross_scores.min():
            cross_scores = (cross_scores - cross_scores.min()) / (cross_scores.max() - cross_scores.min())
        else:
            cross_scores = np.ones_like(cross_scores) * 0.5

        vector_scores = np.array([r["vectorScore"] for r in resumes])
        hybrid_scores = 0.6 * vector_scores + 0.4 * cross_scores

        percentile_threshold = np.percentile(hybrid_scores, 50)

        min_vector_score = 0.5
        min_cross_score = 0.3

        eligible_users = []
        ranked_results = []

        for r, ce_score, hybrid_score in zip(resumes, cross_scores, hybrid_scores):
            user_id = str(r["userId"])
            vector_score = r["vectorScore"]
            final_score = hybrid_score

            ranked_results.append({
                "userId": user_id,
                "vector_score": float(vector_score),
                "cross_score": float(ce_score),
                "final_score": float(final_score),
                "resumeReview": r.get("resumeReview")
            })

            if final_score >= percentile_threshold and vector_score >= min_vector_score and ce_score >= min_cross_score:
                eligible_users.append({
                    "userId": user_id,
                    "vector_score": float(vector_score),
                    "cross_score": float(ce_score),
                    "final_score": float(final_score),
                    "resumeReview": r.get("resumeReview")
                })

        eligible_users = sorted(eligible_users, key=lambda x: x["final_score"], reverse=True)

        return {
            "eligible_users": eligible_users,
            "all_ranked_results": ranked_results
        }

    except Exception as e:
        return {"error": f"Failed to compute eligibility: {e}"}, 500
    
    
    
    
    
    
    
    
    