from typing import Optional, Dict, Any
from ..db import get_users_collection

#gọi query từ database (DAO)

def _normalize_user(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc.get("_id")) if doc.get("_id") else None,
        "username": doc.get("username"),
        "password_hash": doc.get("password_hash") or doc.get("password"),
    }



def find_user_by_username(username: str) -> Optional[dict]:
    col = get_users_collection()
    doc = col.find_one({"username": username})
    if not doc:
        return None
    return _normalize_user(doc)
