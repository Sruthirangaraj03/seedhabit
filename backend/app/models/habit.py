import logging

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Time,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

logger = logging.getLogger(__name__)


class Habit(Base):
    """Habit model representing a tracked habit."""

    __tablename__ = "habits"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: str = Column(String(100), nullable=False)
    description: str | None = Column(String(500), nullable=True)
    frequency: str = Column(String(20), nullable=False, default="daily")
    category: str | None = Column(String(50), nullable=True)
    color: str = Column(String(7), default="#6366f1")
    icon: str = Column(String(50), default="check")
    reminder_time = Column(Time, nullable=True)
    is_archived: bool = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_user_habit_name"),
    )

    # Relationships
    user = relationship("User", back_populates="habits")
    logs = relationship(
        "HabitLog", back_populates="habit", cascade="all, delete-orphan"
    )
    streak = relationship(
        "Streak",
        back_populates="habit",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Habit(id={self.id}, name={self.name})>"
