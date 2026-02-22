from app.services.github_ai_service import generate_ai_response
from app.schemas.hackathon_schema import HackathonSessionCreate, HackathonPlan
import json
import uuid
from datetime import datetime

async def generate_hackathon_plan(session_data: HackathonSessionCreate) -> HackathonPlan:
    """
    Generate a comprehensive hackathon execution plan
    """
    
    # Build team context
    team_context = ""
    if session_data.team_members:
        team_context = "\n\nTEAM MEMBERS:\n"
        for i, member in enumerate(session_data.team_members, 1):
            team_context += f"{i}. {member.name} - Skills: {member.skill_strengths}, Preferred Role: {member.preferred_role}\n"
    
    prompt = f"""You are an expert hackathon strategist. Create a comprehensive execution plan for this hackathon project.

HACKATHON DETAILS:
Name: {session_data.hackathon_name}
Duration: {session_data.duration_hours} hours
Team Size: {session_data.team_size}
Skill Levels: {session_data.skill_levels}
Target Domain: {session_data.target_domain}
Final Goal: {session_data.final_goal}
{team_context}

PROBLEM STATEMENT:
{session_data.problem_statement}

Create a detailed execution plan with:

1. TIMELINE BREAKDOWN
Break the {session_data.duration_hours} hours into logical time blocks (e.g., 0-4 hours, 4-8 hours, etc.)
For each block, list specific tasks and who should work on them.

2. TEAM ROLE ASSIGNMENTS
Assign optimal roles to each team member based on their skills.
List specific responsibilities for each person.

3. MVP SCOPE
- Core Features (must-have for demo)
- Optional Features (if time permits)
- Stretch Goals (ambitious additions)

4. TECH STACK RECOMMENDATIONS
Suggest specific technologies for:
- Frontend
- Backend  
- Database
- Deployment
- Key Libraries/Tools

5. RISK ANALYSIS
Identify potential risks with:
- Type (technical/time/team)
- Severity (high/medium/low)
- Mitigation strategy

Format your response as structured sections with clear headings. Be specific and actionable."""

    # Generate AI response
    ai_response = await generate_ai_response(prompt)
    
    # Parse the response into structured data
    # For now, we'll create a structured format from the text response
    session_id = str(uuid.uuid4())
    
    # Create a basic structure (in production, you'd parse the AI response more intelligently)
    plan = HackathonPlan(
        session_id=session_id,
        hackathon_name=session_data.hackathon_name,
        timeline=[],
        team_roles=[],
        mvp_scope={
            "core_features": [],
            "optional_features": [],
            "stretch_goals": []
        },
        tech_stack={},
        risks=[],
        created_at=datetime.now().isoformat()
    )
    
    # Store the full AI response as a formatted plan
    # This will be returned as the complete plan text
    return {
        "session_id": session_id,
        "hackathon_name": session_data.hackathon_name,
        "full_plan": ai_response,
        "created_at": datetime.now().isoformat()
    }


async def generate_code_structure(prompt: str, language: str, project_type: str) -> dict:
    """
    Generate complete code structure with files and setup instructions
    """
    
    code_prompt = f"""You are an expert software architect. Generate a complete project structure for this request.

REQUIREMENTS:
Language/Framework: {language}
Project Type: {project_type}
Description: {prompt}

Provide a comprehensive response with:

1. PROJECT STRUCTURE
Show the complete folder and file structure using a tree format.

2. KEY FILES
For each important file, provide:
- File path
- Purpose
- Key code snippets or structure

3. INSTALLATION STEPS
List exact commands to set up the project (npm install, pip install, etc.)

4. RUN COMMANDS
Commands to start development server, run tests, etc.

5. DEPLOYMENT STEPS
How to deploy this project to production.

6. ENVIRONMENT VARIABLES
List any required environment variables.

Be specific and provide actual code examples. Make it production-ready."""

    ai_response = await generate_ai_response(code_prompt)
    
    return {
        "success": True,
        "code_output": ai_response,
        "language": language,
        "project_type": project_type
    }
