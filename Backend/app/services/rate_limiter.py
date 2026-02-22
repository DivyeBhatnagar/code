from fastapi import HTTPException, Request
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict
import asyncio

class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self, requests_per_minute: int = 10):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = asyncio.Lock()
    
    async def check_rate_limit(self, identifier: str):
        """
        Check if request is within rate limit
        
        Args:
            identifier: User ID or IP address
            
        Raises:
            HTTPException: If rate limit exceeded
        """
        async with self.lock:
            now = datetime.now()
            minute_ago = now - timedelta(minutes=1)
            
            # Clean old requests
            self.requests[identifier] = [
                req_time for req_time in self.requests[identifier]
                if req_time > minute_ago
            ]
            
            # Check limit
            if len(self.requests[identifier]) >= self.requests_per_minute:
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Max {self.requests_per_minute} requests per minute."
                )
            
            # Add current request
            self.requests[identifier].append(now)

# Global rate limiter instance
rate_limiter = RateLimiter(requests_per_minute=20)

async def rate_limit_dependency(request: Request, user: dict):
    """Dependency for rate limiting"""
    identifier = user.get("uid", request.client.host)
    await rate_limiter.check_rate_limit(identifier)
    return user
