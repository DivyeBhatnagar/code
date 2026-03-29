import httpx
import json
import re
from typing import Dict, Any, List
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

async def generate_judge_intelligence(
    project_structure: Dict[str, Any],
    problem_statement: str = None,
    solution_description: str = None,
    business_model: str = None
) -> Dict[str, Any]:
    """
    Generate comprehensive judge intelligence analysis
    
    This is NOT a generic Q&A generator. It analyzes the specific project
    and predicts realistic, sharp questions judges will ask based on
    evaluation criteria and project weaknesses.
    """
    
    # Detect project domain and type
    project_domain = detect_project_domain(project_structure)
    tech_stack = extract_tech_stack(project_structure)
    
    system_prompt = """You are an expert hackathon judge and evaluator with 10+ years of experience.
Your role is to analyze projects critically and predict the EXACT questions real judges will ask.

CRITICAL RULES:
1. NO GENERIC QUESTIONS - Every question must be project-specific
2. Questions must be SHARP and REALISTIC - like a real judge would ask
3. Categorize by evaluation criteria
4. Identify REAL weaknesses, not theoretical ones
5. Provide strategic, impressive answers
6. Return ONLY valid JSON

JUDGING CRITERIA WEIGHTS:
- Problem Understanding: 20%
- Solution Clarity: 20%
- Technical Feasibility: 25%
- MVP Scope: 15%
- Execution Strategy: 10%
- Scalability: 10%

REQUIRED JSON SCHEMA:
{
  "questions_by_category": {
    "problem_understanding": [
      {
        "question": "string (sharp, specific question)",
        "why_judges_ask": "string (reasoning)",
        "basic_answer": "string (safe answer)",
        "advanced_answer": "string (impressive answer)",
        "power_answer": "string (judge-winning answer with strategic thinking)"
      }
    ],
    "solution_clarity": [...],
    "technical_feasibility": [...],
    "mvp_scope": [...],
    "execution_strategy": [...],
    "scalability": [...],
    "market_potential": [...],
    "differentiation": [...]
  },
  "weaknesses": [
    {
      "area": "string (specific area)",
      "severity": "Low|Medium|High",
      "issue": "string (what's wrong)",
      "improvement": "string (how to fix before presentation)"
    }
  ],
  "confidence_score": integer (0-100),
  "risk_level": "Low|Medium|High",
  "improvement_areas": ["string (priority improvements)"],
  "strategic_insights": "string (overall strategic advice for presentation)"
}

DOMAIN-SPECIFIC QUESTION RULES:
- AI/ML projects: Ask about model bias, data sources, latency, inference cost, accuracy metrics
- Web apps: Ask about scaling, database design, API rate limiting, authentication security
- Hardware: Ask about reliability, deployment feasibility, cost per unit, failure modes
- Blockchain: Ask about gas costs, consensus mechanism, security audits, real-world adoption
- HealthTech: Ask about HIPAA compliance, data privacy, clinical validation, regulatory approval
- FinTech: Ask about PCI compliance, fraud detection, transaction security, regulatory compliance

Return ONLY the JSON object."""

    # Build comprehensive project context
    project_context = f"""PROJECT ANALYSIS:

Project Name: {project_structure.get('project_name', 'Unknown')}
Description: {project_structure.get('description', 'No description')}

Problem Statement: {problem_statement or 'Not provided'}
Solution Description: {solution_description or 'Not provided'}
Business Model: {business_model or 'Not provided'}

Tech Stack Detected: {', '.join(tech_stack)}
Project Domain: {project_domain}

Files Structure:
{json.dumps([f.get('path') for f in project_structure.get('files', [])], indent=2)}

Dependencies: {', '.join(project_structure.get('dependencies', []))}

Setup Instructions:
{json.dumps(project_structure.get('setup_instructions', []), indent=2)}

Run Commands:
{json.dumps(project_structure.get('run_commands', []), indent=2)}

ANALYSIS REQUIREMENTS:
1. Predict 3-5 questions per category (8 categories total)
2. Questions must be SPECIFIC to this project's tech stack and domain
3. Identify REAL weaknesses (missing tests, no error handling, security gaps, etc.)
4. Power answers must mention: scalability, real-world feasibility, future roadmap
5. Confidence score based on: completeness, best practices, documentation, scalability
6. Risk level based on: technical complexity, time feasibility, team capability gaps

Generate the comprehensive judge intelligence analysis."""

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
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
                        {"role": "user", "content": project_context}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 4096,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return extract_json_from_response(ai_response)
            
    except Exception as e:
        raise Exception(f"Judge intelligence generation failed: {str(e)}")

def detect_project_domain(project_structure: Dict[str, Any]) -> str:
    """Detect project domain from structure and content"""
    description = project_structure.get('description', '').lower()
    files = [f.get('path', '').lower() for f in project_structure.get('files', [])]
    
    # AI/ML indicators
    if any(keyword in description for keyword in ['ai', 'ml', 'machine learning', 'neural', 'model', 'prediction']):
        return 'AI/ML'
    
    # Blockchain indicators
    if any(keyword in description for keyword in ['blockchain', 'web3', 'smart contract', 'crypto', 'nft']):
        return 'Web3/Blockchain'
    
    # HealthTech indicators
    if any(keyword in description for keyword in ['health', 'medical', 'patient', 'diagnosis', 'healthcare']):
        return 'HealthTech'
    
    # FinTech indicators
    if any(keyword in description for keyword in ['payment', 'finance', 'banking', 'transaction', 'fintech']):
        return 'FinTech'
    
    # EdTech indicators
    if any(keyword in description for keyword in ['education', 'learning', 'student', 'course', 'teaching']):
        return 'EdTech'
    
    # E-commerce indicators
    if any(keyword in description for keyword in ['shop', 'ecommerce', 'store', 'cart', 'product']):
        return 'E-commerce'
    
    # Check file structure
    if any('model' in f or 'train' in f for f in files):
        return 'AI/ML'
    
    if any('contract' in f or 'solidity' in f for f in files):
        return 'Web3/Blockchain'
    
    # Default to Web Application
    return 'Web Application'

def extract_tech_stack(project_structure: Dict[str, Any]) -> List[str]:
    """Extract technologies used in the project"""
    tech_stack = set()
    
    files = project_structure.get('files', [])
    dependencies = project_structure.get('dependencies', [])
    
    # Detect from file extensions
    for file in files:
        path = file.get('path', '').lower()
        if path.endswith('.py'):
            tech_stack.add('Python')
        elif path.endswith(('.js', '.jsx')):
            tech_stack.add('JavaScript')
        elif path.endswith(('.ts', '.tsx')):
            tech_stack.add('TypeScript')
        elif path.endswith('.java'):
            tech_stack.add('Java')
        elif path.endswith('.go'):
            tech_stack.add('Go')
        elif path.endswith('.rs'):
            tech_stack.add('Rust')
        elif path.endswith('.sol'):
            tech_stack.add('Solidity')
    
    # Detect frameworks from dependencies
    dep_str = ' '.join(dependencies).lower()
    
    if 'fastapi' in dep_str or 'flask' in dep_str or 'django' in dep_str:
        tech_stack.add('Python Backend')
    if 'react' in dep_str:
        tech_stack.add('React')
    if 'next' in dep_str:
        tech_stack.add('Next.js')
    if 'vue' in dep_str:
        tech_stack.add('Vue.js')
    if 'express' in dep_str:
        tech_stack.add('Express.js')
    if 'mongodb' in dep_str or 'mongoose' in dep_str:
        tech_stack.add('MongoDB')
    if 'postgres' in dep_str or 'psycopg' in dep_str:
        tech_stack.add('PostgreSQL')
    if 'redis' in dep_str:
        tech_stack.add('Redis')
    if 'docker' in dep_str:
        tech_stack.add('Docker')
    if 'tensorflow' in dep_str or 'torch' in dep_str or 'pytorch' in dep_str:
        tech_stack.add('Deep Learning')
    if 'scikit' in dep_str or 'sklearn' in dep_str:
        tech_stack.add('Machine Learning')
    
    return list(tech_stack) if tech_stack else ['General']

async def evaluate_answer_quality(
    question: str,
    user_answer: str,
    project_context: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluate user's answer quality for simulation mode
    Provides feedback and improvement suggestions
    """
    
    system_prompt = """You are an expert hackathon judge evaluating a team's answer.
Provide constructive feedback on their answer quality.

Return ONLY valid JSON:
{
  "score": integer (0-100),
  "strengths": ["string (what was good)"],
  "weaknesses": ["string (what could be better)"],
  "improved_version": "string (how to answer better)",
  "judge_reaction": "string (likely judge reaction)"
}"""

    user_prompt = f"""Question: {question}

Team's Answer: {user_answer}

Project Context: {json.dumps(project_context, indent=2)}

Evaluate this answer and provide feedback."""

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
                    "max_tokens": 1024,
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return extract_json_from_response(ai_response)
            
    except Exception as e:
        raise Exception(f"Answer evaluation failed: {str(e)}")
