#!/usr/bin/env python3
"""
Test script to verify GitHub Models API token
"""

import httpx
import asyncio
import json
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
API_URL = "https://models.inference.ai.azure.com/chat/completions"

async def test_github_api():
    """Test GitHub Models API"""
    
    if not GITHUB_TOKEN:
        print("❌ Error: GITHUB_TOKEN not found in environment variables")
        print("Please set GITHUB_TOKEN in your .env file")
        return False
    
    print("=" * 70)
    print("Testing GitHub Models API (GPT-4)")
    print("=" * 70)
    print(f"Token: {GITHUB_TOKEN[:30]}...")
    print(f"URL: {API_URL}")
    print()
    
    test_prompt = "Say 'Hello, I am GPT-4 via GitHub Models and I am working!' in one sentence."
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                API_URL,
                headers={
                    "Authorization": f"Bearer {GITHUB_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {
                            "role": "user",
                            "content": test_prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 100
                }
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                result = data["choices"][0]["message"]["content"]
                print(f"✅ SUCCESS!")
                print(f"Response: {result}")
                print()
                print("=" * 70)
                print("✅ GitHub Models API is working perfectly!")
                print("=" * 70)
                return True
            else:
                error_data = response.json() if response.text else {}
                print(f"❌ Failed: {response.status_code}")
                if error_data:
                    print(f"Error: {json.dumps(error_data, indent=2)}")
                return False
                    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_github_api())
