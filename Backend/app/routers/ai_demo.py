from fastapi import APIRouter, Depends, HTTPException
from app.schemas.demo_schema import DemoModeRequest, DemoModeResponse
from app.services.ai_features_service import generate_demo_mode_with_ai
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

router = APIRouter()

@router.post("/demo-mode", response_model=DemoModeResponse)
async def demo_mode(
    request: DemoModeRequest,
    user=Depends(verify_token)
):
    """
    Generate demo mode presentation
    Requires Firebase authentication
    """
    try:
        logger.info(f"Demo mode request - User: {user.get('email')}")
        
        result = await generate_demo_mode_with_ai(
            project_structure=request.project_structure
        )
        
        logger.info(f"Demo mode generated successfully")
        
        return DemoModeResponse(**result)
    
    except Exception as e:
        logger.error(f"Demo mode generation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Demo mode generation failed: {str(e)}"
        )
