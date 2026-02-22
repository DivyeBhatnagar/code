from pydantic import BaseModel, Field
from typing import Dict, Any

class GeneratePitchRequest(BaseModel):
    project_structure: Dict[str, Any] = Field(..., description="Complete project structure")
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_structure": {
                    "name": "my_project",
                    "files": [],
                    "description": "A FastAPI project"
                }
            }
        }

class GeneratePitchResponse(BaseModel):
    problem_statement: str
    solution_overview: str
    tech_stack: str
    architecture_summary: str
    demo_flow: str
    future_scope: str
    two_min_pitch_script: str = Field(..., alias="2_min_pitch_script")
    
    class Config:
        populate_by_name = True
