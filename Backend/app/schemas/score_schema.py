from pydantic import BaseModel, Field
from typing import Dict, Any, List

class ProjectScoreRequest(BaseModel):
    project_structure: Dict[str, Any] = Field(..., description="Complete project structure")
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_structure": {
                    "files": [],
                    "has_tests": False,
                    "has_docker": False
                }
            }
        }

class ScoreBreakdown(BaseModel):
    tests: int = Field(..., ge=0, le=15)
    docker: int = Field(..., ge=0, le=10)
    error_handling: int = Field(..., ge=0, le=12)
    readme: int = Field(..., ge=0, le=10)
    security: int = Field(..., ge=0, le=20)
    structure: int = Field(..., ge=0, le=15)
    logging: int = Field(..., ge=0, le=10)
    env_vars: int = Field(..., ge=0, le=8)

class ProjectScoreResponse(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Overall project score")
    breakdown: ScoreBreakdown
    improvements: List[str] = Field(..., description="List of suggested improvements")
