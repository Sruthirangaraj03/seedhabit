"""Authentication service layer with business logic."""

import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.auth.jwt import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.config import settings
from app.exceptions import ConflictError, UnauthorizedError
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.user import TokenResponse, UserCreate, UserUpdate

logger = logging.getLogger(__name__)


def register_user(db: Session, user_data: UserCreate) -> User:
    """Register a new user.

    Args:
        db: Database session.
        user_data: User registration data.

    Returns:
        The newly created User.

    Raises:
        ConflictError: If email already exists.
    """
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        logger.warning("Registration attempt with existing email: %s", user_data.email)
        raise ConflictError(detail="Email already registered")

    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("User registered successfully: %s", user.email)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    """Authenticate a user by email and password.

    Args:
        db: Database session.
        email: User email.
        password: Plain text password.

    Returns:
        The authenticated User.

    Raises:
        UnauthorizedError: If credentials are invalid.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        logger.warning("Login attempt with unknown email: %s", email)
        raise UnauthorizedError(detail="Invalid email or password")

    if not user.hashed_password:
        logger.warning("Login attempt for OAuth-only user: %s", email)
        raise UnauthorizedError(detail="This account uses OAuth login")

    if not verify_password(password, user.hashed_password):
        logger.warning("Invalid password for user: %s", email)
        raise UnauthorizedError(detail="Invalid email or password")

    if not user.is_active:
        logger.warning("Login attempt for inactive user: %s", email)
        raise UnauthorizedError(detail="Account is deactivated")

    logger.info("User authenticated successfully: %s", email)
    return user


def create_tokens(db: Session, user: User) -> TokenResponse:
    """Create access and refresh token pair for a user.

    Args:
        db: Database session.
        user: The authenticated user.

    Returns:
        TokenResponse with access and refresh tokens.
    """
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token_value = create_refresh_token()

    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    db_refresh_token = RefreshToken(
        user_id=user.id,
        token=refresh_token_value,
        expires_at=expires_at,
    )
    db.add(db_refresh_token)
    db.commit()

    logger.info("Tokens created for user: %s", user.email)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_value,
    )


def refresh_tokens(db: Session, refresh_token: str) -> TokenResponse:
    """Refresh an access token using a valid refresh token.

    Args:
        db: Database session.
        refresh_token: The refresh token string.

    Returns:
        New TokenResponse with fresh access and refresh tokens.

    Raises:
        UnauthorizedError: If refresh token is invalid, expired, or revoked.
    """
    db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == refresh_token)
        .first()
    )

    if not db_token:
        logger.warning("Refresh attempt with unknown token")
        raise UnauthorizedError(detail="Invalid refresh token")

    if db_token.revoked:
        logger.warning("Refresh attempt with revoked token for user_id: %s", db_token.user_id)
        raise UnauthorizedError(detail="Refresh token has been revoked")

    if db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        logger.warning("Refresh attempt with expired token for user_id: %s", db_token.user_id)
        raise UnauthorizedError(detail="Refresh token has expired")

    # Revoke the old token
    db_token.revoked = True
    db.commit()

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user or not user.is_active:
        raise UnauthorizedError(detail="User not found or inactive")

    logger.info("Tokens refreshed for user: %s", user.email)
    return create_tokens(db, user)


def revoke_refresh_token(db: Session, token: str) -> None:
    """Revoke a refresh token.

    Args:
        db: Database session.
        token: The refresh token string to revoke.
    """
    db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == token)
        .first()
    )
    if db_token:
        db_token.revoked = True
        db.commit()
        logger.info("Refresh token revoked for user_id: %s", db_token.user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    """Find a user by email address.

    Args:
        db: Database session.
        email: The email to search for.

    Returns:
        User if found, None otherwise.
    """
    return db.query(User).filter(User.email == email).first()


def update_user(db: Session, user: User, data: UserUpdate) -> User:
    """Update a user's profile.

    Args:
        db: Database session.
        user: The user to update.
        data: The update data.

    Returns:
        The updated User.
    """
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    logger.info("User profile updated: %s", user.email)
    return user
