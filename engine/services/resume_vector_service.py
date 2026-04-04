from models.ml_model import get_models
from services.pinecone_service import get_index


def chunk_text(text, chunk_size=120, overlap=30):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks


def store_resume_chunks(user_id, resume_text, batch_size=20):
    bi_encoder, _ = get_models()
    index = get_index()

    if bi_encoder is None:
        return {"error": "Model not loaded"}, 503

    chunks = chunk_text(resume_text)

    total_chunks = len(chunks)

    for batch_start in range(0, total_chunks, batch_size):
        batch_chunks = chunks[batch_start: batch_start + batch_size]

        vectors = []

        for i, chunk in enumerate(batch_chunks):
            embedding = bi_encoder.encode(
                chunk,
                normalize_embeddings=True
            ).tolist()

            vectors.append({
                "id": f"{user_id}_{batch_start + i}",
                "values": embedding,
                "metadata": {
                    "userId": user_id,
                    "text": chunk,
                    "type": "resume"
                }
            })

        index.upsert(
            vectors=vectors,
            namespace=str(user_id)
        )

        batch_number = (batch_start // batch_size) + 1
        print(f"Batch {batch_number} complete")

    return {"stored_chunks": total_chunks}