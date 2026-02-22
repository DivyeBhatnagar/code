from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message", min_length=1)
    project_context: Optional[Dict[str, Any]] = Field(None, description="Project context")
    active_file: Optional[str] = Field(None, description="Currently active file path")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "How do I add authentication?",
                "project_context": {},
                "active_file": "app/main.py"
            }
        }

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI response")
