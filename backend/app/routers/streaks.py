"""Streaks and statistics router."""

import logging
from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.database import get_db
from app.models.user import User
from app.schemas.streak import (
    CompletionRateResponse,
    HabitLogResponse,
    HeatmapEntry,
    StreakResponse,
)
from app.services import streak_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/streaks", response_model=list[StreakResponse])
async def get_all_streaks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[StreakResponse]:
    """Get all streaks for the current user."""
    return streak_service.get_all_streaks(db, current_user.id)


@router.get("/habits/{habit_id}/logs", response_model=list[HabitLogResponse])
async def get_habit_logs(
    habit_id: int,
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[HabitLogResponse]:
    """Get completion logs for a specific habit."""
    logs = streak_service.get_habit_logs(
        db, habit_id, current_user.id, start_date, end_date, limit, offset
    )
    return [HabitLogResponse.model_validate(log) for log in logs]


@router.get("/habits/{habit_id}/streak", response_model=StreakResponse)
async def get_habit_streak(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> StreakResponse:
    """Get streak info for a specific habit."""
    return streak_service.get_habit_streak(db, habit_id, current_user.id)


@router.get("/stats/heatmap", response_model=list[HeatmapEntry])
async def get_heatmap(
    year: int = Query(default=2026),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[HeatmapEntry]:
    """Get heatmap data for a given year."""
    return streak_service.get_heatmap_data(db, current_user.id, year)


@router.get("/stats/completion-rate", response_model=CompletionRateResponse)
async def get_completion_rate(
    period: str = Query("week"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> CompletionRateResponse:
    """Get overall completion rate for a period."""
    return streak_service.get_completion_rate(db, current_user.id, period)
