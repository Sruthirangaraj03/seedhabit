"""Pydantic schemas for habits."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class StreakInfo(BaseModel):
    """Streak information embedded in habit response."""

    current_streak: int = 0
    longest_streak: int = 0
    last_completed_at: datetime | None = None


class HabitCreate(BaseModel):
    """Schema for creating a new habit."""

    name: str = Field(..., max_length=100)
    description: str | None = None
    frequency: str = Field(default="daily", max_length=20)
    category: str | None = Field(default=None, max_length=50)
    color: str = Field(default="#6366f1", max_length=7)
    icon: str = Field(default="check", max_length=50)
    reminder_time: str | None = None


class HabitUpdate(BaseModel):
    """Schema for updating a habit."""

    name: str | None = Field(default=None, max_length=100)
    description: str | None = None
    frequency: str | None = Field(default=None, max_length=20)
    category: str | None = None
    color: str | None = Field(default=None, max_length=7)
    icon: str | None = Field(default=None, max_length=50)
    reminder_time: str | None = None


class HabitResponse(BaseModel):
    """Schema for habit response data."""

    id: int
    user_id: int
    name: str
    description: str | None
    frequency: str
    category: str | None
    color: str
    icon: str
    reminder_time: str | None
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    streak_info: StreakInfo | None = None
    completed_today: bool | None = None

    model_config = ConfigDict(from_attributes=True)


class HabitListResponse(BaseModel):
    """Schema for paginated habit list response."""

    habits: list[HabitResponse]
    total: int
