from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TeamMember(BaseModel):
    name: str
    skill_strengths: str
    preferred_role: str

class HackathonSessionCreate(BaseModel):
    hackathon_name: str
    duration_hours: int
    team_size: int
    skill_levels: str
    roles_decided: bool
    target_domain: str
    final_goal: str
    team_members: Optional[List[TeamMember]] = []
    problem_statement: str

class TimeBlock(BaseModel):
    hours: str
    tasks: List[str]
    assigned_to: List[str]

class TeamRole(BaseModel):
    member_name: str
    role: str
    responsibilities: List[str]

class MVPScope(BaseModel):
    core_features: List[str]
    optional_features: List[str]
    stretch_goals: List[str]

class RiskAlert(BaseModel):
    type: str
    severity: str
    message: str
    mitigation: str

class HackathonPlan(BaseModel):
    session_id: str
    hackathon_name: str
    timeline: List[TimeBlock]
    team_roles: List[TeamRole]
    mvp_scope: MVPScope
    tech_stack: dict
    risks: List[RiskAlert]
    created_at: str

class CodeGenerateRequest(BaseModel):
    prompt: str
    language: str
    project_type: str

class CodeGenerateResponse(BaseModel):
    success: bool
    project_structure: dict
    files: List[dict]
    installation_steps: List[str]
    run_commands: List[str]
    deployment_steps: List[str]
