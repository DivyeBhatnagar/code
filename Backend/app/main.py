from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.routers import ai_router, auth_router, hackathon_router
from app.config import settings
from app.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler
)
from app.utils.logger import logger
import time

app = FastAPI(
    title="CodePilot AI Backend",
    description="Production-ready FastAPI backend for CodePilot AI SaaS",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Exception handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    return response

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 CodePilot AI Backend starting up...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Frontend URL: {settings.FRONTEND_URL}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 CodePilot AI Backend shutting down...")

# Register routers
app.include_router(ai_router.router, prefix="/ai", tags=["AI"])
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(hackathon_router.router, prefix="/hackathon", tags=["Hackathon"])

# Optional: Uncomment when you want to add database endpoints
# from app.routers import database_router
# app.include_router(database_router.router, prefix="/db", tags=["Database"])

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "message": "CodePilot AI Backend",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "CodePilot AI",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }
