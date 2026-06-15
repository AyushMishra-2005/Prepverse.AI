import os
import requests
from dotenv import load_dotenv

load_dotenv()

URL = "https://api.jina.ai/v1/rerank"

JINA_API_KEY = os.getenv("JINA_API_KEY")


def rerank(query, documents):
    headers = {
        "Authorization": f"Bearer {JINA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "jina-reranker-v2-base-multilingual",
        "query": query,
        "documents": documents
    }

    response = requests.post(
        URL,
        headers=headers,
        json=payload
    )

    response.raise_for_status()

    return response.json()["results"]

