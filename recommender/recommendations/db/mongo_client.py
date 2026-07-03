import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/component_marketplace')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'component_marketplace')

class MongoClientSingleton:
    _instance = None
    _db = None

    @classmethod
    def get_db(cls):
        if cls._instance is None:
            cls._instance = MongoClient(MONGO_URI)
            cls._db = cls._instance[MONGO_DB_NAME]
        return cls._db
