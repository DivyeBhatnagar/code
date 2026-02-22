# 🚀 Quick Start Guide - CodePilot AI Backend

## Prerequisites
- Python 3.11+
- pip
- Firebase service account JSON

## Step 1: Install Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

## Step 2: Setup Firebase

1. Download your Firebase service account key:
   - Go to: https://console.firebase.google.com/project/codepilot-ai--divye/settings/serviceaccounts/adminsdk
   - Click "Generate New Private Key"
   - Save as `firebase-credentials.json` in the Backend folder

2. The `.env` file is already configured with your credentials!

## Step 3: Run the Server

```bash
uvicorn app.main:app --reload
```

The server will start at: http://localhost:8000

## Step 4: Test the API

Open your browser and visit:
- http://localhost:8000 - Root endpoint
- http://localhost:8000/docs - Interactive API documentation
- http://localhost:8000/health - Health check

Or run the test script:
```bash
python test_api.py
```

## Step 5: Test with Frontend

Make sure your frontend is configured to use:
```typescript
const API_URL = "http://localhost:8000";
```

## API Endpoints

### Public Endpoints
- `GET /` - API information
- `GET /health` - Health check

### Protected Endpoints (Require Firebase Auth)
- `POST /ai/generate` - Generate AI content
- `GET /ai/types` - Get supported AI types
- `GET /auth/verify` - Verify token
- `GET /auth/me` - Get current user

## Testing with cURL

```bash
# Health check
curl http://localhost:8000/health

# Generate AI (requires Firebase token)
curl -X POST http://localhost:8000/ai/generate \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mvp_planner",
    "input": "Build a study group finder app"
  }'
```

## Next Steps

1. ✅ Backend is running locally
2. 📱 Connect your frontend
3. 🔐 Test Firebase authentication
4. 🤖 Test AI generation
5. 🚀 Deploy to Railway

## Troubleshooting

### Import Errors
```bash
pip install -r requirements.txt --upgrade
```

### Firebase Errors
- Ensure `firebase-credentials.json` exists
- Check Firebase project ID in `.env`

### Port Already in Use
```bash
uvicorn app.main:app --reload --port 8001
```

## Production Deployment

See `DEPLOYMENT.md` for Railway deployment instructions.

---

Need help? Check the documentation or open an issue!
