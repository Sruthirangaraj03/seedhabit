import logging

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Date,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

logger = logging.getLogger(__name__)


class HabitLog(Base):
    """Habit log model tracking individual completions."""

    __tablename__ = "habit_logs"

    id: int = Column(Integer, primary_key=True, index=True)
    habit_id: int = Column(
        Integer,
        ForeignKey("habits.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: int = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    completed_at = Column(Date, nullable=False)
    note: str | None = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("habit_id", "completed_at", name="uq_habit_completion_date"),
    )

    # Relationships
    habit = relationship("Habit", back_populates="logs")

    def __repr__(self) -> str:
        return f"<HabitLog(id={self.id}, habit_id={self.habit_id}, completed_at={self.completed_at})>"
