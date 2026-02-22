from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from app.config import settings
import os

security = HTTPBearer()

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK with service account"""
    if not firebase_admin._apps:
        try:
            # Path to your Firebase service account key
            service_account_path = settings.FIREBASE_CREDENTIALS_PATH
            
            if service_account_path and os.path.exists(service_account_path):
                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(cred)
                print(f"✅ Firebase Admin SDK initialized successfully")
            else:
                print(f"⚠️  Firebase credentials not found at: {service_account_path}")
                print(f"⚠️  Running in development mode without Firebase verification")
                print(f"Please download your service account key and save it as 'firebase-credentials.json'")
                # Initialize without credentials for development
                # This will allow the app to run but auth verification will be skipped
        except Exception as e:
            print(f"❌ Firebase initialization error: {e}")

# Initialize on module load
initialize_firebase()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify Firebase ID token from Authorization header
    
    Args:
        credentials: HTTP Bearer token from request header
        
    Returns:
        Decoded user information
        
    Raises:
        HTTPException: If token is invalid or verification fails
    """
    # If Firebase is not initialized, skip verification for development
    if not firebase_admin._apps:
        print("⚠️  Warning: Firebase not initialized, skipping token verification")
        return {
            "uid": "dev-user",
            "email": "dev@example.com",
            "email_verified": True,
            "name": "Development User"
        }
    
    try:
        token = credentials.credentials
        
        # Verify the token with Firebase
        decoded_token = auth.verify_id_token(token)
        
        return {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False),
            "name": decoded_token.get("name", "")
        }
        
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Authentication token has expired"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )
