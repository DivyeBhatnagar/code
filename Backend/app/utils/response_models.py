from pydantic import BaseModel
from typing import Any, Optional

class SuccessResponse(BaseModel):
    """Standard success response model"""
    success: bool = True
    message: str
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    """Standard error response model"""
    success: bool = False
    error: dict
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": {
                    "message": "Error description",
                    "status_code": 400
                }
            }
        }
