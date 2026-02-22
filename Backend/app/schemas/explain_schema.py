from pydantic import BaseModel, Field
from typing import List

class ExplainCodeRequest(BaseModel):
    file_path: str = Field(..., description="Path of the file to explain")
    content: str = Field(..., description="Code content to explain", min_length=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "file_path": "app/main.py",
                "content": "from fastapi import FastAPI\n\napp = FastAPI()"
            }
        }

class ExplainCodeResponse(BaseModel):
    purpose: str = Field(..., description="Overall purpose of the code")
    flow: str = Field(..., description="Execution flow explanation")
    key_components: List[str] = Field(..., description="Key components and their roles")
    improvements: List[str] = Field(..., description="Suggested improvements")
