import httpx
import json
import re
from typing import Dict, Any
from app.config import settings

GITHUB_API_URL = "https://models.inference.ai.azure.com/chat/completions"

def extract_json_from_response(text: str) -> Dict[Any, Any]:
    """Extract JSON from AI response, handling markdown code blocks"""
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    text = text.strip()
    
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    
    raise ValueError("No valid JSON found in AI response")

async def explain_code_with_ai(file_path: str, content: str) -> Dict[str, Any]:
    """Explain code using AI"""
    
    system_prompt = """You are a code explanation expert. Analyze the provided code and return ONLY valid JSON.

REQUIRED JSON SCHEMA:
{
  "purpose": "string (overall purpose of the code)",
  "flow": "string (execution flow explanation)",
  "key_components": ["string (component descriptions)"],
  "improvements": ["string (suggested improvements)"]
}

Return ONLY the JSON object, no markdown, no explanations."""

    user_prompt = f"""File: {file_path}

Code:
```
{content}
```

Analyze this code and return the JSON response."""

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
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2048,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return extract_json_from_response(ai_response)
            
    except Exception as e:
        raise Exception(f"Code explanation failed: {str(e)}")

async def refactor_code_with_ai(file_path: str, content: str, project_context: Dict[str, Any]) -> Dict[str, Any]:
    """Refactor code using AI"""
    
    system_prompt = """You are a code refactoring expert. Refactor the code following best practices and return ONLY valid JSON.

REQUIRED JSON SCHEMA:
{
  "updated_files": [
    {
      "path": "string (file path)",
      "content": "string (refactored code)"
    }
  ],
  "explanation": "string (what was improved)"
}

Return ONLY the JSON object."""

    user_prompt = f"""File: {file_path}

Current Code:
```
{content}
```

Project Context: {json.dumps(project_context)}

Refactor this code for better quality, readability, and performance. Return the JSON response."""

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                GITHUB_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 3000,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return extract_json_from_response(ai_response)
            
    except Exception as e:
        raise Exception(f"Code refactoring failed: {str(e)}")

async def generate_pitch_with_ai(project_structure: Dict[str, Any]) -> Dict[str, Any]:
    """Generate pitch from project structure"""
    
    system_prompt = """You are a pitch generation expert. Create a compelling pitch from the project structure and return ONLY valid JSON.

REQUIRED JSON SCHEMA:
{
  "problem_statement": "string",
  "solution_overview": "string",
  "tech_stack": "string",
  "architecture_summary": "string",
  "demo_flow": "string",
  "future_scope": "string",
  "2_min_pitch_script": "string"
}

Return ONLY the JSON object."""

    user_prompt = f"""Project Structure:
{json.dumps(project_structure, indent=2)}

Generate a compelling pitch for this project. Return the JSON response."""

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                GITHUB_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 3000,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return extract_json_from_response(ai_response)
            
    except Exception as e:
        raise Exception(f"Pitch generation failed: {str(e)}")

async def chat_with_ai(message: str, project_context: Dict[str, Any], active_file: str = None) -> str:
    """Chat with AI about the project"""
    
    system_prompt = """You are a helpful coding assistant. Answer questions about the project clearly and concisely.
Return ONLY valid JSON in this format:
{
  "response": "your answer here"
}"""

    context_info = f"\nProject Context: {json.dumps(project_context)}" if project_context else ""
    file_info = f"\nActive File: {active_file}" if active_file else ""
    
    user_prompt = f"""User Question: {message}{context_info}{file_info}

Provide a helpful answer. Return the JSON response."""

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
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2048,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            result = extract_json_from_response(ai_response)
            return result.get("response", ai_response)
            
    except Exception as e:
        raise Exception(f"Chat failed: {str(e)}")

async def score_project_with_ai(project_structure: Dict[str, Any]) -> Dict[str, Any]:
    """Score project health"""
    
    system_prompt = """You are a project quality analyzer. Score the project based on best practices and return ONLY valid JSON.

REQUIRED JSON SCHEMA:
{
  "score": integer (0-100),
  "breakdown": {
    "tests": integer (0-15),
    "docker": integer (0-10),
    "error_handling": integer (0-12),
    "readme": integer (0-10),
    "security": integer (0-20),
    "structure": integer (0-15),
    "logging": integer (0-10),
    "env_vars": integer (0-8)
  },
  "improvements": ["string (improvement suggestions)"]
}

Return ONLY the JSON object."""

    user_prompt = f"""Project Structure:
{json.dumps(project_structure, indent=2)}

Analyze this project and score it. Return the JSON response."""

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                GITHUB_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.5,
                    "max_tokens": 2048,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return extract_json_from_response(ai_response)
            
    except Exception as e:
        raise Exception(f"Project scoring failed: {str(e)}")

async def generate_demo_mode_with_ai(project_structure: Dict[str, Any]) -> Dict[str, Any]:
    """Generate demo mode presentation"""
    
    system_prompt = """You are a demo presentation expert. Create a demo walkthrough and return ONLY valid JSON.

REQUIRED JSON SCHEMA:
{
  "problem_explained": "string",
  "solution_explained": "string",
  "component_breakdown": "string",
  "how_to_demo": "string",
  "judge_impression_tips": "string",
  "2_min_script": "string"
}

Return ONLY the JSON object."""

    user_prompt = f"""Project Structure:
{json.dumps(project_structure, indent=2)}

Create a demo walkthrough for this project. Return the JSON response."""

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                GITHUB_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 3000,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return extract_json_from_response(ai_response)
            
    except Exception as e:
        raise Exception(f"Demo mode generation failed: {str(e)}")
