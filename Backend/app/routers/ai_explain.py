from fastapi import APIRouter, Depends, HTTPException
from app.schemas.explain_schema import ExplainCodeRequest, ExplainCodeResponse
from app.services.ai_features_service import explain_code_with_ai
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

router = APIRouter()

@router.post("/explain-code", response_model=ExplainCodeResponse)
async def explain_code(
    request: ExplainCodeRequest,
    user=Depends(verify_token)
):
    """
    Explain code with AI
    Requires Firebase authentication
    """
    try:
        logger.info(f"Code explanation request - File: {request.file_path}, User: {user.get('email')}")
        
        result = await explain_code_with_ai(
            file_path=request.file_path,
            content=request.content
        )
        
        logger.info(f"Code explained successfully - File: {request.file_path}")
        
        return ExplainCodeResponse(**result)
    
    except Exception as e:
        logger.error(f"Code explanation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Code explanation failed: {str(e)}"
        )
