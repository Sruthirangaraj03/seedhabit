"""Pydantic schemas for streaks and stats."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class StreakResponse(BaseModel):
    """Schema for streak response data."""

    habit_id: int
    habit_name: str
    current_streak: int
    longest_streak: int
    last_completed_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class HabitLogResponse(BaseModel):
    """Schema for habit log response data."""

    id: int
    habit_id: int
    completed_at: date
    note: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HeatmapEntry(BaseModel):
    """Schema for a single heatmap data point."""

    date: str
    count: int


class CompletionRateResponse(BaseModel):
    """Schema for completion rate statistics."""

    period: str
    rate: float
    completed: int
    total: int
