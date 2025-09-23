# app/users/router.py
from fastapi import APIRouter
from .schemas import UserCreate, UserPublic
from .service import create_user

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserPublic)
def register_user(payload: UserCreate):
    return create_user(payload)
