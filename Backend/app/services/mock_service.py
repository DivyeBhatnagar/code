"""
Mock AI service for testing without API credits
This returns sample AI responses so you can test the app
"""

import json
import asyncio

async def generate_ai_response(prompt: str) -> str:
    """
    Generate mock AI response for testing
    
    Args:
        prompt: The input prompt for AI generation
        
    Returns:
        Generated mock response in JSON format
    """
    # Simulate API delay
    await asyncio.sleep(1)
    
    # Detect which type of prompt this is
    if "hackathon" in prompt.lower() or "problem statement" in prompt.lower():
        return json.dumps({
            "problem_understanding": "A platform to connect students with study groups based on their courses and learning preferences",
            "target_audience": "College and university students seeking collaborative learning opportunities",
            "pain_points": [
                "Difficulty finding study partners with similar schedules",
                "Lack of accountability in solo studying",
                "Missing out on diverse perspectives and learning styles",
                "Time wasted searching for compatible study groups"
            ],
            "success_metrics": [
                "Number of successful study group formations",
                "Student engagement and retention rates",
                "Academic performance improvements",
                "User satisfaction scores"
            ],
            "constraints": [
                "24-48 hour hackathon timeframe",
                "Limited resources for complex matching algorithms",
                "Need for quick user onboarding"
            ],
            "opportunities": [
                "Integration with university course catalogs",
                "AI-powered matching based on learning styles",
                "Gamification to increase engagement",
                "Virtual and in-person study options"
            ]
        }, indent=2)
    
    elif "mvp" in prompt.lower() or "minimum viable product" in prompt.lower():
        return json.dumps({
            "core_features": [
                {"feature": "User registration and profile creation", "priority": "Must-have", "effort": "Low"},
                {"feature": "Course selection and matching", "priority": "Must-have", "effort": "Medium"},
                {"feature": "Study group creation and joining", "priority": "Must-have", "effort": "Medium"},
                {"feature": "Basic messaging system", "priority": "Must-have", "effort": "High"},
                {"feature": "Schedule coordination tool", "priority": "Must-have", "effort": "Medium"}
            ],
            "optional_features": [
                {"feature": "Learning style assessment", "priority": "Nice-to-have", "effort": "High"},
                {"feature": "Video chat integration", "priority": "Nice-to-have", "effort": "High"},
                {"feature": "Resource sharing", "priority": "Nice-to-have", "effort": "Medium"},
                {"feature": "Progress tracking", "priority": "Nice-to-have", "effort": "Medium"}
            ],
            "timeline": [
                {"phase": "Setup & Planning", "duration": "2 hours", "deliverables": ["Project structure", "Database schema", "UI mockups"]},
                {"phase": "Core Development", "duration": "12 hours", "deliverables": ["User auth", "Profile system", "Matching algorithm"]},
                {"phase": "Integration", "duration": "6 hours", "deliverables": ["Connect frontend/backend", "Test features"]},
                {"phase": "Polish & Deploy", "duration": "4 hours", "deliverables": ["Bug fixes", "UI improvements", "Deployment"]}
            ],
            "tech_stack": {
                "frontend": ["React", "Next.js", "Tailwind CSS"],
                "backend": ["Node.js", "Express", "Firebase"],
                "database": ["Firestore", "Firebase Auth"],
                "deployment": ["Vercel", "Firebase Hosting"]
            },
            "risks": [
                "Matching algorithm complexity - Start simple with course-based matching",
                "Real-time messaging scalability - Use Firebase Realtime Database",
                "User adoption - Focus on one university initially"
            ]
        }, indent=2)
    
    elif "pitch" in prompt.lower():
        return json.dumps({
            "hook": "What if finding the perfect study group was as easy as swiping right?",
            "problem": "Students struggle to find compatible study partners, leading to isolation and lower academic performance. Traditional methods are time-consuming and often result in mismatched groups.",
            "solution": "Our AI-powered platform instantly connects students with ideal study groups based on their courses, schedules, and learning styles. Smart matching ensures productive collaboration.",
            "unique_value": "Unlike generic social platforms, we use intelligent algorithms to match students based on academic compatibility, not just proximity. Our platform is built specifically for student success.",
            "market_opportunity": "With over 20 million college students in the US alone and growing demand for collaborative learning tools, the market potential is $500M+. Remote learning has accelerated this need.",
            "demo_flow": [
                "Show student creating profile and selecting courses",
                "Demonstrate AI matching algorithm finding compatible groups",
                "Display real-time group chat and schedule coordination",
                "Highlight success metrics and user testimonials"
            ],
            "call_to_action": "Join us in revolutionizing how students learn together. Let's make education more collaborative, engaging, and effective for everyone.",
            "key_talking_points": [
                "AI-powered matching increases study group success by 3x",
                "Students save 5+ hours per week finding study partners",
                "Proven to improve grades by an average of 15%",
                "Built by students, for students",
                "Scalable to any university or educational institution"
            ]
        }, indent=2)
    
    else:  # tech_stack_advisor
        return json.dumps({
            "recommended_stack": {
                "frontend": {
                    "framework": "Next.js 14 with React",
                    "reasoning": "Server-side rendering for SEO, built-in routing, excellent developer experience, and perfect for rapid prototyping",
                    "alternatives": ["Vue.js with Nuxt", "SvelteKit", "Remix"]
                },
                "backend": {
                    "framework": "FastAPI (Python) or Express.js (Node.js)",
                    "reasoning": "FastAPI offers automatic API documentation and type safety. Express.js provides flexibility and large ecosystem",
                    "alternatives": ["Django", "NestJS", "Ruby on Rails"]
                },
                "database": {
                    "type": "Firebase Firestore + PostgreSQL",
                    "reasoning": "Firestore for real-time features and quick setup. PostgreSQL for complex queries and relationships",
                    "alternatives": ["MongoDB", "Supabase", "MySQL"]
                },
                "deployment": {
                    "platform": "Vercel (Frontend) + Railway (Backend)",
                    "reasoning": "Zero-config deployment, automatic HTTPS, great free tier, perfect for hackathons",
                    "alternatives": ["Netlify + Heroku", "AWS Amplify", "Google Cloud Run"]
                }
            },
            "integration_considerations": [
                "Use Firebase Auth for authentication across frontend and backend",
                "Implement REST API or GraphQL for data fetching",
                "Consider WebSockets for real-time messaging features",
                "Use CDN for static assets and images"
            ],
            "scalability_notes": "This stack can handle 10,000+ concurrent users with minimal configuration. Firestore scales automatically, and both Vercel and Railway offer easy horizontal scaling.",
            "learning_curve": "Moderate - Most technologies have excellent documentation. Expect 2-4 hours to get comfortable if new to the stack.",
            "estimated_setup_time": "30-60 minutes for complete development environment setup including all services and deployments"
        }, indent=2)
