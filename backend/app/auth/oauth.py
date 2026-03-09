"""Google OAuth authentication handler."""

import logging
import secrets
from urllib.parse import urlencode

from httpx import AsyncClient
from sqlalchemy.orm import Session

from app.config import settings
from app.exceptions import UnauthorizedError
from app.models.user import User
from app.schemas.user import TokenResponse
from app.services.auth_service import create_tokens, get_user_by_email

logger = logging.getLogger(__name__)

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


def google_authorize_url() -> str:
    """Generate Google OAuth authorization URL.

    Returns:
        The full Google OAuth authorization URL with query parameters.
    """
    state = secrets.token_urlsafe(32)
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "state": state,
    }
    url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    logger.info("Generated Google OAuth authorization URL")
    return url


async def google_callback(code: str, db: Session) -> TokenResponse:
    """Handle Google OAuth callback.

    Exchange authorization code for tokens, get user info,
    find or create user, and return JWT tokens.

    Args:
        code: The authorization code from Google.
        db: Database session.

    Returns:
        TokenResponse with access and refresh tokens.

    Raises:
        UnauthorizedError: If Google authentication fails.
    """
    async with AsyncClient() as client:
        # Exchange code for Google tokens
        token_response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            },
        )

        if token_response.status_code != 200:
            logger.warning("Google token exchange failed: %s", token_response.text)
            raise UnauthorizedError(detail="Failed to authenticate with Google")

        token_data = token_response.json()
        google_access_token = token_data.get("access_token")

        if not google_access_token:
            logger.warning("No access token in Google response")
            raise UnauthorizedError(detail="Failed to get access token from Google")

        # Get user info from Google
        userinfo_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {google_access_token}"},
        )

        if userinfo_response.status_code != 200:
            logger.warning("Google userinfo request failed: %s", userinfo_response.text)
            raise UnauthorizedError(detail="Failed to get user info from Google")

        userinfo = userinfo_response.json()

    email = userinfo.get("email")
    if not email:
        raise UnauthorizedError(detail="Google account has no email")

    # Find or create user
    user = get_user_by_email(db, email)
    if not user:
        user = User(
            email=email,
            full_name=userinfo.get("name", ""),
            avatar_url=userinfo.get("picture"),
            oauth_provider="google",
            is_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("New user created via Google OAuth: %s", email)
    else:
        # Update avatar if changed
        if userinfo.get("picture") and user.avatar_url != userinfo.get("picture"):
            user.avatar_url = userinfo.get("picture")
        if not user.oauth_provider:
            user.oauth_provider = "google"
        if not user.is_verified:
            user.is_verified = True
        db.commit()
        db.refresh(user)
        logger.info("Existing user logged in via Google OAuth: %s", email)

    if not user.is_active:
        raise UnauthorizedError(detail="Account is deactivated")

    return create_tokens(db, user)
