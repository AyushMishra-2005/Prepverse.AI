from pymongo import MongoClient
from config.config import Config

client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]
collection = db[Config.COLLECTION_NAME]

def get_collection():
    return collection

def get_db():
    return db