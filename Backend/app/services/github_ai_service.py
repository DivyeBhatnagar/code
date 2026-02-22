import httpx
from app.config import settings
import re

# GitHub Models API endpoint
GITHUB_API_URL = "https://models.inference.ai.azure.com/chat/completions"

def clean_response(text: str) -> str:
    """
    Clean up AI response by removing JSON formatting and code blocks
    
    Args:
        text: Raw AI response
        
    Returns:
        Cleaned text without JSON/code formatting
    """
    # Remove ```json and ``` markers
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    
    # If the response is wrapped in JSON, extract and format it nicely
    if text.strip().startswith('{') or text.strip().startswith('['):
        try:
            import json
            # Try to parse as JSON and convert to readable text
            data = json.loads(text)
            
            # Convert JSON to readable text format
            readable_text = []
            
            def format_value(key, value, indent=0):
                prefix = "  " * indent
                if isinstance(value, dict):
                    readable_text.append(f"\n{prefix}{key.upper().replace('_', ' ')}:")
                    for k, v in value.items():
                        format_value(k, v, indent + 1)
                elif isinstance(value, list):
                    readable_text.append(f"\n{prefix}{key.upper().replace('_', ' ')}:")
                    for i, item in enumerate(value, 1):
                        if isinstance(item, dict):
                            for k, v in item.items():
                                format_value(k, v, indent + 1)
                        else:
                            readable_text.append(f"{prefix}  • {item}")
                else:
                    readable_text.append(f"{prefix}{key.replace('_', ' ').title()}: {value}")
            
            # Handle top-level structure
            if isinstance(data, dict):
                for key, value in data.items():
                    format_value(key, value)
            
            return '\n'.join(readable_text).strip()
        except:
            # If JSON parsing fails, fall back to regex cleaning
            pass
    
    # Fallback: aggressive text cleaning
    text = re.sub(r'^\s*\{', '', text)
    text = re.sub(r'\}\s*$', '', text)
    text = re.sub(r'"(\w+)":\s*"([^"]+)"', r'\1: \2', text)
    text = re.sub(r'"(\w+)":\s*\{', r'\n\n\1:\n', text)
    text = re.sub(r'\},?\s*', '\n', text)
    text = re.sub(r'[{}\[\]"]', '', text)
    
    return text.strip()

async def generate_ai_response(prompt: str) -> str:
    """
    Generate AI response using GitHub Models API (GPT-4)
    
    Args:
        prompt: The input prompt for AI generation
        
    Returns:
        Generated text response (cleaned of JSON formatting)
    """
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                GITHUB_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful AI assistant. CRITICAL: You must respond ONLY in plain text format. DO NOT use JSON, code blocks, or any structured data format. Write naturally as if you're having a conversation. Use paragraphs, bullet points with • or -, and clear headings. Never wrap your response in ```json or any code markers."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2048,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            
            # Extract text from GitHub Models response
            if "choices" in data and len(data["choices"]) > 0:
                raw_text = data["choices"][0]["message"]["content"]
                # Clean up the response
                return clean_response(raw_text)
            
            raise Exception("No valid response from GitHub Models API")
            
    except httpx.HTTPStatusError as e:
        # Log the full error response
        error_detail = f"Status: {e.response.status_code}"
        try:
            error_body = e.response.json()
            error_detail += f", Error: {error_body}"
        except:
            error_detail += f", Response: {e.response.text}"
        raise Exception(f"GitHub Models API error: {error_detail}")
    except httpx.HTTPError as e:
        raise Exception(f"GitHub Models API request failed: {str(e)}")
    except Exception as e:
        raise Exception(f"AI generation error: {str(e)}")
