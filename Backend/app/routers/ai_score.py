from fastapi import APIRouter, Depends, HTTPException
from app.schemas.score_schema import ProjectScoreRequest, ProjectScoreResponse
from app.services.ai_features_service import score_project_with_ai
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

router = APIRouter()

@router.post("/project-score", response_model=ProjectScoreResponse)
async def score_project(
    request: ProjectScoreRequest,
    user=Depends(verify_token)
):
    """
    Score project health
    Requires Firebase authentication
    """
    try:
        logger.info(f"Project score request - User: {user.get('email')}")
        
        result = await score_project_with_ai(
            project_structure=request.project_structure
        )
        
        logger.info(f"Project scored successfully - Score: {result.get('score')}")
        
        return ProjectScoreResponse(**result)
    
    except Exception as e:
        logger.error(f"Project scoring failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Project scoring failed: {str(e)}"
        )
