from app.services.github_ai_service import generate_ai_response
from app.schemas.hackathon_schema import HackathonSessionCreate, HackathonPlan
import json
import uuid
from datetime import datetime

async def generate_hackathon_plan(session_data: HackathonSessionCreate) -> HackathonPlan:
    """
    Generate a comprehensive hackathon execution plan with enhanced features
    """
    
    # Build team context
    team_context = ""
    if session_data.team_members:
        team_context = "\n\nTEAM MEMBERS:\n"
        for i, member in enumerate(session_data.team_members, 1):
            team_context += f"{i}. {member.name} - Skills: {member.skill_strengths}, Preferred Role: {member.preferred_role}\n"
    
    prompt = f"""You are an expert hackathon strategist and execution manager. Create a comprehensive execution plan for this hackathon project.

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

CRITICAL FORMATTING RULE:
Return clean structured text in plain format.
Do NOT use markdown symbols such as: **, ##, ###, ---, ``` or any decorative formatting.
Do NOT use asterisks for bold.
Do NOT use slash-based formatting.
Output must be clean readable structured plain text with proper spacing.

Create a detailed execution plan with the following sections:

EXECUTION PLAN

Provide a high-level overview of the project approach and strategy.


VISUAL TIMELINE BREAKDOWN

Create a structured hour-by-hour timeline like this format:
Hour 0-2: Planning and Setup
    - Define requirements
    - Set up development environment
    - Create project structure

Hour 2-6: Backend Development
    - Build API endpoints
    - Implement core logic
    - Set up database

Hour 6-10: Frontend Development
    - Create UI components
    - Connect to backend
    - Implement user flows

Hour 10-12: Testing and Presentation
    - Test all features
    - Prepare demo
    - Create presentation

Make it visually clean using spacing only (no markdown characters).


TEAM ROLE ASSIGNMENTS

For each team member, assign:
- Primary Role
- Specific Responsibilities
- Key Deliverables
- Collaboration Points


MVP SCOPE

Core Features (Must-Have):
List 3-5 essential features needed for a working demo.

Optional Features (If Time Permits):
List 2-3 features that would enhance the project.

Stretch Goals (Ambitious Additions):
List 1-2 advanced features if everything goes smoothly.


TECH STACK RECOMMENDATIONS

Frontend:
- Framework/Library
- Styling Solution
- Key Libraries

Backend:
- Framework
- Database
- Authentication
- Key Libraries

Deployment:
- Hosting Platform
- CI/CD Tools

Development Tools:
- Version Control
- Testing Framework
- API Testing


TECHNICAL KICKSTART GUIDE

Backend Setup Steps:
1. Environment Setup
   - Install required software
   - Set up virtual environment or package manager

2. Installing Dependencies
   - List exact installation commands
   - Specify versions if critical

3. Creating Main Entry File
   - File structure
   - Basic server setup code approach

4. Creating Service Layer
   - Business logic organization
   - Data models structure

5. Creating API Endpoints
   - Route definitions
   - Request/response handling

6. Testing API Locally
   - Testing tools to use
   - Sample test commands

Frontend Setup Steps:
1. Creating Project
   - Project initialization command
   - Folder structure setup

2. Installing Styling Framework
   - CSS framework installation
   - Configuration steps

3. Creating Main Components
   - Component architecture
   - State management approach

4. Connecting API
   - API client setup
   - Environment configuration

5. Handling Loading and Error States
   - Loading indicators
   - Error boundaries
   - User feedback patterns


SUGGESTED PROJECT STRUCTURE

Provide a clean text-based folder structure like:

backend/
    app/
        main.py
        routes.py
        services/
            logic.py
        models/
            database.py
    tests/
    requirements.txt

frontend/
    src/
        components/
        pages/
        services/
        utils/
    public/
    package.json


BUILD INITIALIZATION DATA

Provide structured data in plain text format (not JSON syntax) that can be used to auto-generate code:

Build Type: [backend/frontend/fullstack]
Project Name: [name]
Core Features:
    - Feature 1
    - Feature 2
    - Feature 3
Suggested Tech Stack:
    - Technology 1
    - Technology 2
    - Technology 3
Primary Language: [language]
Project Type: [api/web/mobile]


EXECUTION CONFIDENCE SCORE

Score: [X out of 100]

Confidence Explanation:
Explain why the score is high or low based on:
- Team skill alignment with required technologies
- Hackathon duration vs scope complexity
- Feature feasibility within timeframe
- Risk factors


RISK ANALYSIS

For each risk, provide:
Risk: [Description]
Type: [Technical/Time/Team]
Severity: [High/Medium/Low]
Mitigation Strategy: [Specific actions]


PLAN OPTIMIZATION SUGGESTIONS

Analyze the plan and provide:

Task Redistribution:
If workload is imbalanced, suggest how to redistribute tasks.

Timeline Compression:
If timeline is tight, suggest which tasks can be parallelized or shortened.

Feature Reduction:
If scope is too large, suggest which features to defer.

Performance Improvements:
Suggest optimizations for faster development.


TWO-MINUTE DEMO SCRIPT

Create a presentation script with:

Opening (15 seconds):
Strong hook explaining the problem.

Problem Statement (20 seconds):
Why this problem matters and who it affects.

Solution Explanation (30 seconds):
How your solution solves the problem uniquely.

Architecture Explanation (20 seconds):
Brief technical overview of how it works.

Demo Flow (25 seconds):
Key features to demonstrate in order.

Closing Statement (10 seconds):
Strong memorable closing line about impact.

No video suggestions. Text only. Professional tone.


Remember: Output must be clean, structured, plain text with no markdown symbols or decorative characters. Use spacing and clear section headers only."""

    # Generate AI response
    ai_response = await generate_ai_response(prompt)
    
    # Parse the response into structured data
    session_id = str(uuid.uuid4())
    
    # Return the enhanced plan
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
