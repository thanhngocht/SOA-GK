from ..db import get_users_collection

def insert_user(doc: dict) -> dict:
    col = get_users_collection()
    result = col.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc

def find_user_by_username(studentId: str):
    col = get_users_collection()
    return col.find_one({"username": studentId})