import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("DB_NAME")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME")

    BI_ENCODER_MODEL = "BAAI/bge-large-en-v1.5"
    CROSS_ENCODER_MODEL = "cross-encoder/ms-marco-electra-base"