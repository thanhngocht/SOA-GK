from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt, JWTError

JWT_SECRET = "123"       # đổi khi deploy
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60

_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    return _pwd_ctx.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_ctx.verify(plain, hashed)

def create_access_token(user_data: dict, expires_minutes: Optional[int] = None) -> str:
    to_encode = user_data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or JWT_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
