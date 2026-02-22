# CodePilot AI Backend

Production-ready FastAPI backend for CodePilot AI SaaS platform.

## Features

- 🔐 Firebase Authentication
- 🤖 GitHub Models (GPT-4) Integration
- 📦 Modular Architecture
- 🚀 Railway Deployment Ready
- 🔒 Secure API Endpoints
- 📊 Structured AI Outputs

## Tech Stack

- FastAPI
- Python 3.11+
- Firebase Admin SDK
- GitHub Models API (GPT-4)
- Uvicorn
- Pydantic

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your credentials:
   - GITHUB_TOKEN
   - FIREBASE_PROJECT_ID
   - FIREBASE_CREDENTIALS_PATH
   - FRONTEND_URL

4. Run locally:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

### Authentication
- `GET /auth/verify` - Verify Firebase token
- `GET /auth/me` - Get current user

### AI Generation
- `POST /ai/generate` - Generate AI content
- `GET /ai/types` - Get supported types

## AI Generation Types

1. `hackathon_analyzer` - Analyze problem statements
2. `mvp_planner` - Create MVP plans
3. `pitch_generator` - Generate pitch decks
4. `tech_stack_advisor` - Recommend tech stacks

## Deployment

### Railway

1. Connect your GitHub repo
2. Add environment variables
3. Deploy automatically

The `railway.json` config is already set up.

## Security

- All AI endpoints require Firebase authentication
- CORS configured for frontend only
- Environment variables for sensitive data
- Token verification on every request

## Future Enhancements

- RAG integration for context-aware responses
- Vector database for knowledge base
- Caching layer for common queries
- Rate limiting
- Analytics and logging
