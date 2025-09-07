import pandas as pd
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import os
import re
import numpy as np
from dotenv import load_dotenv
import random

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

MODEL_NAME = "Alibaba-NLP/gte-large-en-v1.5"
CSV_FILE_PATH = "cleaned_internships_dataset.csv"


def clean_text(text: str) -> str:
    """Cleans and normalizes text for better embeddings."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)  
    text = re.sub(r"[^a-zA-Z0-9.,;:!?()\- ]", "", text)  
    return text.strip()


def build_combined_text(row: pd.Series) -> str:
    """Build a semantically rich text representation of an internship with weights."""
    parts = []

    if row.get("Job Title"):
        parts.append(("Internship Title: " + clean_text(row["Job Title"]) + ". ") * 2)
    if row.get("Job Role"):
        parts.append(f"Role: {clean_text(row['Job Role'])}.")
    if row.get("Job Topics"):
        parts.append(("Topic: " + clean_text(row["Job Topics"]) + ". ") * 3)
    if row.get("Job Description"):
        parts.append(("Responsibilities include: " + clean_text(row["Job Description"]) + ". ") * 3)

    return " ".join(parts)


def main():
    """Main function to process CSV, generate embeddings, and store in MongoDB."""
    print("Connecting to MongoDB Atlas...")
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        client.admin.command("ping")
        print("MongoDB connection successful.")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return

    print(f"Loading Sentence Transformer model: {MODEL_NAME}...")
    try:
        model = SentenceTransformer(MODEL_NAME, trust_remote_code=True)  
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    print(f"Loading data from {CSV_FILE_PATH}...")
    if not os.path.exists(CSV_FILE_PATH):
        print(f"Error: File {CSV_FILE_PATH} not found.")
        return

    df = pd.read_csv(CSV_FILE_PATH)

    print(f"Clearing existing data in '{COLLECTION_NAME}' collection...")
    collection.delete_many({})

    print("Preparing internship texts...")
    internship_texts = []
    internship_metadata = []

    for _, row in df.iterrows():
        combined_text = build_combined_text(row)
        if not combined_text:
            continue

        internship_texts.append(combined_text)
        internship_metadata.append({
            "jobTitle": row.get("Job Title"),
            "jobTopic": row.get("Job Topics"),
            "duration": row.get("Duration"),
            "type": row.get("Type"),
            "company": row.get("Company"),
            "stipend": row.get("Stipend"),
            "jobType": row.get("Job Type"),
            "lastDate": row.get("Last Date"),
            "description": row.get("Job Description"),
            "jobRole": row.get("Job Role"),
            "numOfQns": random.randint(2, 6),
        })

    print("Generating embeddings in batches...")
    embeddings = model.encode(
    internship_texts,
    batch_size=32,
    convert_to_numpy=True,
    show_progress_bar=True
)

    from sklearn.preprocessing import normalize
    embeddings = normalize(embeddings)

    internships_to_insert = []
    for meta, emb in zip(internship_metadata, embeddings):
        meta["embedding"] = emb.tolist()
        internships_to_insert.append(meta)

    if internships_to_insert:
        print(f"\nInserting {len(internships_to_insert)} documents into MongoDB...")
        try:
            collection.insert_many(internships_to_insert)
            print("Data insertion complete!")
            print(f"Total documents in collection: {collection.count_documents({})}")
        except Exception as e:
            print(f"Error during data insertion: {e}")
    else:
        print("No data to insert.")

    client.close()
    print("MongoDB connection closed.")


if __name__ == "__main__":
    main()
