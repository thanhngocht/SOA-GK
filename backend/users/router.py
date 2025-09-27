# router.py
from fastapi import APIRouter, HTTPException, Depends
from users.schemas import UserCreate, UserPublic
from users.repo import create_user, find_user_by_username
from users.utils import get_current_user
from users.db import get_supabase_client

router = APIRouter(prefix="/user", tags=["users"])

@router.post("/create", response_model=UserPublic)
def create_profile(body: UserCreate):
    return create_user(body.username, body.email, body.name)

@router.get("/me", response_model=UserPublic)
def get_me(claims: dict = Depends(get_current_user)):
    username = claims["sub"]
    user = find_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Debug: liệt kê tất cả user (cần token hợp lệ)
@router.get("/all")
def list_users(_: dict = Depends(get_current_user)):
    res = (
        get_supabase_client()
        .schema("user_svc")
        .table("users")
        .select("*")
        .execute()
    )
    return res.data or []
