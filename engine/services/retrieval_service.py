import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from services.pinecone_service import get_index

load_dotenv()

client = InferenceClient(api_key=os.getenv("HF_TOKEN"))

MODEL = "BAAI/bge-large-en-v1.5"


def retrieve_resume_chunks(user_id, query, top_k=3):
    index = get_index()

    query_vector = client.feature_extraction(
        query,
        model=MODEL
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