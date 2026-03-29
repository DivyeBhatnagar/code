from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

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

# New Project Builder Schemas
class FileModel(BaseModel):
    path: str = Field(..., description="File path relative to project root")
    content: str = Field(..., description="Complete file content")
    language: Optional[str] = Field(None, description="Programming language for syntax highlighting")

class ProjectBuildRequest(BaseModel):
    prompt: str = Field(..., description="Project description", min_length=10)
    language: str = Field(..., description="Primary programming language (python, javascript, typescript, etc.)")
    project_type: str = Field(..., description="Project type (backend, frontend, fullstack, mobile, etc.)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Create FastAPI app with JWT authentication",
                "language": "python",
                "project_type": "backend"
            }
        }

class ProjectResponse(BaseModel):
    project_name: str = Field(..., description="Generated project name")
    description: str = Field(..., description="Project description")
    files: List[FileModel] = Field(..., description="List of project files")
    dependencies: List[str] = Field(..., description="Required dependencies/packages")
    run_commands: List[str] = Field(..., description="Commands to run the project")
    setup_instructions: List[str] = Field(..., description="Step-by-step setup instructions")

class RegenerateFileRequest(BaseModel):
    file_path: str = Field(..., description="Path of file to regenerate")
    context: str = Field(..., description="Project context/structure")
    instruction: str = Field(..., description="Specific instruction for regeneration")

class RegenerateFileResponse(BaseModel):
    file_path: str
    content: str
    language: Optional[str] = None

class DownloadZipRequest(BaseModel):
    project_data: ProjectResponse = Field(..., description="Complete project data to zip")

# Judge Intelligence Engine Schemas
class JudgeQuestion(BaseModel):
    question: str = Field(..., description="Judge question")
    category: str = Field(..., description="Question category")
    difficulty: str = Field(..., description="easy, medium, hard")

class JudgeAnswer(BaseModel):
    basic_answer: str = Field(..., description="Safe, straightforward answer")
    advanced_answer: str = Field(..., description="Impressive answer with depth")
    power_answer: str = Field(..., description="Judge-winning answer with strategic thinking")

class ProjectWeakness(BaseModel):
    area: str = Field(..., description="Weak area identified")
    severity: str = Field(..., description="Low, Medium, High")
    issue: str = Field(..., description="Description of the issue")
    improvement: str = Field(..., description="How to strengthen before presentation")

class JudgeIntelligenceRequest(BaseModel):
    project_structure: Dict = Field(..., description="Complete project data")
    problem_statement: Optional[str] = Field(None, description="Problem statement")
    solution_description: Optional[str] = Field(None, description="Solution description")
    business_model: Optional[str] = Field(None, description="Business model if any")

class JudgeIntelligenceResponse(BaseModel):
    questions: List[Dict[str, Any]] = Field(..., description="Categorized judge questions with answers")
    weaknesses: List[ProjectWeakness] = Field(..., description="Identified weaknesses")
    confidence_score: int = Field(..., description="Evaluation readiness score (0-100)")
    risk_level: str = Field(..., description="Low, Medium, High")
    improvement_areas: List[str] = Field(..., description="Areas to improve")
    strategic_insights: str = Field(..., description="Overall strategic advice")
