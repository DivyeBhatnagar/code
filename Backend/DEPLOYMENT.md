# Deployment Guide - CodePilot AI Backend

## Prerequisites

✅ GitHub Models API Token (configured)
✅ Firebase Project ID: `codepilot-ai--divye`
✅ Firebase Service Account JSON (download from console)

## Step 1: Firebase Service Account

1. Go to: https://console.firebase.google.com/project/codepilot-ai--divye/settings/serviceaccounts/adminsdk
2. Click **Generate New Private Key**
3. Save as `firebase-credentials.json` in Backend folder
4. **IMPORTANT**: This file is in .gitignore - never commit it!

## Step 2: Local Testing

```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Test endpoints:
- http://localhost:8000 - Root
- http://localhost:8000/health - Health check
- http://localhost:8000/docs - API documentation

## Step 3: Railway Deployment

### Option A: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set GITHUB_TOKEN=your_github_token_here
railway variables set FIREBASE_PROJECT_ID=codepilot-ai--divye
railway variables set FRONTEND_URL=https://your-vercel-app.vercel.app

# Upload Firebase credentials as base64
railway variables set FIREBASE_CREDENTIALS_BASE64=$(cat firebase-credentials.json | base64)

# Deploy
railway up
```

### Option B: Using Railway Dashboard

1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Add these environment variables:
   - `GITHUB_TOKEN`: Your GitHub token
   - `FIREBASE_PROJECT_ID`: `codepilot-ai--divye`
   - `FRONTEND_URL`: Your Vercel URL
   - `FIREBASE_CREDENTIALS_BASE64`: Base64 encoded JSON (see below)

5. Set root directory to `Backend`
6. Deploy!

### Converting Firebase Credentials to Base64

```bash
# On Mac/Linux
cat firebase-credentials.json | base64

# On Windows (PowerShell)
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("firebase-credentials.json"))
```

Then update `firebase_verify.py` to decode base64 if needed.

## Step 4: Update Frontend

Update your frontend to use the Railway backend URL:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app.railway.app';
```

## Step 5: Update CORS

Once deployed, update `Backend/app/main.py` with your actual Vercel URL:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-actual-app.vercel.app"  # Update this!
],
```

## Testing Deployment

```bash
# Test health endpoint
curl https://your-railway-app.railway.app/health

# Test with authentication
curl -X POST https://your-railway-app.railway.app/ai/generate \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"mvp_planner","input":"Build a study group finder app"}'
```

## Environment Variables Summary

| Variable | Value |
|----------|-------|
| GITHUB_TOKEN | Your GitHub token |
| FIREBASE_PROJECT_ID | codepilot-ai--divye |
| FIREBASE_CREDENTIALS_PATH | ./firebase-credentials.json |
| FRONTEND_URL | https://your-app.vercel.app |
| ENVIRONMENT | production |

## Troubleshooting

### Firebase Auth Issues
- Ensure service account JSON is properly uploaded
- Check Firebase project ID matches
- Verify token is being sent in Authorization header

### GitHub API Issues
- Verify token is correct
- Check token permissions
- Ensure billing is enabled
- Ensure billing is enabled

### CORS Issues
- Add your Vercel URL to allowed origins
- Check that credentials are included in frontend requests

## Security Checklist

✅ Firebase credentials not in git
✅ Environment variables set in Railway
✅ CORS restricted to your domains
✅ All AI endpoints require authentication
✅ HTTPS enabled (automatic on Railway)

Your backend is now production-ready! 🚀
