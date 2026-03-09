"""Pydantic schemas for dashboard data."""

from pydantic import BaseModel


class TodayHabitItem(BaseModel):
    """Schema for a single habit in the today section."""

    id: int
    name: str
    color: str
    icon: str
    completed: bool
    streak: int


class TodaySection(BaseModel):
    """Schema for the today section of the dashboard."""

    date: str
    habits: list[TodayHabitItem]
    completed_count: int
    total_count: int
    completion_rate: float


class StreakHighlight(BaseModel):
    """Schema for a streak highlight."""

    habit_name: str
    streak: int


class StreaksSection(BaseModel):
    """Schema for the streaks section of the dashboard."""

    best_current: StreakHighlight | None
    best_ever: StreakHighlight | None


class StatsSection(BaseModel):
    """Schema for the stats section of the dashboard."""

    total_habits: int
    active_habits: int
    total_completions: int
    overall_completion_rate: float


class DashboardResponse(BaseModel):
    """Schema for the full dashboard response."""

    today: TodaySection
    streaks: StreaksSection
    stats: StatsSection


class WeeklySummaryDay(BaseModel):
    """Schema for a single day in the weekly summary."""

    date: str
    completed: int
    total: int


class WeeklySummaryResponse(BaseModel):
    """Schema for the weekly summary response."""

    days: list[WeeklySummaryDay]


class HistoryHabitItem(BaseModel):
    """Schema for a completed habit in history."""

    habit_id: int
    habit_name: str
    color: str
    icon: str
    category: str | None
    note: str | None


class HistoryDayItem(BaseModel):
    """Schema for a single day in history."""

    date: str
    habits: list[HistoryHabitItem]
    count: int


class HistoryResponse(BaseModel):
    """Schema for the history response."""

    days: list[HistoryDayItem]
