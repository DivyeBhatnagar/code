#!/bin/bash

# CodePilot AI Deployment Helper Script
# This script helps you deploy your application to Vercel and Railway

echo "🚀 CodePilot AI Deployment Helper"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes"
    echo "Commit your changes before deploying:"
    echo "  git add ."
    echo "  git commit -m 'Ready for deployment'"
    echo ""
fi

# Menu
echo "Choose deployment option:"
echo "1. Deploy Frontend to Vercel"
echo "2. Deploy Backend to Railway"
echo "3. Deploy Both"
echo "4. Setup Environment Variables"
echo "5. Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying Frontend to Vercel..."
        echo ""
        echo "Steps:"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Login: vercel login"
        echo "3. Deploy: cd Frontend && vercel --prod"
        echo ""
        read -p "Press Enter to open Vercel Dashboard..."
        open "https://vercel.com/new"
        ;;
    2)
        echo ""
        echo "🚂 Deploying Backend to Railway..."
        echo ""
        echo "Steps:"
        echo "1. Install Railway CLI: npm i -g @railway/cli"
        echo "2. Login: railway login"
        echo "3. Deploy: cd Backend && railway up"
        echo ""
        read -p "Press Enter to open Railway Dashboard..."
        open "https://railway.app/new"
        ;;
    3)
        echo ""
        echo "🎯 Deploying Both Services..."
        echo ""
        echo "1. First, deploy Backend to Railway"
        echo "2. Copy the Railway URL"
        echo "3. Update NEXT_PUBLIC_API_URL in Vercel"
        echo "4. Deploy Frontend to Vercel"
        echo ""
        read -p "Press Enter to open deployment guide..."
        open "DEPLOYMENT_GUIDE.md"
        ;;
    4)
        echo ""
        echo "⚙️  Environment Variables Setup"
        echo ""
        echo "Frontend (.env.local):"
        echo "  NEXT_PUBLIC_API_URL=https://your-backend.railway.app"
        echo "  NEXT_PUBLIC_FIREBASE_API_KEY=..."
        echo "  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=..."
        echo "  NEXT_PUBLIC_FIREBASE_PROJECT_ID=..."
        echo "  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=..."
        echo "  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=..."
        echo "  NEXT_PUBLIC_FIREBASE_APP_ID=..."
        echo ""
        echo "Backend (.env):"
        echo "  OPENAI_API_KEY=sk-..."
        echo "  FIREBASE_PROJECT_ID=..."
        echo "  FIREBASE_PRIVATE_KEY=..."
        echo "  FIREBASE_CLIENT_EMAIL=..."
        echo "  FRONTEND_URL=https://your-app.vercel.app"
        echo "  PORT=8000"
        echo ""
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
