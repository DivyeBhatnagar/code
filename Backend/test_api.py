#!/usr/bin/env python3
"""
Simple test script for CodePilot AI Backend
Run this after starting the server to verify everything works
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 200

def test_root():
    """Test root endpoint"""
    print("Testing / endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 200

def test_ai_types():
    """Test AI types endpoint (requires auth)"""
    print("Testing /ai/types endpoint (should fail without auth)...")
    response = requests.get(f"{BASE_URL}/ai/types")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 401  # Should fail without auth

def test_ai_generate_no_auth():
    """Test AI generate endpoint without auth (should fail)"""
    print("Testing /ai/generate endpoint without auth (should fail)...")
    response = requests.post(
        f"{BASE_URL}/ai/generate",
        json={
            "type": "mvp_planner",
            "input": "Build a study group finder app"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.status_code == 403  # Should fail without auth

def main():
    print("=" * 60)
    print("CodePilot AI Backend - API Tests")
    print("=" * 60 + "\n")
    
    tests = [
        ("Health Check", test_health),
        ("Root Endpoint", test_root),
        ("AI Types (No Auth)", test_ai_types),
        ("AI Generate (No Auth)", test_ai_generate_no_auth),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"Error in {name}: {str(e)}\n")
            results.append((name, False))
    
    print("=" * 60)
    print("Test Results:")
    print("=" * 60)
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")
    
    print("\n" + "=" * 60)
    print("Note: Auth-protected endpoints should fail without token")
    print("This is expected behavior!")
    print("=" * 60)

if __name__ == "__main__":
    main()
