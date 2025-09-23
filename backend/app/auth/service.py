from fastapi import HTTPException, status
from ..utils import create_access_token, verify_password
from ..users.repo import find_user_by_username
from .schemas import LoginResponse

def login_auth(username: str, password: str) -> LoginResponse:
    user = find_user_by_username(username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Include all required user data in token
    token_data = {
        "sub": user["username"],
        "email": user["email"],
        "name": user["name"],
        "balance": float(user.get("balance", 0.0))
    }
    
    access_token = create_access_token(token_data)
    
    return LoginResponse(
        message="Login successful",
        username=username,
        access_token=access_token
    )