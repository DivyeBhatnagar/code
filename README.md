# CodePilot AI - Hackathon SaaS Platform

AI-powered tools to help you win hackathons. Built with Next.js, FastAPI, and GPT-4.

## 🚀 Quick Start

### Backend
```bash
cd Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs at: http://localhost:8000

### Frontend
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

## 🎯 Features

- **Hackathon Analyzer** - Analyze problem statements
- **MVP Planner** - Plan your minimum viable product
- **Pitch Generator** - Create compelling pitches
- **Tech Stack Advisor** - Get technology recommendations

## 🔐 Authentication

- Email/Password login
- Google OAuth
- Firebase authentication

## 🤖 AI Service

Using GitHub Models API (GPT-4) for real AI responses.

## 📱 Pages

- `/` - Landing page
- `/login` - Login
- `/register` - Register
- `/dashboard` - AI tools (protected)

## ⚙️ Configuration

### Backend (.env)
```
GITHUB_TOKEN=your_github_token
FIREBASE_PROJECT_ID=codepilot-ai--divye
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** FastAPI, Python 3.11+
- **AI:** GitHub Models (GPT-4)
- **Auth:** Firebase
- **Database:** Firestore

## 📚 Documentation

- `Backend/README.md` - Backend documentation
- `HOW_TO_USE.md` - Usage guide
- `QUICK_START.md` - Quick start guide

## 🚀 Deployment

- **Frontend:** Vercel
- **Backend:** Railway

See `Backend/DEPLOYMENT.md` for details.

---

Built for hackathons, by developers. 🎉
