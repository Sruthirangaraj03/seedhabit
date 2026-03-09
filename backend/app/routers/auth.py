"""Authentication router with all auth endpoints."""

import logging

from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.auth.oauth import google_authorize_url, google_callback
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)
from app.services.auth_service import (
    authenticate_user,
    create_tokens,
    refresh_tokens,
    register_user,
    revoke_refresh_token,
    update_user,
)

logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Register a new user account and return tokens."""
    user = register_user(db, user_data)
    tokens = create_tokens(db, user)
    logger.info("New user registered: %s", user.email)
    return tokens


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Login with email and password."""
    user = authenticate_user(db, credentials.email, credentials.password)
    tokens = create_tokens(db, user)
    logger.info("User logged in: %s", user.email)
    return tokens


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    body: dict,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Refresh access token using a valid refresh token.

    Args:
        body: Request body containing refresh_token.
        db: Database session.

    Returns:
        New access and refresh tokens.
    """
    refresh_token_value: str = body.get("refresh_token", "")
    tokens = refresh_tokens(db, refresh_token_value)
    return tokens


@router.post("/logout")
async def logout(
    body: dict,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    """Logout by revoking the refresh token.

    Args:
        body: Request body containing refresh_token.
        current_user: The authenticated user.
        db: Database session.

    Returns:
        Success message.
    """
    refresh_token_value: str = body.get("refresh_token", "")
    revoke_refresh_token(db, refresh_token_value)
    logger.info("User logged out: %s", current_user.email)
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """Get the current user's profile.

    Args:
        current_user: The authenticated user.

    Returns:
        The current user's profile data.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> User:
    """Update the current user's profile.

    Args:
        data: Fields to update.
        current_user: The authenticated user.
        db: Database session.

    Returns:
        The updated user profile.
    """
    updated_user = update_user(db, current_user, data)
    logger.info("User profile updated: %s", current_user.email)
    return updated_user


@router.post("/forgot-password")
async def forgot_password(
    request_data: ForgotPasswordRequest,
) -> dict[str, str]:
    """Request a password reset email.

    Args:
        request_data: Contains the user's email.

    Returns:
        Success message (always returns success to prevent email enumeration).
    """
    logger.info("Password reset requested for: %s", request_data.email)
    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    request_data: ResetPasswordRequest,
) -> dict[str, str]:
    """Reset password using a reset token.

    Args:
        request_data: Contains reset token and new password.

    Returns:
        Success message.
    """
    logger.info("Password reset attempted with token")
    return {"message": "Password reset functionality coming soon"}


@router.get("/google")
async def google_login() -> RedirectResponse:
    """Redirect to Google OAuth authorization page.

    Returns:
        Redirect response to Google OAuth URL.
    """
    url = google_authorize_url()
    return RedirectResponse(url=url)


@router.get("/google/callback", response_model=TokenResponse)
async def google_oauth_callback(
    code: str,
    state: str | None = None,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Handle Google OAuth callback.

    Args:
        code: Authorization code from Google.
        state: State parameter for CSRF protection.
        db: Database session.

    Returns:
        Access and refresh tokens.
    """
    tokens = await google_callback(code, db)
    logger.info("User authenticated via Google OAuth")
    return tokens
