# ✨ CodePilot AI - Your AI Hackathon Companion

<div align="center">

![CodePilot AI](https://img.shields.io/badge/CodePilot-AI-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)
![GPT-4](https://img.shields.io/badge/GPT--4-Powered-412991?style=for-the-badge&logo=openai)

**The ultimate AI-powered platform designed to help developers dominate hackathons** 🚀

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 🎯 What is CodePilot AI?

CodePilot AI is a comprehensive SaaS platform built for hackathon participants. Powered by GPT-4 and state-of-the-art AI models, it provides intelligent tools to analyze challenges, plan MVPs, generate pitches, and receive tech stack recommendations—all in seconds.

Whether you're a first-time hackathon participant or a seasoned veteran, CodePilot AI accelerates your journey from idea to winning pitch.

---

## ✨ Features

### 🎤 **Pitch Generator**
Create compelling, investor-ready pitches instantly. Let AI craft persuasive narratives that showcase your idea's potential.

### 📊 **Hackathon Analyzer**
Analyze problem statements and understand requirements deeply. Get AI-powered insights to craft targeted solutions.

### 🛠️ **MVP Planner**
Design your minimum viable product with structured planning. Break down features, timelines, and technical requirements effortlessly.

### 🤖 **Judge Intelligence**
Get real-time feedback from our AI judge. Score your project across multiple dimensions and improve iteratively.

### 💻 **Tech Stack Advisor**
Receive intelligent technology stack recommendations based on your project requirements and time constraints.

### 📝 **Code Explanation**
Let AI explain any codebase snippet. Perfect for understanding legacy code or learning new patterns quickly.

### 🔧 **Code Refactor**
Improve your code quality with AI-powered refactoring suggestions. Get cleaner, more efficient code automatically.

### 💬 **AI Chat**
Get instant answers to any hackathon-related questions. From debugging tips to architecture advice, our AI has you covered.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git
- GitHub account (for API token)

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file with:
# GITHUB_TOKEN=your_github_token
# FIREBASE_PROJECT_ID=codepilot-ai--divye
# FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Start the server
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**  
API Documentation: **http://localhost:8000/docs**

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🏗️ Project Structure

```
CodePilot-AI/
├── Backend/                          # FastAPI backend
│   ├── app/
│   │   ├── routers/                 # API endpoints
│   │   ├── services/                # Business logic
│   │   ├── schemas/                 # Data models
│   │   ├── utils/                   # Helper utilities
│   │   ├── middleware/              # Error handling
│   │   ├── config.py                # Configuration
│   │   └── main.py                  # App entry point
│   ├── requirements.txt
│   └── README.md
│
├── Frontend/                         # Next.js frontend
│   ├── app/                         # App routes
│   │   ├── dashboard/               # Dashboard page
│   │   ├── login/                   # Login page
│   │   ├── register/                # Registration page
│   │   └── page.tsx                 # Home page
│   ├── components/                  # React components
│   │   ├── ProjectBuilder/
│   │   ├── HackathonPlan/
│   │   └── ...
│   ├── lib/                         # Utilities & helpers
│   ├── public/                      # Static assets
│   └── package.json
│
├── README.md                         # This file
├── vercel.json                       # Vercel deployment config
└── firestore.rules                   # Firestore security rules
```

---

## 🔐 Authentication

Our platform supports multiple authentication methods for your convenience:

- **Email/Password**: Traditional authentication
- **Google OAuth**: Quick sign-up with your Google account
- **Firebase Auth**: Secure, enterprise-grade authentication

All user data is encrypted and secured with Firebase's robust security infrastructure.

---

## 🤖 AI Service

CodePilot AI leverages **GitHub Models API** with GPT-4 to provide state-of-the-art AI capabilities:

- Real-time analysis and insights
- Context-aware recommendations
- Intelligent code generation and refactoring
- Natural language processing for problem understanding

---

## 📱 Pages & Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Landing page with feature overview | ❌ |
| `/login` | User login | ❌ |
| `/register` | User registration | ❌ |
| `/dashboard` | Main dashboard with AI tools | ✅ |
| `/about` | About us page | ❌ |
| `/pricing` | Pricing plans | ❌ |
| `/privacy` | Privacy policy | ❌ |
| `/terms` | Terms of service | ❌ |

---

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# GitHub API Token (for GPT-4 access)
GITHUB_TOKEN=your_github_token_here

# Firebase Configuration
FIREBASE_PROJECT_ID=codepilot-ai--divye
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Optional: API Configuration
API_PORT=8000
DEBUG=False
```

### Frontend Environment Variables (.env.local)

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=codepilot-ai--divye
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Authentication**: Firebase Auth
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase
- **AI Models**: GitHub Models API (GPT-4)
- **API Documentation**: Swagger (OpenAPI)
- **Deployment**: Railway

### Infrastructure & Services
- **Authentication**: Firebase Authentication
- **Database**: Google Cloud Firestore
- **AI**: GitHub Models (GPT-4)
- **Hosting**: Vercel (Frontend), Railway (Backend)
- **Version Control**: GitHub

---

## 📊 API Endpoints

### AI Features
- `POST /api/ai/pitch` - Generate pitch
- `POST /api/ai/analyze` - Analyze problem statement
- `POST /api/ai/mvp-plan` - Create MVP plan
- `POST /api/ai/tech-stack` - Get tech stack recommendations
- `POST /api/ai/explain` - Explain code
- `POST /api/ai/refactor` - Refactor code
- `POST /api/ai/score` - Score project

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Database
- `GET /api/db/projects` - List user projects
- `POST /api/db/projects` - Create project
- `DELETE /api/db/projects/{id}` - Delete project

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

```bash
vercel --prod
```

### Backend (Railway)

1. Create Railway project
2. Connect GitHub repository
3. Set environment variables:
   - `GITHUB_TOKEN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CREDENTIALS_PATH`
4. Railway auto-deploys on push

Detailed deployment guide: [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

## 🔒 Security

- **CORS Enabled**: Secure cross-origin requests
- **Firebase Security Rules**: Row-level database security
- **Environment Variables**: Sensitive data protection
- **Token-Based Auth**: JWT authentication
- **Rate Limiting**: API rate limiting implemented
- **Input Validation**: Schema validation on all inputs

---

## 📚 Documentation

- [Backend README](./Backend/README.md) - Backend setup and API documentation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Feature Documentation](./JUDGE_INTELLIGENCE_FEATURE.md) - Judge intelligence feature
- [Hackathon Guide](./HACKATHON_PRESENTATION.md) - Hackathon usage guide

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Python PEP 8 style for backend
- Follow React best practices for frontend
- Write clear commit messages
- Add tests for new features
- Update documentation accordingly

---

## 📦 Available Scripts

### Backend
```bash
# Run development server
uvicorn app.main:app --reload

# Run tests
pytest

# Format code
black app/

# Lint code
flake8 app/
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use?**
```bash
lsof -ti:8000 | xargs kill -9
```

**Missing environment variables?**
```bash
# Copy example
cp .env.example .env
# Edit with your values
```

### Frontend Issues

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

---

## 📈 Performance

- **Frontend**: Optimized with Next.js Image component and code splitting
- **Backend**: Async request handling with FastAPI
- **Database**: Firestore indexes for fast queries
- **AI**: Caching layer for repeated requests

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for the hackathon community
- Powered by GitHub Models and OpenAI's GPT-4
- Inspired by the passion of makers and builders
- Special thanks to all contributors and supporters

---

## 📞 Support & Contact

Have questions? We're here to help!

- **GitHub Issues**: [Report a bug](https://github.com/DivyeBhatnagar/CodePilot-AI/issues)
- **Email**: support@codepilot-ai.com
- **Twitter**: [@CodePilotAI](https://twitter.com)

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ If you find this helpful, please consider giving us a star!

[View on GitHub](https://github.com/DivyeBhatnagar/CodePilot-AI) • [Live Demo](https://codepilot-ai.vercel.app)

</div>
