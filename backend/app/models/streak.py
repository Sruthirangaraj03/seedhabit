import logging

from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

logger = logging.getLogger(__name__)


class Streak(Base):
    """Streak model tracking current and longest streaks for a habit."""

    __tablename__ = "streaks"

    id: int = Column(Integer, primary_key=True, index=True)
    habit_id: int = Column(
        Integer,
        ForeignKey("habits.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    user_id: int = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    current_streak: int = Column(Integer, default=0)
    longest_streak: int = Column(Integer, default=0)
    last_completed_at = Column(Date, nullable=True)

    # Relationships
    habit = relationship("Habit", back_populates="streak")

    def __repr__(self) -> str:
        return f"<Streak(id={self.id}, habit_id={self.habit_id}, current={self.current_streak})>"
