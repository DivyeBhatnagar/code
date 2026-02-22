# 🎯 How to Use CodePilot AI

## 🌐 Your Application is Running!

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

---

## 📱 Available Pages

### 1. Landing Page - `/`
**URL:** http://localhost:3000

Beautiful homepage with:
- Hero section
- Features showcase
- Timeline
- Social proof
- Interactive demo
- Call to action

### 2. Login Page - `/login`
**URL:** http://localhost:3000/login

Features:
- Email/Password login
- Google OAuth login
- Link to register page
- Same purple/dark theme

### 3. Register Page - `/register`
**URL:** http://localhost:3000/register

Features:
- Full name input
- Email/Password registration
- Google OAuth signup
- Password confirmation
- Link to login page

### 4. Dashboard - `/dashboard` (Protected)
**URL:** http://localhost:3000/dashboard

**This is where the magic happens!**

Four AI Tools Available:
1. **Hackathon Analyzer** 🧠
   - Analyzes problem statements
   - Identifies pain points
   - Suggests success metrics
   
2. **MVP Planner** 📋
   - Creates feature lists
   - Generates timelines
   - Recommends tech stack
   
3. **Pitch Generator** 💡
   - Crafts compelling pitches
   - Creates demo flows
   - Generates talking points
   
4. **Tech Stack Advisor** 💻
   - Recommends technologies
   - Explains reasoning
   - Provides alternatives

---

## 🚀 How to Use the Dashboard

### Step 1: Register/Login
1. Go to http://localhost:3000
2. Click "Launch App" or "Login"
3. Register with email or Google
4. You'll be redirected to dashboard

### Step 2: Choose a Tool
- Click on any of the 4 AI tool cards
- Each has a unique color and icon

### Step 3: Enter Your Input
- Type your problem statement or idea
- Be specific for better results
- Minimum 10 characters required

### Step 4: Generate AI Response
- Click "Generate with AI"
- Wait for the AI to process (5-15 seconds)
- View formatted JSON results

### Step 5: Use the Results
- Copy the generated content
- Use it for your hackathon
- Generate multiple variations

---

## 🎨 Theme Consistency

All pages use the same beautiful theme:
- **Background:** Dark gradient (slate-900 → purple-900 → slate-900)
- **Cards:** Glass morphism with white/5 opacity
- **Borders:** White/10 opacity
- **Accents:** Purple, blue, pink gradients
- **Text:** White primary, gray-300 secondary

---

## 🔥 Example Use Cases

### Hackathon Analyzer
**Input:**
```
Build a platform that helps students find study groups based on their courses and learning styles
```

**Output:** JSON with problem analysis, target audience, pain points, success metrics

### MVP Planner
**Input:**
```
Create an app for tracking daily water intake with reminders and health insights
```

**Output:** JSON with core features, timeline, tech stack recommendations

### Pitch Generator
**Input:**
```
A mobile app that uses AI to help people reduce food waste by suggesting recipes based on ingredients they have
```

**Output:** JSON with hook, problem statement, solution, market opportunity

### Tech Stack Advisor
**Input:**
```
Real-time collaborative whiteboard for remote teams with video chat
```

**Output:** JSON with recommended stack, reasoning, alternatives

---

## 🔐 Authentication Flow

1. **Unauthenticated User:**
   - Can view landing page
   - Can access login/register
   - Cannot access dashboard

2. **Authenticated User:**
   - Automatically redirected to dashboard after login
   - Can use all 4 AI tools
   - Can logout anytime

3. **Protected Routes:**
   - Dashboard checks authentication
   - Redirects to login if not authenticated
   - Firebase handles token management

---

## 🛠️ Backend API Integration

The dashboard connects to your backend:

**Endpoint:** `POST http://localhost:8000/ai/generate`

**Headers:**
```
Authorization: Bearer <FIREBASE_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "mvp_planner",
  "input": "Your problem statement here"
}
```

**Response:**
```json
{
  "success": true,
  "type": "mvp_planner",
  "result": "{...JSON result...}"
}
```

---

## 📊 Features Summary

### ✅ Working Features
- Landing page with animations
- User registration (email + Google)
- User login (email + Google)
- Protected dashboard route
- 4 AI generation tools
- Real-time AI responses
- Beautiful UI with consistent theme
- Logout functionality
- Error handling
- Loading states

### 🔄 Backend Integration
- Firebase authentication
- GitHub Models (GPT-4) generation
- Token verification
- CORS enabled
- Error responses

---

## 🎯 Quick Test Flow

1. **Open:** http://localhost:3000
2. **Click:** "Launch App"
3. **Register:** Use your email or Google
4. **Choose:** "MVP Planner"
5. **Enter:** "Build a todo app with AI suggestions"
6. **Click:** "Generate with AI"
7. **View:** Your AI-generated MVP plan!

---

## 💡 Tips

- **Be Specific:** More detailed input = better AI results
- **Try All Tools:** Each tool has unique capabilities
- **Copy Results:** Use the generated content for your projects
- **Experiment:** Try different problem statements
- **Iterate:** Generate multiple times for variations

---

## 🐛 Troubleshooting

### "Authentication failed"
- Make sure you're logged in
- Try logging out and back in
- Check Firebase console for auth issues

### "AI generation failed"
- Check backend is running (http://localhost:8000/health)
- Verify GitHub token in Backend/.env
- Check browser console for errors

### "Cannot access dashboard"
- You must be logged in
- Register/login first
- Check authentication state

---

## 🚀 You're All Set!

Your CodePilot AI is fully functional with:
- ✅ Beautiful, consistent UI
- ✅ Working authentication
- ✅ 4 AI tools ready to use
- ✅ Backend fully integrated
- ✅ Production-ready code

**Start building amazing hackathon projects! 🎉**
