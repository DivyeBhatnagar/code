from fastapi import APIRouter, Depends, HTTPException
from app.schemas.refactor_schema import RefactorRequest, RefactorResponse
from app.services.ai_features_service import refactor_code_with_ai
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

router = APIRouter()

@router.post("/refactor", response_model=RefactorResponse)
async def refactor_code(
    request: RefactorRequest,
    user=Depends(verify_token)
):
    """
    Refactor code with AI
    Requires Firebase authentication
    """
    try:
        logger.info(f"Code refactor request - File: {request.file_path}, User: {user.get('email')}")
        
        result = await refactor_code_with_ai(
            file_path=request.file_path,
            content=request.content,
            project_context=request.project_context or {}
        )
        
        logger.info(f"Code refactored successfully - File: {request.file_path}")
        
        return RefactorResponse(**result)
    
    except Exception as e:
        logger.error(f"Code refactoring failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Code refactoring failed: {str(e)}"
        )
