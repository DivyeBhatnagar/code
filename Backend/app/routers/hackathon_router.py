from fastapi import APIRouter, Depends, HTTPException
from app.schemas.hackathon_schema import (
    HackathonSessionCreate,
    CodeGenerateRequest
)
from app.services.hackathon_service import generate_hackathon_plan, generate_code_structure
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

router = APIRouter()

@router.post("/create-session")
async def create_hackathon_session(
    session_data: HackathonSessionCreate,
    user=Depends(verify_token)
):
    """
    Create a new hackathon session and generate execution plan
    """
    try:
        logger.info(f"Creating hackathon session: {session_data.hackathon_name}, User: {user.get('email')}")
        
        # Generate comprehensive plan
        plan = await generate_hackathon_plan(session_data)
        
        logger.info(f"Hackathon session created: {plan['session_id']}")
        
        return {
            "success": True,
            "data": plan
        }
    
    except Exception as e:
        logger.error(f"Failed to create hackathon session: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create session: {str(e)}"
        )


@router.post("/generate-code")
async def generate_code(
    request: CodeGenerateRequest,
    user=Depends(verify_token)
):
    """
    Generate code structure and files
    """
    try:
        logger.info(f"Code generation request - Language: {request.language}, User: {user.get('email')}")
        
        result = await generate_code_structure(
            request.prompt,
            request.language,
            request.project_type
        )
        
        logger.info(f"Code generation successful")
        
        return result
    
    except Exception as e:
        logger.error(f"Code generation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Code generation failed: {str(e)}"
        )


@router.get("/session/{session_id}")
async def get_session(
    session_id: str,
    user=Depends(verify_token)
):
    """
    Retrieve a hackathon session by ID
    """
    # In production, this would fetch from database
    # For now, return a placeholder
    return {
        "success": True,
        "message": "Session retrieval - implement database storage"
    }
