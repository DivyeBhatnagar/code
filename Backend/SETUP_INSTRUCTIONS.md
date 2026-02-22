# 🚀 Complete Setup Instructions

## Backend Setup

### 1. Download Firebase Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: **CodePilot AI -Divye** (codepilot-ai--divye)
3. Click ⚙️ (Settings) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the downloaded JSON file as `firebase-credentials.json` in the `Backend` folder

### 2. Install Backend Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

### 3. Verify Configuration

Your `.env` file is already configured with:
- ✅ GitHub Models API Token
- ✅ Firebase Project ID: `codepilot-ai--divye`
- ✅ Firebase Credentials Path: `./firebase-credentials.json`

### 4. Start Backend Server

```bash
uvicorn app.main:app --reload
```

Backend will run at: http://localhost:8000

Test it:
- http://localhost:8000 - Root
- http://localhost:8000/docs - API Documentation
- http://localhost:8000/health - Health Check

---

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd Frontend
npm install
```

### 2. Verify Environment Variables

Your `.env.local` is already configured with:
- ✅ Backend API URL: `http://localhost:8000`
- ✅ Firebase Config (all credentials)

### 3. Start Frontend Server

```bash
npm run dev
```

Frontend will run at: http://localhost:3000

---

## Firebase Console Setup

### Enable Authentication

1. Go to: https://console.firebase.google.com/project/codepilot-ai--divye/authentication
2. Click **Get Started**
3. Enable these sign-in methods:
   - ✅ **Email/Password** - Click Enable and Save
   - ✅ **Google** (optional) - Click Enable, add support email, and Save

### Setup Firestore Database

1. Go to: https://console.firebase.google.com/project/codepilot-ai--divye/firestore
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select location: **us-central1** (or your preferred region)
5. Click **Enable**

### Add Firestore Security Rules

1. In Firestore, click **Rules** tab
2. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    match /generations/{generationId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /projects/{projectId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

---

## Testing the Complete Setup

### 1. Start Both Servers

Terminal 1 (Backend):
```bash
cd Backend
uvicorn app.main:app --reload
```

Terminal 2 (Frontend):
```bash
cd Frontend
npm run dev
```

### 2. Test the Application

1. Open browser: http://localhost:3000
2. Click **Get Started** or **Login**
3. Register a new account
4. You should be redirected to the dashboard
5. Try the AI features!

### 3. Test API Directly

```bash
# Test health
curl http://localhost:8000/health

# Register a user in Firebase Console or via frontend
# Then get the Firebase token and test:

curl -X POST http://localhost:8000/ai/generate \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mvp_planner",
    "input": "Build a study group finder app for students"
  }'
```

---

## Available Pages

- **/** - Landing page
- **/login** - Login page
- **/register** - Registration page
- **/dashboard** - User dashboard (protected)

---

## API Endpoints

### Public
- `GET /` - API info
- `GET /health` - Health check

### Protected (Require Firebase Auth Token)
- `POST /ai/generate` - Generate AI content
- `GET /ai/types` - Get supported AI types
- `GET /auth/verify` - Verify token
- `GET /auth/me` - Get current user

---

## Troubleshooting

### Backend Issues

**Firebase initialization error:**
- Ensure `firebase-credentials.json` exists in Backend folder
- Check file permissions
- Verify JSON file is valid

**Import errors:**
```bash
pip install -r requirements.txt --upgrade
```

**Port already in use:**
```bash
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Module not found:**
```bash
npm install
```

**Firebase errors:**
- Check `.env.local` exists
- Verify Firebase config is correct
- Enable Authentication in Firebase Console

**API connection errors:**
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

---

## Project Structure

```
Backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── routers/             # API routes
│   ├── services/            # Business logic
│   ├── schemas/             # Pydantic models
│   ├── utils/               # Utilities
│   └── middleware/          # Middleware
├── firebase-credentials.json # Firebase key (download this!)
├── .env                     # Environment variables
└── requirements.txt         # Python dependencies

Frontend/
├── app/
│   ├── page.tsx            # Landing page
│   ├── login/              # Login page
│   ├── register/           # Register page
│   └── dashboard/          # Dashboard
├── components/             # React components
├── lib/
│   ├── firebase.ts         # Firebase config
│   └── api.ts              # API client
└── .env.local              # Environment variables
```

---

## Next Steps

1. ✅ Complete Firebase setup
2. ✅ Test login/register
3. ✅ Test AI generation
4. 🚀 Deploy to production (Railway + Vercel)

Need help? Check the logs or create an issue!
