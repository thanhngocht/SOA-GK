from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

MONGO_URI = "mongodb+srv://thanhngocbao0304_db_user:user123@soa.3m8plxk.mongodb.net/?retryWrites=true&w=majority&appName=soa"

DB_NAME = "auth_service_db"
COLLECTION_USERS = "user_auth"

_client = MongoClient(MONGO_URI, server_api=ServerApi("1"))

try:
    _client.admin.command("ping")
    print("✅ MongoDB connected (ping ok).")
except Exception as e:
    print("❌ MongoDB ping failed:", e)

def get_db():
    return _client[DB_NAME]

def get_users_collection():
    return get_db()[COLLECTION_USERS]
