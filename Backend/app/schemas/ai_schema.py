from pydantic import BaseModel, Field
from typing import Optional

class AIRequest(BaseModel):
    type: str = Field(..., description="Type of AI generation (hackathon_analyzer, mvp_planner, pitch_generator, tech_stack_advisor)")
    input: str = Field(..., description="Problem statement or input text", min_length=10)
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "mvp_planner",
                "input": "Build a platform that helps students find study groups based on their courses and learning styles"
            }
        }

class AIResponse(BaseModel):
    success: bool
    type: str
    result: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "type": "mvp_planner",
                "result": "{\"core_features\": [...], \"timeline\": [...]}"
            }
        }
