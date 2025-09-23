from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from .schemas import LoginRequest, LoginResponse, MeResponse
from .service import login_auth
from ..utils import decode_token

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user_data(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = decode_token(token)
        required_fields = ["sub", "email", "name"]
        
        if not all(field in payload for field in required_fields):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token data"
            )
            
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    return login_auth(req.username, req.password)

@router.get("/me", response_model=MeResponse)
def me(user_data: dict = Depends(get_current_user_data)):
    return MeResponse(
        username=user_data["sub"],
        email=user_data["email"],
        name=user_data["name"],
        balance=float(user_data.get("balance", 0.0))
    )