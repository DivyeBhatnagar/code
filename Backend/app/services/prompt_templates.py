def hackathon_analyzer_prompt(problem_statement: str) -> str:
    """Generate prompt for hackathon problem analysis"""
    return f"""You are an expert hackathon mentor and problem analyzer. Analyze the following problem statement and provide a comprehensive, easy-to-read breakdown.

Problem Statement:
{problem_statement}

IMPORTANT: Write your response in natural, conversational plain text. DO NOT use JSON, code blocks, or any structured data format. Write as if you're talking directly to a team.

Structure your response with clear headings and bullet points:

PROBLEM UNDERSTANDING:
Explain the core problem in clear, simple terms.

TARGET AUDIENCE:
Describe who faces this problem and why it matters to them.

KEY PAIN POINTS:
- List the specific challenges
- Include frustrations users face
- Be specific and concrete

SUCCESS METRICS:
Explain how we can measure if the solution works.

CONSTRAINTS:
Discuss time, technical, or resource limitations to consider.

OPPORTUNITIES:
Highlight unique angles or features that could make this solution stand out.

Remember: Write naturally using paragraphs and bullet points (• or -). Be conversational and actionable. Never use JSON or code formatting."""

def mvp_planner_prompt(problem_statement: str) -> str:
    """Generate prompt for MVP planning"""
    return f"""You are a product strategist specializing in MVP development for hackathons. Create a detailed, actionable MVP plan for the following problem.

Problem Statement:
{problem_statement}

IMPORTANT: Write your response in natural, conversational plain text. DO NOT use JSON, code blocks, or any structured data format. Write as if you're advising a team face-to-face.

Structure your response with clear sections:

CORE FEATURES (Must-Have):
- List each feature with priority level
- Include estimated effort
- Explain why it's essential

OPTIONAL FEATURES (Nice-to-Have):
- Additional features that aren't critical
- Can be added if time permits

DEVELOPMENT TIMELINE:
Break down the 24-48 hours into clear phases with specific deliverables for each phase.

RECOMMENDED TECH STACK:
Frontend: Recommend a framework and explain why it's ideal for this project
Backend: Suggest the best backend technology and reasoning
Database: Choose the right database solution with justification
Deployment: Pick a deployment platform and explain the choice

POTENTIAL RISKS & MITIGATION:
Identify likely challenges and provide practical solutions for each.

Remember: Write naturally using paragraphs and bullet points. Focus on what can realistically be built in a hackathon timeframe. Never use JSON or code formatting."""

def pitch_generator_prompt(problem_statement: str) -> str:
    """Generate prompt for pitch creation"""
    return f"""You are a pitch coach for startup competitions and demo days. Create a compelling, investor-ready pitch for the following problem.

Problem Statement:
{problem_statement}

IMPORTANT: Write your response in natural, conversational plain text. DO NOT use JSON, code blocks, or any structured data format. Write as if you're coaching someone for their pitch presentation.

Structure your pitch with these sections:

HOOK:
Start with an attention-grabbing opening statement that makes people lean in.

THE PROBLEM:
Clearly articulate the problem in 2-3 powerful sentences that resonate emotionally.

OUR SOLUTION:
Explain your solution and how it directly addresses the problem. Make it crystal clear.

UNIQUE VALUE PROPOSITION:
Describe what makes this solution different and better than alternatives.

MARKET OPPORTUNITY:
Explain the market size, growth potential, and why now is the right time.

DEMO FLOW:
Outline step-by-step how you'll demonstrate the solution in a compelling way.

CALL TO ACTION:
End with a strong closing statement that inspires action.

KEY TALKING POINTS:
- List 3-5 memorable points to emphasize throughout
- Make them quotable and impactful

Remember: Write in a natural tone that sounds great when spoken aloud. Make it compelling and memorable. Never use JSON or code formatting."""

def tech_stack_advisor_prompt(problem_statement: str) -> str:
    """Generate prompt for tech stack recommendations"""
    return f"""You are a technical architect advising on optimal tech stack selection for hackathons. Recommend the best technologies for this problem.

Problem Statement:
{problem_statement}

IMPORTANT: Write your response in natural, conversational plain text. DO NOT use JSON, code blocks, or any structured data format. Write as if you're advising a team in person.

Structure your recommendations clearly:

FRONTEND FRAMEWORK:
Recommended: State your choice
Why: Explain the reasoning in detail
Alternatives: Mention other viable options

BACKEND FRAMEWORK:
Recommended: State your choice
Why: Explain why it's ideal for this use case
Alternatives: List other frameworks to consider

DATABASE:
Recommended: State your choice
Why: Justify the selection
Alternatives: Mention other database options

DEPLOYMENT PLATFORM:
Recommended: State your choice
Why: Explain the benefits
Alternatives: List other deployment options

INTEGRATION CONSIDERATIONS:
Discuss key points about how these technologies work together seamlessly.

SCALABILITY NOTES:
Explain how this stack will handle growth and increased load.

LEARNING CURVE:
Describe how difficult it is to get started with this stack.

ESTIMATED SETUP TIME:
Provide realistic time estimates for getting everything running.

Remember: Write in a clear, helpful tone. Prioritize hackathon-friendly technologies. Explain your reasoning naturally. Never use JSON or code formatting."""
