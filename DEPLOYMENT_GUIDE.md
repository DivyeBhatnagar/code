# Deployment Guide - CodePilot AI

## Overview
- **Frontend**: Deploy to Vercel (Next.js)
- **Backend**: Deploy to Railway (FastAPI)

---

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Firebase project configured

### Step 1: Push Code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variables (click "Environment Variables"):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

6. Click "Deploy"
7. Wait 2-3 minutes for deployment to complete
8. Your app will be live at: `https://your-project.vercel.app`

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to Frontend directory
cd Frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? codepilot-ai
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Step 4: Update Firebase Configuration
1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to "Authorized domains":
   - `your-project.vercel.app`
   - Your custom domain (if any)

---

## 🚂 Backend Deployment (Railway)

### Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- OpenAI API key

### Step 1: Prepare Backend Files

Your backend already has:
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Railway startup command
- ✅ `runtime.txt` - Python version
- ✅ `railway.json` - Railway configuration

### Step 2: Deploy to Railway

#### Option A: Using Railway Dashboard (Recommended)
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Click "Add variables" and add:
   ```
   OPENAI_API_KEY=your_openai_api_key
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   PORT=8000
   ```

5. Configure deployment:
   - **Root Directory**: `Backend`
   - **Build Command**: (leave empty, Railway auto-detects)
   - **Start Command**: (uses Procfile automatically)

6. Click "Deploy"
7. Wait 3-5 minutes for deployment
8. Railway will provide a URL like: `https://your-app.railway.app`

#### Option B: Using Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Navigate to Backend directory
cd Backend

# Initialize Railway project
railway init

# Add environment variables
railway variables set OPENAI_API_KEY=your_key
railway variables set FIREBASE_PROJECT_ID=your_project_id
railway variables set PORT=8000

# Deploy
railway up

# Get deployment URL
railway domain
```

### Step 3: Configure Environment Variables

#### Required Variables:
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Firebase Admin SDK (for backend verification)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Server Configuration
PORT=8000
```

#### How to Get Firebase Admin SDK Credentials:
1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Download JSON file
5. Extract values:
   - `project_id` → FIREBASE_PROJECT_ID
   - `private_key` → FIREBASE_PRIVATE_KEY (keep \n characters)
   - `client_email` → FIREBASE_CLIENT_EMAIL

### Step 4: Update Frontend with Backend URL
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` with your Railway URL:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
3. Redeploy frontend (Vercel will auto-redeploy)

---

## 🔒 Security Checklist

### Frontend (Vercel)
- ✅ All Firebase config uses `NEXT_PUBLIC_` prefix
- ✅ No API keys in code (only in environment variables)
- ✅ Firebase security rules deployed
- ✅ CORS configured for your domain

### Backend (Railway)
- ✅ OPENAI_API_KEY in environment variables
- ✅ Firebase Admin SDK credentials secure
- ✅ CORS allows only your Vercel domain
- ✅ Rate limiting enabled

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS in Backend
Edit `Backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",
        "http://localhost:3000"  # for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Deploy Firestore Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 3. Test Deployment
1. Visit your Vercel URL
2. Register a new account
3. Create a hackathon plan
4. Generate code
5. Check auto-save functionality
6. Verify all features work

---

## 📊 Monitoring & Logs

### Vercel Logs
```bash
# View logs
vercel logs

# View specific deployment
vercel logs [deployment-url]
```

### Railway Logs
```bash
# View logs
railway logs

# Follow logs in real-time
railway logs --follow
```

### Or use dashboards:
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails on Vercel:**
- Check environment variables are set
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check build logs for specific errors

**Firebase authentication not working:**
- Verify domain is added to Firebase authorized domains
- Check Firebase config in `.env.local` matches production

**API calls failing:**
- Verify `NEXT_PUBLIC_API_URL` points to Railway backend
- Check CORS configuration in backend
- Verify backend is running on Railway

### Backend Issues

**Railway deployment fails:**
- Check `requirements.txt` has all dependencies
- Verify Python version in `runtime.txt` is supported
- Check Railway logs for specific errors

**OpenAI API errors:**
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has credits
- Verify key has correct permissions

**Firebase Admin SDK errors:**
- Check `FIREBASE_PRIVATE_KEY` includes `\n` characters
- Verify service account has correct permissions
- Ensure all three Firebase variables are set

---

## 💰 Cost Estimates

### Vercel (Frontend)
- **Free Tier**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domains
  - **Cost**: $0/month

### Railway (Backend)
- **Free Tier**: 
  - $5 credit/month
  - ~500 hours runtime
  - **Cost**: $0/month (with credit)
- **Pro Plan**: $20/month (if needed)

### Firebase (Database)
- **Spark Plan (Free)**:
  - 1GB storage
  - 10GB/month transfer
  - 50K reads/day
  - 20K writes/day
  - **Cost**: $0/month

### OpenAI API
- **Pay-as-you-go**:
  - GPT-4: ~$0.03 per 1K tokens
  - GPT-3.5: ~$0.002 per 1K tokens
  - **Estimated**: $10-50/month (depends on usage)

**Total Estimated Cost**: $10-50/month (mostly OpenAI)

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub** → Automatic deployment
2. **Pull Request** → Preview deployment
3. **Merge to main** → Production deployment

No manual deployment needed after initial setup!

---

## 📝 Environment Variables Summary

### Frontend (.env.local → Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Backend (.env → Railway)
```bash
OPENAI_API_KEY=sk-...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=...
PORT=8000
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] All environment variables configured
- [ ] Firebase rules deployed
- [ ] CORS configured correctly
- [ ] Custom domains configured (optional)
- [ ] Test all features in production
- [ ] Monitor logs for errors
- [ ] Set up error tracking (optional: Sentry)

---

## 🎉 You're Live!

Your CodePilot AI is now deployed and accessible worldwide!

- **Frontend**: https://your-project.vercel.app
- **Backend**: https://your-backend.railway.app
- **API Docs**: https://your-backend.railway.app/docs

Need help? Check the logs or reach out to support!
