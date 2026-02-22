#!/usr/bin/env python3
"""
Verification script to check if all backend files are complete and properly configured
"""

import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"✅ {description}: {filepath} ({size} bytes)")
        return True
    else:
        print(f"❌ {description}: {filepath} - NOT FOUND")
        return False

def check_file_content(filepath, required_strings, description):
    """Check if file contains required content"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            missing = []
            for req in required_strings:
                if req not in content:
                    missing.append(req)
            
            if not missing:
                print(f"✅ {description}: All required content present")
                return True
            else:
                print(f"❌ {description}: Missing content: {', '.join(missing)}")
                return False
    except Exception as e:
        print(f"❌ {description}: Error reading file - {str(e)}")
        return False

def main():
    print("=" * 70)
    print("CodePilot AI Backend - Setup Verification")
    print("=" * 70 + "\n")
    
    base_path = Path("Backend")
    results = []
    
    # Check directory structure
    print("📁 Checking Directory Structure...")
    print("-" * 70)
    directories = [
        "app",
        "app/routers",
        "app/services",
        "app/schemas",
        "app/utils",
        "app/middleware"
    ]
    
    for directory in directories:
        path = base_path / directory
        exists = path.exists() and path.is_dir()
        status = "✅" if exists else "❌"
        print(f"{status} {directory}/")
        results.append(exists)
    
    print()
    
    # Check core files
    print("📄 Checking Core Files...")
    print("-" * 70)
    
    files_to_check = [
        ("app/main.py", "Main application file"),
        ("app/config.py", "Configuration file"),
        ("app/__init__.py", "App init file"),
        ("requirements.txt", "Dependencies file"),
        (".env", "Environment variables"),
        (".env.example", "Environment example"),
        (".gitignore", "Git ignore file"),
        ("railway.json", "Railway config"),
        ("Procfile", "Procfile for deployment"),
        ("runtime.txt", "Python runtime"),
        ("README.md", "Documentation"),
        ("DEPLOYMENT.md", "Deployment guide"),
        ("START_HERE.md", "Quick start guide"),
    ]
    
    for filepath, description in files_to_check:
        full_path = base_path / filepath
        results.append(check_file_exists(full_path, description))
    
    print()
    
    # Check router files
    print("🛣️  Checking Router Files...")
    print("-" * 70)
    
    router_files = [
        ("app/routers/__init__.py", "Routers init"),
        ("app/routers/ai_router.py", "AI router"),
        ("app/routers/auth_router.py", "Auth router"),
        ("app/routers/database_router.py", "Database router"),
    ]
    
    for filepath, description in router_files:
        full_path = base_path / filepath
        results.append(check_file_exists(full_path, description))
    
    print()
    
    # Check service files
    print("⚙️  Checking Service Files...")
    print("-" * 70)
    
    service_files = [
        ("app/services/__init__.py", "Services init"),
        ("app/services/github_ai_service.py", "GitHub AI service"),
        ("app/services/prompt_templates.py", "Prompt templates"),
        ("app/services/rate_limiter.py", "Rate limiter"),
    ]
    
    for filepath, description in service_files:
        full_path = base_path / filepath
        results.append(check_file_exists(full_path, description))
    
    print()
    
    # Check utility files
    print("🔧 Checking Utility Files...")
    print("-" * 70)
    
    util_files = [
        ("app/utils/__init__.py", "Utils init"),
        ("app/utils/firebase_verify.py", "Firebase verification"),
        ("app/utils/logger.py", "Logger utility"),
        ("app/utils/response_models.py", "Response models"),
    ]
    
    for filepath, description in util_files:
        full_path = base_path / filepath
        results.append(check_file_exists(full_path, description))
    
    print()
    
    # Check schema files
    print("📋 Checking Schema Files...")
    print("-" * 70)
    
    schema_files = [
        ("app/schemas/__init__.py", "Schemas init"),
        ("app/schemas/ai_schema.py", "AI schemas"),
    ]
    
    for filepath, description in schema_files:
        full_path = base_path / filepath
        results.append(check_file_exists(full_path, description))
    
    print()
    
    # Check middleware files
    print("🔀 Checking Middleware Files...")
    print("-" * 70)
    
    middleware_files = [
        ("app/middleware/__init__.py", "Middleware init"),
        ("app/middleware/error_handler.py", "Error handler"),
    ]
    
    for filepath, description in middleware_files:
        full_path = base_path / filepath
        results.append(check_file_exists(full_path, description))
    
    print()
    
    # Check critical content
    print("🔍 Checking Critical Content...")
    print("-" * 70)
    
    # Check main.py has all required imports and setup
    results.append(check_file_content(
        base_path / "app/main.py",
        ["FastAPI", "CORSMiddleware", "ai_router", "auth_router", "@app.get"],
        "Main app configuration"
    ))
    
    # Check config has all settings
    results.append(check_file_content(
        base_path / "app/config.py",
        ["GITHUB_TOKEN", "FIREBASE_PROJECT_ID", "FRONTEND_URL"],
        "Configuration settings"
    ))
    
    # Check .env has credentials
    results.append(check_file_content(
        base_path / ".env",
        ["GITHUB_TOKEN=github_pat", "FIREBASE_PROJECT_ID=codepilot"],
        "Environment variables"
    ))
    
    # Check GitHub AI service
    results.append(check_file_content(
        base_path / "app/services/github_ai_service.py",
        ["async def generate_ai_response", "httpx", "GITHUB_API_URL"],
        "GitHub AI service implementation"
    ))
    
    # Check prompt templates
    results.append(check_file_content(
        base_path / "app/services/prompt_templates.py",
        ["hackathon_analyzer_prompt", "mvp_planner_prompt", "pitch_generator_prompt", "tech_stack_advisor_prompt"],
        "Prompt templates"
    ))
    
    # Check firebase verification
    results.append(check_file_content(
        base_path / "app/utils/firebase_verify.py",
        ["firebase_admin", "verify_token", "initialize_firebase"],
        "Firebase verification"
    ))
    
    print()
    
    # Summary
    print("=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    
    total = len(results)
    passed = sum(results)
    failed = total - passed
    
    print(f"Total Checks: {total}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print()
    
    if failed == 0:
        print("🎉 ALL CHECKS PASSED! Your backend is complete and ready!")
        print()
        print("Next steps:")
        print("1. Download firebase-credentials.json from Firebase Console")
        print("2. Run: pip install -r requirements.txt")
        print("3. Run: uvicorn app.main:app --reload")
        print("4. Visit: http://localhost:8000/docs")
        return 0
    else:
        print("⚠️  Some checks failed. Please review the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
