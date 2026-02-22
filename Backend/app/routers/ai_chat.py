from fastapi import APIRouter, Depends, HTTPException
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.ai_features_service import chat_with_ai
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user=Depends(verify_token)
):
    """
    Chat with AI about the project
    Requires Firebase authentication
    """
    try:
        logger.info(f"Chat request - User: {user.get('email')}, Message: {request.message[:50]}...")
        
        response_text = await chat_with_ai(
            message=request.message,
            project_context=request.project_context or {},
            active_file=request.active_file
        )
        
        logger.info(f"Chat response generated successfully")
        
        return ChatResponse(response=response_text)
    
    except Exception as e:
        logger.error(f"Chat failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {str(e)}"
        )
