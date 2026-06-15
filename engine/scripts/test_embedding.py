import os
import requests
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN_ONE = os.getenv("HF_TOKEN_ONE")
HF_TOKEN_TWO = os.getenv("HF_TOKEN_TWO")
JINA_API_KEY = os.getenv("JINA_API_KEY")

client = InferenceClient(api_key=HF_TOKEN_TWO)

embedding = client.feature_extraction(
    "Machine learning is amazing.",
    model="BAAI/bge-large-en-v1.5"
)

print("Embedding length:", len(embedding))
print("First 10 values:")
print(embedding[:10])


headers = {
    "Authorization": f"Bearer {JINA_API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "jina-reranker-v2-base-multilingual",
    "query": "What is Python?",
    "documents": [
        "Python is a programming language.",
        "Cats are animals."
    ]
}

response = requests.post(
    "https://api.jina.ai/v1/rerank",
    headers=headers,
    json=data
)


print(response.json())