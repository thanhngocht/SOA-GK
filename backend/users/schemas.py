# schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    name: str

class UserPublic(BaseModel):
    id: str
    username: str
    email: EmailStr
    name: str
    balance: float = 0.0
    created_at: Optional[str] = None


