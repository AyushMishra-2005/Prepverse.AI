from flask import Flask, request, jsonify
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer, CrossEncoder
from bson import ObjectId
import numpy as np
import torch
import os
import re
from sklearn.preprocessing import MinMaxScaler

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

BI_ENCODER_MODEL = "Alibaba-NLP/gte-large-en-v1.5"
CROSS_ENCODER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"

bi_encoder = None
cross_encoder = None
collection = None

def startup():
    global bi_encoder, cross_encoder, collection
    try:
        print("Loading bi-encoder model...")
        bi_encoder = SentenceTransformer(
            BI_ENCODER_MODEL,
            device="cuda" if torch.cuda.is_available() else "cpu",
            trust_remote_code=True
        )
        print(f"Bi-encoder loaded on {bi_encoder.device}.")

        print("Loading cross-encoder model...")
        cross_encoder = CrossEncoder(
            CROSS_ENCODER_MODEL,
            device="cuda" if torch.cuda.is_available() else "cpu"
        )
        print("Cross-encoder loaded.")

        print("Connecting to MongoDB Atlas...")
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        client.admin.command("ping")
        print("MongoDB connection successful.")

    except Exception as e:
        print(f"CRITICAL STARTUP ERROR: {e}")
        bi_encoder, cross_encoder, collection = None, None, None

def clean_text(text: str) -> str:
    """Cleans and normalizes text for better embeddings."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9.,;:!?()\- ]", "", text)
    return text.strip()

def build_combined_text(data: dict) -> str:
    """Builds semantically rich text for a single internship."""
    parts = []

    if data.get("jobTitle"):
        parts.append(("Internship Title: " + clean_text(data["jobTitle"]) + ". ") * 2)
    if data.get("jobRole"):
        parts.append(f"Role: {clean_text(data['jobRole'])}.")
    if data.get("jobTopic"):
        parts.append(("Topic: " + clean_text(data["jobTopic"]) + ". ") * 3)
    if data.get("description"):
        parts.append(("Responsibilities include: " + clean_text(data["description"]) + ". ") * 3)

    return " ".join(parts)

@app.route("/recommend", methods=["POST"])
def recommend():
    if bi_encoder is None or cross_encoder is None or collection is None:
        return jsonify({"error": "Server is not ready due to a startup failure."}), 503

    data = request.get_json()
    user_vector = data.get("embedding")

    if not user_vector or not isinstance(user_vector, list):
        return jsonify({"error": "Invalid input. Provide 'embedding' as a list of floats."}), 400

    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": user_vector,
                "numCandidates": 300,
                "limit": 30,
            }
        },
        {
            "$project": {
                "_id": 1, "jobTitle": 1, "company": 1, "description": 1,
                "jobRole": 1, "jobTopic": 1, "duration": 1, "type": 1,
                "stipend": 1, "jobType": 1, "lastDate": 1, "skills": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]

    try:
        print("Executing vector search against MongoDB...")
        candidates = list(collection.aggregate(pipeline))
    except Exception as e:
        return jsonify({"error": f"Database query failed: {e}"}), 500

    if not candidates:
        return jsonify([])

    try:
        print("Re-ranking candidates with Cross-Encoder...")
        pairs = [
            ("Candidate profile embedding", f"{c.get('jobTitle', '')}. {c.get('jobRole', '')}. {c.get('jobTopic', '')}. {c.get('description', '')}")
            for c in candidates
        ]

        scores = cross_encoder.predict(pairs)

        for cand, score in zip(candidates, scores):
            cand["rerank_score"] = float(score)

        candidates.sort(key=lambda x: x["rerank_score"], reverse=True)

        top_results = candidates[:10]
        for item in top_results:
            item["_id"] = str(item["_id"])

        print("Recommendation process complete.")
        return jsonify(top_results)

    except Exception as e:
        return jsonify({"error": f"Cross-encoder re-ranking failed: {e}"}), 500



@app.route("/embed", methods=["POST"])
def embed_job():
    if bi_encoder is None:
        return jsonify({"error": "Bi-encoder model not loaded."}), 503

    data = request.get_json()

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid input. Expected a JSON object with job details."}), 400

    try:
        combined_text = build_combined_text(data)
        if not combined_text:
            return jsonify({"error": "No valid text to generate embedding."}), 400

        print("Generating embedding for job data...")
        embedding = bi_encoder.encode(
            combined_text,
            normalize_embeddings=True
        ).tolist()

        result = data.copy()
        result["embedding"] = embedding

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Failed to generate embedding: {e}"}), 500


@app.route("/embed_candidate", methods=["POST"])
def embed_candidate():
    if bi_encoder is None:
        return jsonify({"error": "Bi-encoder model not loaded."}), 503

    data = request.get_json()
    summary = data.get("summary")

    if not summary or not isinstance(summary, str):
        return jsonify({"error": "Invalid input"}), 400

    try:
        print("Generating embedding for candidate summary...")
        embedding = bi_encoder.encode(
            summary,
            normalize_embeddings=True
        ).tolist()

        result = {
            "summary": summary,
            "embedding": embedding
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Failed to generate embedding: {e}"}), 500
    
    
    
@app.route("/eligible_users", methods=["POST"])
def eligible_users():
    if bi_encoder is None or cross_encoder is None:
        return jsonify({"error": "Server not ready"}), 503

    data = request.get_json()
    internship_id = data.get("internshipId")

    if not internship_id:
        return jsonify({"error": "Invalid input. Provide 'internshipId'"}), 400

    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]

        internship_collection = db["new_internships_data"]
        resume_collection = db["resumedatas"]

        internship = internship_collection.find_one(
            {"_id": ObjectId(internship_id)},
            {"embedding": 1, "description": 1, "jobTitle": 1, "jobRole": 1, "jobTopic": 1}
        )

        if not internship or "embedding" not in internship:
            return jsonify({"error": "Internship not found or missing embedding"}), 404

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
            return jsonify({"eligible_users": [], "all_ranked_results": []})

        keywords = f"{internship.get('jobTitle','')} {internship.get('jobRole','')} {internship.get('jobTopic','')} {internship.get('description','')}".lower().split()
        filtered_resumes = []
        for r in resumes:
            resume_text = str(r.get("resumeJSONdata", "")).lower()
            if any(k in resume_text for k in keywords):
                filtered_resumes.append(r)

        if not filtered_resumes:
            return jsonify({"eligible_users": [], "all_ranked_results": []})

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

        return jsonify({
            "eligible_users": eligible_users,
            "all_ranked_results": ranked_results
        })

    except Exception as e:
        return jsonify({"error": f"Failed to compute eligibility: {e}"}), 500

    

if __name__ == "__main__":
    startup() 
    print("Starting Flask server for recommendation engine...")
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)







