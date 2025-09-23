from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    balance: float = 0.0
    password: str

class UserPublic(BaseModel):
    username: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    balance: float = 0.0

class MeResponse(BaseModel):
    user: UserPublic
