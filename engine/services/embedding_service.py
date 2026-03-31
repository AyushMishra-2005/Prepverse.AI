from models.ml_model import get_models
from utils.text_utils import build_combined_text


def embed_job(data):
    bi_encoder, _ = get_models()

    if bi_encoder is None:
        return {"error": "Bi-encoder model not loaded."}, 503

    if not data or not isinstance(data, dict):
        return {"error": "Invalid input. Expected a JSON object with job details."}, 400

    try:
        combined_text = build_combined_text(data)
        if not combined_text:
            return {"error": "No valid text to generate embedding."}, 400

        print("Generating embedding for job data...")
        embedding = bi_encoder.encode(
            combined_text,
            normalize_embeddings=True
        ).tolist()

        result = data.copy()
        result["embedding"] = embedding

        return result

    except Exception as e:
        return {"error": f"Failed to generate embedding: {e}"}, 500


def embed_candidate(data):
    bi_encoder, _ = get_models()

    if bi_encoder is None:
        return {"error": "Bi-encoder model not loaded."}, 503

    summary = data.get("summary")

    if not summary or not isinstance(summary, str):
        return {"error": "Invalid input"}, 400

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

        return result

    except Exception as e:
        return {"error": f"Failed to generate embedding: {e}"}, 500