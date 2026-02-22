# 🚀 CodePilot AI - Quick Start Guide

## ✅ What's Already Configured

### Backend
- ✅ GitHub Models API Token configured
- ✅ Firebase Project ID: `codepilot-ai--divye`
- ✅ All code is complete and production-ready

### Frontend
- ✅ Firebase configuration
- ✅ API client setup
- ✅ Login & Register pages created
- ✅ Dashboard page created
- ✅ Backend connection configured

## 🔥 ONE THING YOU NEED TO DO

**Download Firebase Service Account Key:**

1. Go to: https://console.firebase.google.com/project/codepilot-ai--divye/settings/serviceaccounts/adminsdk
2. Click **"Generate New Private Key"**
3. Save as `firebase-credentials.json` in the `Backend/` folder

That's it! See `Backend/FIREBASE_KEY_INSTRUCTIONS.md` for detailed steps.

## 🏃 Run the Application

### Terminal 1 - Backend
```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs at: http://localhost:8000

### Terminal 2 - Frontend
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

## 🎯 Test It Out

1. Open http://localhost:3000
2. Click **"Launch App"** or **"Login"**
3. Click **"Sign up"** to create an account
4. Register with email/password or Google
5. You'll be redirected to the dashboard!

## 📱 Available Pages

- **/** - Landing page with features
- **/login** - Login page
- **/register** - Registration page  
- **/dashboard** - User dashboard (protected, requires login)

## 🔌 API Endpoints

### Public
- `GET http://localhost:8000/` - API info
- `GET http://localhost:8000/health` - Health check
- `GET http://localhost:8000/docs` - Interactive API docs

### Protected (Need Firebase Token)
- `POST /ai/generate` - Generate AI content
  - Types: `hackathon_analyzer`, `mvp_planner`, `pitch_generator`, `tech_stack_advisor`
- `GET /ai/types` - Get supported AI types
- `GET /auth/verify` - Verify authentication
- `GET /auth/me` - Get current user info

## 🧪 Test API with cURL

```bash
# Health check
curl http://localhost:8000/health

# After logging in, get your Firebase token and test:
curl -X POST http://localhost:8000/ai/generate \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mvp_planner",
    "input": "Build a study group finder app"
  }'
```

## 🔐 Firebase Setup (One-time)

### Enable Authentication
1. Go to: https://console.firebase.google.com/project/codepilot-ai--divye/authentication
2. Click **"Get Started"**
3. Enable **Email/Password** sign-in method
4. (Optional) Enable **Google** sign-in method

### Setup Firestore Database
1. Go to: https://console.firebase.google.com/project/codepilot-ai--divye/firestore
2. Click **"Create Database"**
3. Choose **"Start in production mode"**
4. Select location: **us-central1**
5. Click **"Enable"**

### Add Security Rules
Copy rules from `Backend/firebase-rules.txt` and paste in Firestore Rules tab.

## 📁 Project Structure

```
CodePilot AI/
├── Backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Settings
│   │   ├── routers/             # API endpoints
│   │   ├── services/            # AI & business logic
│   │   ├── schemas/             # Data models
│   │   ├── utils/               # Firebase auth, logger
│   │   └── middleware/          # Error handling
│   ├── firebase-credentials.json # ← Download this!
│   ├── .env                     # Environment variables
│   └── requirements.txt         # Python packages
│
└── Frontend/
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

## 🐛 Troubleshooting

### Backend won't start
- Check `firebase-credentials.json` exists
- Run: `pip install -r requirements.txt`

### Frontend won't start
- Run: `npm install`
- Check `.env.local` exists

### Can't login
- Enable Email/Password in Firebase Console
- Check both servers are running

### API returns 401
- User must be logged in
- Check Firebase token is being sent

## 📚 Documentation

- `Backend/SETUP_INSTRUCTIONS.md` - Complete setup guide
- `Backend/FIREBASE_KEY_INSTRUCTIONS.md` - Firebase key setup
- `Backend/DEPLOYMENT.md` - Deploy to Railway
- `Backend/README.md` - Backend documentation

## 🚀 Deploy to Production

### Backend → Railway
See `Backend/DEPLOYMENT.md`

### Frontend → Vercel
```bash
cd Frontend
vercel
```

## 💡 Features

### AI Generation Types
1. **Hackathon Analyzer** - Analyze problem statements
2. **MVP Planner** - Plan minimum viable products
3. **Pitch Generator** - Create compelling pitches
4. **Tech Stack Advisor** - Get tech recommendations

### Authentication
- Email/Password login
- Google OAuth
- Protected routes
- Firebase token verification

### Security
- All AI endpoints require authentication
- CORS configured
- Rate limiting ready
- Secure token verification

---

## ✨ You're All Set!

Your CodePilot AI is production-ready with:
- ✅ Complete backend with GitHub Models (GPT-4)
- ✅ Complete frontend with Firebase auth
- ✅ Login & Register pages
- ✅ Protected dashboard
- ✅ API integration
- ✅ Security configured

Just download the Firebase key and you're ready to go! 🎉
