from models.ml_model import get_models
from services.pinecone_service import get_index


def retrieve_resume_chunks(user_id, query, top_k=3):
    bi_encoder, _ = get_models()
    index = get_index()

    if bi_encoder is None:
        return []

    query_vector = bi_encoder.encode(
        query,
        normalize_embeddings=True
    ).tolist()

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        namespace=str(user_id),
        include_metadata=True
    )

    chunks = [
        match["metadata"]["text"]
        for match in results["matches"]
    ]

    return chunks
  
  
  
  
  
  
  
  