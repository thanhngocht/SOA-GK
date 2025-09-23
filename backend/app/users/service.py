from fastapi import HTTPException, status
from ..utils import hash_password
from .schemas import UserCreate, UserPublic
from .repo import insert_user, find_user_by_username

def create_user(payload: UserCreate) -> UserPublic:
    # Check if username exists
    if find_user_by_username(payload.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already exists"
        )

    # Create user document
    user_doc = {
        "username": payload.username,
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "balance": payload.balance,
        "password_hash": hash_password(payload.password)
    }

    # Insert and return user
    saved = insert_user(user_doc)
    
    return UserPublic(
        username=saved["username"],
        name=saved["name"], 
        email=saved["email"],
        phone=saved.get("phone"),
        balance=saved.get("balance", 0.0)
    )