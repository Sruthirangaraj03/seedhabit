"""Service layer for dashboard data aggregation."""

import logging
from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.models.streak import Streak
from app.schemas.dashboard import (
    DashboardResponse,
    HistoryDayItem,
    HistoryHabitItem,
    HistoryResponse,
    StatsSection,
    StreakHighlight,
    StreaksSection,
    TodayHabitItem,
    TodaySection,
    WeeklySummaryDay,
    WeeklySummaryResponse,
)

logger = logging.getLogger(__name__)


def get_dashboard(db: Session, user_id: int) -> DashboardResponse:
    """Aggregate all dashboard data for a user.

    Args:
        db: Database session.
        user_id: ID of the user.

    Returns:
        DashboardResponse with today, streaks, and stats sections.
    """
    today = date.today()

    # --- Today section ---
    # Show daily habits every day, weekly habits only on the same weekday they were created
    all_active_habits = (
        db.query(Habit)
        .filter(Habit.user_id == user_id, Habit.is_archived == False)  # noqa: E712
        .all()
    )
    today_weekday = today.weekday()
    active_habits = [
        h
        for h in all_active_habits
        if h.frequency == "daily"
        or (h.frequency == "weekly" and h.created_at and h.created_at.weekday() == today_weekday)
    ]

    today_logs = (
        db.query(HabitLog.habit_id)
        .filter(
            HabitLog.user_id == user_id,
            HabitLog.completed_at == today,
        )
        .all()
    )
    completed_ids = {row.habit_id for row in today_logs}

    # Get streaks for all habits
    streaks_map: dict[int, int] = {}
    streaks_data = (
        db.query(Streak.habit_id, Streak.current_streak)
        .filter(Streak.user_id == user_id)
        .all()
    )
    for s in streaks_data:
        streaks_map[s.habit_id] = s.current_streak

    today_habits = [
        TodayHabitItem(
            id=h.id,
            name=h.name,
            color=h.color,
            icon=h.icon,
            completed=h.id in completed_ids,
            streak=streaks_map.get(h.id, 0),
        )
        for h in active_habits
    ]

    completed_count = sum(1 for h in today_habits if h.completed)
    total_count = len(today_habits)
    completion_rate = (
        round(completed_count / total_count * 100, 1) if total_count > 0 else 0.0
    )

    today_section = TodaySection(
        date=str(today),
        habits=today_habits,
        completed_count=completed_count,
        total_count=total_count,
        completion_rate=completion_rate,
    )

    # --- Streaks section ---
    best_current_row = (
        db.query(Streak, Habit.name)
        .join(Habit, Streak.habit_id == Habit.id)
        .filter(Streak.user_id == user_id, Streak.current_streak > 0)
        .order_by(Streak.current_streak.desc())
        .first()
    )
    best_current = None
    if best_current_row:
        streak_obj, habit_name = best_current_row
        best_current = StreakHighlight(
            habit_name=habit_name, streak=streak_obj.current_streak
        )

    best_ever_row = (
        db.query(Streak, Habit.name)
        .join(Habit, Streak.habit_id == Habit.id)
        .filter(Streak.user_id == user_id, Streak.longest_streak > 0)
        .order_by(Streak.longest_streak.desc())
        .first()
    )
    best_ever = None
    if best_ever_row:
        streak_obj, habit_name = best_ever_row
        best_ever = StreakHighlight(
            habit_name=habit_name, streak=streak_obj.longest_streak
        )

    streaks_section = StreaksSection(best_current=best_current, best_ever=best_ever)

    # --- Stats section ---
    total_habits = (
        db.query(func.count(Habit.id))
        .filter(Habit.user_id == user_id)
        .scalar()
    ) or 0

    active_count = len(active_habits)

    total_completions = (
        db.query(func.count(HabitLog.id))
        .filter(HabitLog.user_id == user_id)
        .scalar()
    ) or 0

    # Overall completion rate based on last 30 days
    thirty_days_ago = today - timedelta(days=29)
    recent_completions = (
        db.query(func.count(HabitLog.id))
        .filter(
            HabitLog.user_id == user_id,
            HabitLog.completed_at >= thirty_days_ago,
        )
        .scalar()
    ) or 0
    total_possible = active_count * 30
    overall_rate = (
        round(recent_completions / total_possible * 100, 1)
        if total_possible > 0
        else 0.0
    )

    stats_section = StatsSection(
        total_habits=total_habits,
        active_habits=active_count,
        total_completions=total_completions,
        overall_completion_rate=overall_rate,
    )

    return DashboardResponse(
        today=today_section,
        streaks=streaks_section,
        stats=stats_section,
    )


def get_weekly_summary(db: Session, user_id: int) -> WeeklySummaryResponse:
    """Get the last 7 days of completion data for a user.

    Args:
        db: Database session.
        user_id: ID of the user.

    Returns:
        WeeklySummaryResponse with daily completion data.
    """
    today = date.today()

    active_habits_count = (
        db.query(func.count(Habit.id))
        .filter(
            Habit.user_id == user_id,
            Habit.is_archived == False,  # noqa: E712
        )
        .scalar()
    ) or 0

    # Get completions grouped by date for the last 7 days
    start_date = today - timedelta(days=6)
    completions_by_date: dict[date, int] = {}

    results = (
        db.query(
            HabitLog.completed_at,
            func.count(HabitLog.id).label("count"),
        )
        .filter(
            HabitLog.user_id == user_id,
            HabitLog.completed_at >= start_date,
            HabitLog.completed_at <= today,
        )
        .group_by(HabitLog.completed_at)
        .all()
    )

    for row in results:
        completions_by_date[row.completed_at] = row.count

    days = []
    for i in range(7):
        d = start_date + timedelta(days=i)
        days.append(
            WeeklySummaryDay(
                date=str(d),
                completed=completions_by_date.get(d, 0),
                total=active_habits_count,
            )
        )

    return WeeklySummaryResponse(days=days)


def get_history(db: Session, user_id: int, days: int = 30) -> HistoryResponse:
    """Get completion history grouped by date.

    Args:
        db: Database session.
        user_id: ID of the user.
        days: Number of days of history to fetch.

    Returns:
        HistoryResponse with daily completion records.
    """
    today = date.today()
    start_date = today - timedelta(days=days - 1)

    logs = (
        db.query(HabitLog, Habit.name, Habit.color, Habit.icon, Habit.category)
        .join(Habit, HabitLog.habit_id == Habit.id)
        .filter(
            HabitLog.user_id == user_id,
            HabitLog.completed_at >= start_date,
            HabitLog.completed_at <= today,
        )
        .order_by(HabitLog.completed_at.desc(), Habit.name)
        .all()
    )

    # Group by date
    days_map: dict[date, list[HistoryHabitItem]] = {}
    for log, habit_name, habit_color, habit_icon, habit_category in logs:
        d = log.completed_at
        if d not in days_map:
            days_map[d] = []
        days_map[d].append(
            HistoryHabitItem(
                habit_id=log.habit_id,
                habit_name=habit_name,
                color=habit_color,
                icon=habit_icon,
                category=habit_category,
                note=log.note,
            )
        )

    history_days = [
        HistoryDayItem(
            date=str(d),
            habits=habits,
            count=len(habits),
        )
        for d, habits in sorted(days_map.items(), reverse=True)
    ]

    return HistoryResponse(days=history_days)
