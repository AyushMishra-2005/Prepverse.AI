import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from utils.text_utils import build_combined_text

load_dotenv()

client = InferenceClient(api_key=os.getenv("HF_TOKEN_ONE"))

MODEL = "BAAI/bge-large-en-v1.5"

def embed_job(data):
    if not data or not isinstance(data, dict):
        return {"error": "Invalid input. Expected a JSON object with job details."}, 400

    try:
        combined_text = build_combined_text(data)

        if not combined_text:
            return {"error": "No valid text to generate embedding."}, 400

        print("Generating embedding for job data...")

        embedding = client.feature_extraction(
            combined_text,
            model=MODEL
        ).tolist()

        result = data.copy()
        result["embedding"] = embedding

        return result

    except Exception as e:
        return {"error": f"Failed to generate embedding: {e}"}, 500


def embed_candidate(data):
    summary = data.get("summary")

    if not summary or not isinstance(summary, str):
        return {"error": "Invalid input"}, 400

    try:
        print("Generating embedding for candidate summary...")

        embedding = client.feature_extraction(
            summary,
            model=MODEL
        ).tolist()

        result = {
            "summary": summary,
            "embedding": embedding
        }

        return result

    except Exception as e:
        return {"error": f"Failed to generate embedding: {e}"}, 500