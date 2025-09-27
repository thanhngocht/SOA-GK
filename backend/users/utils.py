# users/utils.py
import os
import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRE_MINUTES

logger = logging.getLogger(__name__)

JWT_SECRET = os.getenv("JWT_SECRET", "default-secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


security = HTTPBearer(auto_error=False)


def decode_token(token: str):
    try:
        unverified = jwt.get_unverified_claims(token)
        print(f"[UserService] Unverified token claims: {unverified}")
    except Exception as e:
        print(f"[UserService] Cannot parse unverified claims: {e}")
    return jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM],
        options={"verify_aud": False}
    )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        print("[UserService] Missing Authorization header")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    token = credentials.credentials
    print(f"[UserService] Received token (first 20 chars): {token[:20]}...")
    print("User JWT_SECRET startswith:", JWT_SECRET[:10], "len=", len(JWT_SECRET))

    try:
        claims = decode_token(token)
        print(f"[UserService] Verified token claims: {claims}")
        if "sub" not in claims:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token claims: missing 'sub'")
        return claims
    except JWTError as e:
        print(f"[UserService] JWT decode error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
