import logging

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

logger = logging.getLogger(__name__)


class User(Base):
    """User account model."""

    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email: str = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password: str | None = Column(String(255), nullable=True)
    full_name: str = Column(String(100), nullable=False)
    avatar_url: str | None = Column(String(500), nullable=True)
    is_active: bool = Column(Boolean, default=True)
    is_verified: bool = Column(Boolean, default=False)
    is_admin: bool = Column(Boolean, default=False)
    oauth_provider: str | None = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    habits = relationship(
        "Habit", back_populates="user", cascade="all, delete-orphan"
    )
    refresh_tokens = relationship(
        "RefreshToken", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
