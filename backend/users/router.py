# users/router.py
from fastapi import APIRouter, HTTPException, Depends, Query
from users.schemas import UserCreate, UserPublic, UserUpdate, BalanceReq, UserList
from users.utils import get_current_user

from users.service import (
    create_profile_service,
    get_me_service,
    list_users_service,
    update_profile_service,
    credit_balance_service,
    debit_balance_service,
    delete_user_service,
)

router = APIRouter(prefix="/user", tags=["users"])

@router.post("/create", response_model=UserPublic)
def create_profile(body: UserCreate):
    return create_profile_service(
        username=body.username,
        email=body.email,
        name=body.name,
        phone=body.phone,
        gender=body.gender,
    )

@router.get("/me", response_model=UserPublic)
def get_me(claims: dict = Depends(get_current_user)):
    return get_me_service(username_sub=claims["sub"])

@router.get("/all", response_model=UserList)
def list_users(
    _: dict = Depends(get_current_user),
    limit: int = Query(100, ge=0, le=1000),
    offset: int = Query(0, ge=0),
):
    items = list_users_service(limit=limit, offset=offset)
    return {"items": items, "limit": limit, "offset": offset}


# # router.py
# @router.get("/all-public", response_model=UserList)
# def list_users_public(
#     limit: int = Query(100, ge=0, le=1000),
#     offset: int = Query(0, ge=0),
# ):
#     rows = list_users_service(limit=limit, offset=offset)
#     items = [
#         {"username": r["username"], "name": r["name"], "created_at": r.get("created_at")}
#         for r in rows
#     ]
#     return {"items": items, "limit": limit, "offset": offset}


@router.put("/update", response_model=UserPublic)
def update_me(body: UserUpdate, claims: dict = Depends(get_current_user)):
    return update_profile_service(
        username=claims["sub"],
        email=body.email,
        name=body.name,
        phone=body.phone,
        gender=body.gender,
    )

@router.post("/balance/credit", response_model=UserPublic)
def credit_balance(body: BalanceReq, claims: dict = Depends(get_current_user)):
    return credit_balance_service(username=claims["sub"], amount=body.amount)

@router.post("/balance/debit", response_model=UserPublic)
def debit_balance(body: BalanceReq, claims: dict = Depends(get_current_user)):
    return debit_balance_service(username=claims["sub"], amount=body.amount)

@router.delete("/delete", status_code=204)
def delete_me(claims: dict = Depends(get_current_user)):
    delete_user_service(username=claims["sub"])
    return
