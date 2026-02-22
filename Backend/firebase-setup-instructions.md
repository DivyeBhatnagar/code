# Firebase Setup Instructions

## 1. Download Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **CodePilot AI -Divye**
3. Click the gear icon ⚙️ → Project Settings
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file as `firebase-credentials.json` in the Backend folder

## 2. Firebase Database Rules

Go to Firebase Console → Firestore Database → Rules

Paste these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }
    
    // AI Generations collection - users can only access their own generations
    match /generations/{generationId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Projects collection - users can only access their own projects
    match /projects/{projectId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 3. Firebase Authentication Setup

1. Go to Firebase Console → Authentication
2. Click **Get Started**
3. Enable these sign-in methods:
   - ✅ Email/Password
   - ✅ Google (optional but recommended)

## 4. Firestore Database Setup

1. Go to Firebase Console → Firestore Database
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select your preferred location (us-central1 recommended)
5. Apply the rules from step 2 above

## 5. Test Your Setup

After setting up, your database will have these collections:
- `users` - User profiles and settings
- `generations` - AI generation history
- `projects` - User projects and hackathon ideas

All data is automatically secured by user authentication!
