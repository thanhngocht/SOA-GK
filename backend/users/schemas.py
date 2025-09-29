# users/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserCreate(BaseModel):
    username: str = Field(min_length=3)
    email: EmailStr
    name: str
    phone: Optional[str] = None
    gender: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None


class BalanceReq(BaseModel):
    amount: float

class UserPublic(BaseModel):
    id: str
    username: str
    email: EmailStr
    name: str
    balance: float
    created_at: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None

class UserList(BaseModel):
    items: List[UserPublic]
    limit: int
    offset: int
