from fastapi import APIRouter, Depends, HTTPException
from app.schemas.pitch_schema import GeneratePitchRequest, GeneratePitchResponse
from app.services.ai_features_service import generate_pitch_with_ai
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

router = APIRouter()

@router.post("/generate-pitch-from-code", response_model=GeneratePitchResponse)
async def generate_pitch(
    request: GeneratePitchRequest,
    user=Depends(verify_token)
):
    """
    Generate pitch from project code
    Requires Firebase authentication
    """
    try:
        logger.info(f"Pitch generation request - User: {user.get('email')}")
        
        result = await generate_pitch_with_ai(
            project_structure=request.project_structure
        )
        
        logger.info(f"Pitch generated successfully")
        
        return GeneratePitchResponse(**result)
    
    except Exception as e:
        logger.error(f"Pitch generation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Pitch generation failed: {str(e)}"
        )
