from fastapi import APIRouter, Depends, HTTPException
from app.schemas.ai_schema import AIRequest, AIResponse
from app.services.github_ai_service import generate_ai_response
from app.services.prompt_templates import (
    hackathon_analyzer_prompt,
    mvp_planner_prompt,
    pitch_generator_prompt,
    tech_stack_advisor_prompt
)
from app.utils.firebase_verify import verify_token
from app.utils.logger import logger

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
