from pydantic import BaseModel, Field
from typing import Dict, Any

class DemoModeRequest(BaseModel):
    project_structure: Dict[str, Any] = Field(..., description="Complete project structure")
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_structure": {
                    "name": "my_project",
                    "description": "A FastAPI project"
                }
            }
        }

class DemoModeResponse(BaseModel):
    problem_explained: str
    solution_explained: str
    component_breakdown: str
    how_to_demo: str
    judge_impression_tips: str
    two_min_script: str = Field(..., alias="2_min_script")
    
    class Config:
        populate_by_name = True
