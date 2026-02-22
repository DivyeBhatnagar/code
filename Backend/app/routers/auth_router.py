from fastapi import APIRouter, Depends, HTTPException
from app.utils.firebase_verify import verify_token

router = APIRouter()

@router.get("/verify")
async def verify_user(user=Depends(verify_token)):
    """
    Verify Firebase authentication token
    Returns user information
    """
    return {
        "success": True,
        "user": {
            "uid": user.get("uid"),
            "email": user.get("email"),
            "email_verified": user.get("email_verified", False)
        }
    }

@router.get("/me")
async def get_current_user(user=Depends(verify_token)):
    """Get current authenticated user details"""
    return {
        "uid": user.get("uid"),
        "email": user.get("email"),
        "name": user.get("name", ""),
        "email_verified": user.get("email_verified", False)
    }
