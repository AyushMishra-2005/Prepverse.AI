from flask import Flask, request, jsonify
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer, CrossEncoder
from bson import ObjectId
import numpy as np
import torch
import os

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

@app.route("/recommend", methods=["POST"])
def recommend():
    if bi_encoder is None or cross_encoder is None or collection is None:
        return jsonify({"error": "Server is not ready due to a startup failure."}), 503

    data = request.get_json()
    user_summary = data.get("summary")

    if not user_summary or not isinstance(user_summary, str):
        return jsonify({"error": "Invalid input. Please provide a JSON object with a 'summary' key containing the text."}), 400

    try:
        print("Generating vector from user summary...")
        user_vector = bi_encoder.encode(
            user_summary,
            normalize_embeddings=True
        ).tolist()
    except Exception as e:
        return jsonify({"error": f"Failed to generate profile vector: {e}"}), 500

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
            (user_summary, c.get("description", "") + " " + c.get("jobTitle", ""))
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


if __name__ == "__main__":
    startup() 
    print("Starting Flask server for recommendation engine...")
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)