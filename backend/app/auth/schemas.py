from pydantic import BaseModel, EmailStr
from typing import Optional
#kiểm soát validate
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    message: str
    username: str
    access_token: str
    token_type: str = "bearer"

class MeResponse(BaseModel):
    username: str
    email: EmailStr
    name: str
    balance: float = 0.0
