# service.py
import os
from fastapi import HTTPException, status
from auth.utils import create_access_token, verify_password, hash_password
from auth.repo import find_auth_by_username, create_auth
from auth.schemas import LoginResponse, SignupResponse
import httpx
from typing import Optional

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8002/user")

# def login_auth(username: str, password: str) -> LoginResponse:
#     auth = find_auth_by_username(username)
#     if not auth or not verify_password(password, auth["password_hash"]):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid credentials"
#         )

#     token_data = {
#         "sub": auth["username"],                 # username
#         "user_id": auth.get("external_user_id")  # id bên user-service (nếu có)
#     }
#     access_token = create_access_token(token_data)
#     return LoginResponse(message="Login successful", username=username, access_token=access_token)
def login_auth(username: str, password: str) -> LoginResponse:
    print(f"[AuthService] Login attempt: {username}")
    auth = find_auth_by_username(username)
    if not auth:
        print("[AuthService] User not found in auth table")
    if not auth or not verify_password(password, auth["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token_data = {
        "sub": auth["username"],
        "user_id": auth.get("external_user_id"),
    }
    print(f"[AuthService] Login success, token_data={token_data}")
    access_token = create_access_token(token_data)
    return LoginResponse(message="Login successful", username=username, access_token=access_token)


def signup_auth(username: str, email: str, name: str, password: str) -> SignupResponse:
    if find_auth_by_username(username):
        raise HTTPException(status_code=400, detail="Username already exists")

    # tạo profile ở user-service
    try:
        with httpx.Client(timeout=10.0) as client:
            r = client.post(
                f"{USER_SERVICE_URL}/create",
                json={"username": username, "email": email, "name": name}
            )
            r.raise_for_status()
            user = r.json()  # {"id": "...", ...}
    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"User service failed: {e}")

    pwd_hash = hash_password(password)
    _ = create_auth(username=username, password_hash=pwd_hash, external_user_id=user["id"])
    return SignupResponse(message="Signup successful", username=username)


