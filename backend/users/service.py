# repo.py
from typing import Optional, Dict, Any, List
from users.db import get_supabase_client

SCHEMA = "user_svc"
TABLE  = "users"

def _first_or_none(data: Optional[List[Dict]]) -> Optional[Dict[str, Any]]:
    if isinstance(data, list) and data:
        return data[0]
    return None

def _tb():

    return get_supabase_client().schema(SCHEMA).table(TABLE)

def create_user(username: str, email: str, name: str) -> Dict[str, Any]:
    res = (
        _tb()
        .insert({"username": username, "email": email, "name": name}, returning="representation")
        .execute()
    )
    if not res.data:
        raise RuntimeError("Insert returned no data")
    return res.data[0]

def find_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    res = (
        _tb()
        .select("id, username, email, name, balance")
        .eq("username", username)
        .limit(1)
        .execute()
    )
    return _first_or_none(res.data)
