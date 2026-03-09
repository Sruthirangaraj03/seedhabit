"""SeedHabit API - Main FastAPI application."""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import settings
from app.routers.auth import router as auth_router
from app.routers.habits import router as habits_router
from app.routers.streaks import router as streaks_router
from app.routers.dashboard import router as dashboard_router
from app.routers.admin import router as admin_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="SeedHabit API",
    version="1.0.0",
    description="A habit tracking micro-SaaS API",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

cors_origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "https://seedhabit-frontend.onrender.com",
]
# Remove duplicates and empty strings
cors_origins = [o for o in set(cors_origins) if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    """Log application startup."""
    logger.info("SeedHabit API starting up...")


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Log application shutdown."""
    logger.info("SeedHabit API shutting down...")


@app.get("/health")
async def health() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(habits_router, prefix="/api/v1/habits", tags=["habits"])
app.include_router(streaks_router, prefix="/api/v1", tags=["streaks"])
app.include_router(dashboard_router, prefix="/api/v1", tags=["dashboard"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["admin"])

logger.info("SeedHabit API initialized successfully")
