# repo.py
from typing import Optional, Dict, Any, List
from decimal import Decimal
from users.db import get_supabase_client

#Truy van SQL

SCHEMA = "user_svc"
TABLE  = "users"

def _tb():
    return get_supabase_client().schema(SCHEMA).table(TABLE)

def _normalize_row(row: Dict[str, Any]) -> Dict[str, Any]:
    bal = row.get("balance", 0)
    if isinstance(bal, Decimal):
        row["balance"] = float(bal)
    elif isinstance(bal, (int, float)):
        row["balance"] = float(bal)
    else:
        try:
            row["balance"] = float(bal or 0)
        except Exception:
            row["balance"] = 0.0
    return row

def _first_or_none(data: Optional[List[Dict]]) -> Optional[Dict[str, Any]]:
    if isinstance(data, list) and data:
        return _normalize_row(data[0])
    return None

def create_user(username: str, email: str, name: str) -> Dict[str, Any]:
    res = (
        _tb()
        .insert({"username": username, "email": email, "name": name}, returning="representation")
        .execute()
    )
    if not res.data:
        raise RuntimeError("Insert returned no data")
    return _normalize_row(res.data[0])

def find_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    res = (
        _tb()
        .select("id, username, email, name, balance, created_at")
        .eq("username", username)
        .limit(1)
        .execute()
    )
    return _first_or_none(res.data)

def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    res = (
        _tb()
        .select("id, username, email, name, balance, created_at")
        .eq("email", email)
        .limit(1)
        .execute()
    )
    return _first_or_none(res.data)
