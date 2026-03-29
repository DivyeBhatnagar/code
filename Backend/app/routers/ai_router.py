from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.ai_schema import (
    AIRequest, AIResponse,
    ProjectBuildRequest, ProjectResponse,
    RegenerateFileRequest, RegenerateFileResponse,
    DownloadZipRequest,
    JudgeIntelligenceRequest, JudgeIntelligenceResponse
)
from app.services.github_ai_service import generate_ai_response
from app.services.project_builder_service import build_project_with_ai, regenerate_file_with_ai
from app.services.judge_intelligence_service import generate_judge_intelligence, evaluate_answer_quality
from app.services.prompt_templates import (
    hackathon_analyzer_prompt,
    mvp_planner_prompt,
    pitch_generator_prompt,
    tech_stack_advisor_prompt
)
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger
import zipfile
import io
import os
from pathlib import Path

router = APIRouter()

PROMPT_TEMPLATES = {
    "hackathon_analyzer": hackathon_analyzer_prompt,
    "mvp_planner": mvp_planner_prompt,
    "pitch_generator": pitch_generator_prompt,
    "tech_stack_advisor": tech_stack_advisor_prompt
}

@router.post("/generate", response_model=AIResponse)
async def generate_ai_content(
    request: AIRequest,
    user=Depends(verify_token)
):
    """
    Generate AI content based on request type
    Requires Firebase authentication
    """
    try:
        logger.info(f"AI generation request - Type: {request.type}, User: {user.get('email')}")
        
        # Validate request type
        if request.type not in PROMPT_TEMPLATES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid type. Supported: {list(PROMPT_TEMPLATES.keys())}"
            )
        
        # Get appropriate prompt template
        prompt_generator = PROMPT_TEMPLATES[request.type]
        prompt = prompt_generator(request.input)
        
        # Generate AI response
        ai_result = await generate_ai_response(prompt)
        
        logger.info(f"AI generation successful - Type: {request.type}, User: {user.get('email')}")
        
        return AIResponse(
            success=True,
            type=request.type,
            result=ai_result
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI generation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {str(e)}"
        )

@router.get("/types")
async def get_supported_types(user=Depends(verify_token)):
    """Get list of supported AI generation types"""
    return {
        "supported_types": list(PROMPT_TEMPLATES.keys()),
        "user": user.get("email", "unknown")
    }

@router.post("/build-project", response_model=ProjectResponse)
async def build_project(
    request: ProjectBuildRequest,
    user=Depends(verify_token)
):
    """
    Build a complete project with AI
    Returns structured JSON with files, dependencies, and setup instructions
    """
    try:
        logger.info(f"Project build request - Language: {request.language}, Type: {request.project_type}, User: {user.get('email')}")
        
        # Generate project with AI
        project = await build_project_with_ai(
            prompt=request.prompt,
            language=request.language,
            project_type=request.project_type
        )
        
        logger.info(f"Project built successfully - Name: {project.project_name}, Files: {len(project.files)}")
        
        return project
    
    except Exception as e:
        logger.error(f"Project build failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Project build failed: {str(e)}"
        )

@router.post("/regenerate-file", response_model=RegenerateFileResponse)
async def regenerate_file(
    request: RegenerateFileRequest,
    user=Depends(verify_token)
):
    """
    Regenerate a specific file with AI based on instruction
    """
    try:
        logger.info(f"File regeneration request - File: {request.file_path}, User: {user.get('email')}")
        
        result = await regenerate_file_with_ai(
            file_path=request.file_path,
            context=request.context,
            instruction=request.instruction
        )
        
        logger.info(f"File regenerated successfully - File: {request.file_path}")
        
        return RegenerateFileResponse(**result)
    
    except Exception as e:
        logger.error(f"File regeneration failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"File regeneration failed: {str(e)}"
        )

@router.post("/download-zip")
async def download_project_zip(
    request: DownloadZipRequest,
    user=Depends(verify_token)
):
    """
    Generate and download project as ZIP file
    """
    try:
        logger.info(f"ZIP download request - Project: {request.project_data.project_name}, User: {user.get('email')}")
        
        # Create ZIP in memory
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Add all project files
            for file in request.project_data.files:
                zip_file.writestr(file.path, file.content)
            
            # Add dependencies file based on language
            if request.project_data.dependencies:
                deps_content = '\n'.join(request.project_data.dependencies)
                
                # Determine dependency file name
                if any('python' in f.path.lower() or f.path.endswith('.py') for f in request.project_data.files):
                    zip_file.writestr('requirements.txt', deps_content)
                elif any(f.path.endswith(('.js', '.ts', '.jsx', '.tsx')) for f in request.project_data.files):
                    # Create package.json if not exists
                    package_json = {
                        "name": request.project_data.project_name,
                        "version": "1.0.0",
                        "description": request.project_data.description,
                        "dependencies": {dep: "latest" for dep in request.project_data.dependencies}
                    }
                    import json
                    zip_file.writestr('package.json', json.dumps(package_json, indent=2))
            
            # Add README with setup instructions
            readme_content = f"# {request.project_data.project_name}\n\n"
            readme_content += f"{request.project_data.description}\n\n"
            readme_content += "## Setup Instructions\n\n"
            for i, instruction in enumerate(request.project_data.setup_instructions, 1):
                readme_content += f"{i}. {instruction}\n"
            readme_content += "\n## Run Commands\n\n"
            for cmd in request.project_data.run_commands:
                readme_content += f"```bash\n{cmd}\n```\n\n"
            
            zip_file.writestr('README.md', readme_content)
        
        zip_buffer.seek(0)
        
        logger.info(f"ZIP created successfully - Project: {request.project_data.project_name}")
        
        return StreamingResponse(
            iter([zip_buffer.getvalue()]),
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename={request.project_data.project_name}.zip"
            }
        )
    
    except Exception as e:
        logger.error(f"ZIP creation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"ZIP creation failed: {str(e)}"
        )

@router.post("/judge-intelligence")
async def get_judge_intelligence(
    request: JudgeIntelligenceRequest,
    user=Depends(verify_token)
):
    """
    Generate comprehensive judge intelligence analysis
    
    This is NOT a generic Q&A generator. It analyzes the specific project
    and predicts realistic, sharp questions judges will ask based on
    evaluation criteria and project weaknesses.
    
    Features:
    - Project-specific questions (not generic)
    - Categorized by evaluation criteria
    - Three-tier answers (Basic, Advanced, Power)
    - Weakness detection with improvements
    - Confidence scoring
    - Strategic insights
    """
    try:
        logger.info(f"Judge intelligence request - Project: {request.project_structure.get('project_name')}, User: {user.get('email')}")
        
        result = await generate_judge_intelligence(
            project_structure=request.project_structure,
            problem_statement=request.problem_statement,
            solution_description=request.solution_description,
            business_model=request.business_model
        )
        
        logger.info(f"Judge intelligence generated - Questions: {sum(len(v) for v in result.get('questions_by_category', {}).values())}")
        
        return result
    
    except Exception as e:
        logger.error(f"Judge intelligence failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Judge intelligence generation failed: {str(e)}"
        )

@router.post("/evaluate-answer")
async def evaluate_answer(
    request: dict,
    user=Depends(verify_token)
):
    """
    Evaluate user's answer quality for simulation mode
    Provides feedback and improvement suggestions
    """
    try:
        logger.info(f"Answer evaluation request - User: {user.get('email')}")
        
        result = await evaluate_answer_quality(
            question=request.get('question'),
            user_answer=request.get('user_answer'),
            project_context=request.get('project_context', {})
        )
        
        logger.info(f"Answer evaluated - Score: {result.get('score')}")
        
        return result
    
    except Exception as e:
        logger.error(f"Answer evaluation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Answer evaluation failed: {str(e)}"
        )
