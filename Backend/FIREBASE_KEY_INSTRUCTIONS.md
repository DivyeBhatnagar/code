# 🔑 Firebase Service Account Key Setup

## What You Need

Your Firebase Admin SDK requires a service account key JSON file to authenticate with Firebase services.

## How to Get Your Firebase Service Account Key

### Step 1: Go to Firebase Console
Visit: https://console.firebase.google.com/

### Step 2: Select Your Project
Click on: **CodePilot AI -Divye**
Project ID: `codepilot-ai--divye`

### Step 3: Navigate to Service Accounts
1. Click the ⚙️ (gear icon) in the top left
2. Click **Project Settings**
3. Click the **Service Accounts** tab

### Step 4: Generate New Private Key
1. You'll see a section titled "Firebase Admin SDK"
2. Click the button **Generate New Private Key**
3. A dialog will appear warning you to keep this key secure
4. Click **Generate Key**

### Step 5: Save the File
1. A JSON file will download automatically
2. The file name will be something like: `codepilot-ai--divye-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
3. **Rename this file to:** `firebase-credentials.json`
4. **Move it to:** `Backend/firebase-credentials.json`

## File Location

Your file structure should look like this:

```
Backend/
├── app/
├── firebase-credentials.json  ← Put the file here!
├── .env
├── requirements.txt
└── ...
```

## Security Warning ⚠️

**NEVER commit this file to Git!**

The file is already in `.gitignore`, but double-check:
- ✅ `firebase-credentials.json` is in `.gitignore`
- ❌ Never share this file publicly
- ❌ Never commit it to GitHub
- ❌ Never include it in screenshots

## Verify Setup

After placing the file, run:

```bash
cd Backend
python -c "import os; print('✅ File exists!' if os.path.exists('firebase-credentials.json') else '❌ File not found')"
```

## What This File Contains

The JSON file contains:
- `type`: "service_account"
- `project_id`: "codepilot-ai--divye"
- `private_key_id`: Your private key ID
- `private_key`: Your private key (keep secret!)
- `client_email`: Service account email
- `client_id`: Client ID
- And more...

## Example Structure (DO NOT USE THIS - GET YOUR OWN!)

```json
{
  "type": "service_account",
  "project_id": "codepilot-ai--divye",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@codepilot-ai--divye.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## Troubleshooting

### "File not found" error
- Check the file is named exactly: `firebase-credentials.json`
- Check it's in the `Backend/` folder (not in `Backend/app/`)
- Check file permissions (should be readable)

### "Invalid credentials" error
- Download a fresh key from Firebase Console
- Make sure you selected the correct project
- Verify the JSON file is valid (not corrupted)

### "Permission denied" error
- Check your Firebase project permissions
- Ensure you're an owner/editor of the project
- Try generating a new key

## Need Help?

If you're stuck:
1. Check the file exists: `ls -la Backend/firebase-credentials.json`
2. Check the file is valid JSON: `python -m json.tool Backend/firebase-credentials.json`
3. Check Firebase Console for any issues with your project

---

Once you have this file in place, your backend will be able to verify Firebase authentication tokens! 🚀
