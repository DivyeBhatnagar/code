from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class RefactorRequest(BaseModel):
    scope: str = Field(..., description="Refactor scope: 'file' or 'project'")
    file_path: str = Field(..., description="Path of the file to refactor")
    content: str = Field(..., description="Code content to refactor")
    project_context: Optional[Dict[str, Any]] = Field(None, description="Project context for better refactoring")
    
    class Config:
        json_schema_extra = {
            "example": {
                "scope": "file",
                "file_path": "app/main.py",
                "content": "def bad_function():\n    x=1\n    return x",
                "project_context": {}
            }
        }

class RefactoredFile(BaseModel):
    path: str
    content: str

class RefactorResponse(BaseModel):
    updated_files: List[RefactoredFile] = Field(..., description="List of refactored files")
    explanation: str = Field(..., description="Explanation of improvements made")
