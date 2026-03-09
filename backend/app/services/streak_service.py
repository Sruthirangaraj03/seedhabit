"""Service layer for streak and statistics operations."""

import logging
from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.models.streak import Streak
from app.schemas.streak import (
    CompletionRateResponse,
    HeatmapEntry,
    StreakResponse,
)

logger = logging.getLogger(__name__)


def get_all_streaks(db: Session, user_id: int) -> list[StreakResponse]:
    """Get all streaks for a user with habit names.

    Args:
        db: Database session.
        user_id: ID of the user.

    Returns:
        List of StreakResponse objects.
    """
    results = (
        db.query(Streak, Habit.name)
        .join(Habit, Streak.habit_id == Habit.id)
        .filter(Streak.user_id == user_id)
        .order_by(Streak.current_streak.desc())
        .all()
    )

    return [
        StreakResponse(
            habit_id=streak.habit_id,
            habit_name=habit_name,
            current_streak=streak.current_streak,
            longest_streak=streak.longest_streak,
            last_completed_at=streak.last_completed_at,
        )
        for streak, habit_name in results
    ]


def get_habit_streak(db: Session, habit_id: int, user_id: int) -> StreakResponse:
    """Get streak data for a specific habit.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.

    Returns:
        StreakResponse object.
    """
    result = (
        db.query(Streak, Habit.name)
        .join(Habit, Streak.habit_id == Habit.id)
        .filter(Streak.habit_id == habit_id, Streak.user_id == user_id)
        .first()
    )

    if not result:
        # Return empty streak if none exists
        habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
        habit_name = habit.name if habit else "Unknown"
        return StreakResponse(
            habit_id=habit_id,
            habit_name=habit_name,
            current_streak=0,
            longest_streak=0,
            last_completed_at=None,
        )

    streak, habit_name = result
    return StreakResponse(
        habit_id=streak.habit_id,
        habit_name=habit_name,
        current_streak=streak.current_streak,
        longest_streak=streak.longest_streak,
        last_completed_at=streak.last_completed_at,
    )


def get_habit_logs(
    db: Session,
    habit_id: int,
    user_id: int,
    start_date: date | None = None,
    end_date: date | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[HabitLog]:
    """Get completion logs for a specific habit.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.
        start_date: Optional start date filter.
        end_date: Optional end date filter.
        limit: Maximum number of results.
        offset: Number of results to skip.

    Returns:
        List of HabitLog objects.
    """
    query = db.query(HabitLog).filter(
        HabitLog.habit_id == habit_id,
        HabitLog.user_id == user_id,
    )

    if start_date:
        query = query.filter(HabitLog.completed_at >= start_date)
    if end_date:
        query = query.filter(HabitLog.completed_at <= end_date)

    return (
        query.order_by(HabitLog.completed_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_heatmap_data(db: Session, user_id: int, year: int) -> list[HeatmapEntry]:
    """Get heatmap data for a user for a given year.

    Groups habit_logs by date and counts completions per day.

    Args:
        db: Database session.
        user_id: ID of the user.
        year: Year to get data for.

    Returns:
        List of HeatmapEntry objects.
    """
    start = date(year, 1, 1)
    end = date(year, 12, 31)

    results = (
        db.query(
            HabitLog.completed_at,
            func.count(HabitLog.id).label("count"),
        )
        .filter(
            HabitLog.user_id == user_id,
            HabitLog.completed_at >= start,
            HabitLog.completed_at <= end,
        )
        .group_by(HabitLog.completed_at)
        .order_by(HabitLog.completed_at)
        .all()
    )

    return [
        HeatmapEntry(date=str(row.completed_at), count=row.count)
        for row in results
    ]


def get_completion_rate(
    db: Session, user_id: int, period: str = "week"
) -> CompletionRateResponse:
    """Calculate completion rate for a user over a given period.

    Args:
        db: Database session.
        user_id: ID of the user.
        period: Time period - "week", "month", or "year".

    Returns:
        CompletionRateResponse with rate calculation.
    """
    today = date.today()

    if period == "week":
        days = 7
        start_date = today - timedelta(days=6)
    elif period == "month":
        days = 30
        start_date = today - timedelta(days=29)
    elif period == "year":
        days = 365
        start_date = today - timedelta(days=364)
    else:
        days = 7
        start_date = today - timedelta(days=6)

    active_habits_count = (
        db.query(func.count(Habit.id))
        .filter(
            Habit.user_id == user_id,
            Habit.is_archived == False,  # noqa: E712
        )
        .scalar()
    ) or 0

    completed_count = (
        db.query(func.count(HabitLog.id))
        .filter(
            HabitLog.user_id == user_id,
            HabitLog.completed_at >= start_date,
            HabitLog.completed_at <= today,
        )
        .scalar()
    ) or 0

    total_possible = active_habits_count * days
    rate = (completed_count / total_possible * 100) if total_possible > 0 else 0.0

    return CompletionRateResponse(
        period=period,
        rate=round(rate, 1),
        completed=completed_count,
        total=total_possible,
    )
