"""Habits router with CRUD and completion endpoints."""

import logging
from datetime import date

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.database import get_db
from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.models.user import User
from app.schemas.habit import HabitCreate, HabitResponse, HabitUpdate, StreakInfo
from app.schemas.streak import HabitLogResponse
from app.services import habit_service

logger = logging.getLogger(__name__)

router = APIRouter()


def _enrich_habit(habit: Habit, db: Session) -> HabitResponse:
    """Build HabitResponse with streak_info and completed_today."""
    today = date.today()

    completed_today = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit.id, HabitLog.completed_at == today)
        .first()
        is not None
    )

    streak_info = None
    if habit.streak:
        streak_info = StreakInfo(
            current_streak=habit.streak.current_streak,
            longest_streak=habit.streak.longest_streak,
            last_completed_at=habit.streak.last_completed_at,
        )

    resp = HabitResponse.model_validate(habit)
    resp.completed_today = completed_today
    resp.streak_info = streak_info
    return resp


@router.get("/", response_model=list[HabitResponse])
async def list_habits(
    include_archived: bool = Query(False),
    category: str | None = Query(None),
    frequency: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[HabitResponse]:
    """List all habits for the current user."""
    habits = habit_service.get_habits(
        db, current_user.id, include_archived, category, frequency
    )
    return [_enrich_habit(h, db) for h in habits]


@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    data: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> HabitResponse:
    """Create a new habit."""
    habit = habit_service.create_habit(db, current_user.id, data)
    return _enrich_habit(habit, db)


@router.get("/{habit_id}", response_model=HabitResponse)
async def get_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> HabitResponse:
    """Get a habit by ID."""
    habit = habit_service.get_habit(db, habit_id, current_user.id)
    return _enrich_habit(habit, db)


@router.put("/{habit_id}", response_model=HabitResponse)
async def update_habit(
    habit_id: int,
    data: HabitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> HabitResponse:
    """Update an existing habit."""
    habit = habit_service.update_habit(db, habit_id, current_user.id, data)
    return _enrich_habit(habit, db)


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete a habit."""
    habit_service.delete_habit(db, habit_id, current_user.id)


@router.post("/{habit_id}/complete", response_model=HabitLogResponse, status_code=status.HTTP_201_CREATED)
async def complete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> HabitLogResponse:
    """Mark a habit as completed for today."""
    log = habit_service.complete_habit(db, habit_id, current_user.id)
    return HabitLogResponse.model_validate(log)


@router.post("/{habit_id}/uncomplete", status_code=status.HTTP_204_NO_CONTENT)
async def uncomplete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Remove today's completion for a habit."""
    habit_service.uncomplete_habit(db, habit_id, current_user.id)


@router.put("/{habit_id}/archive", response_model=HabitResponse)
async def archive_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> HabitResponse:
    """Archive a habit."""
    habit = habit_service.archive_habit(db, habit_id, current_user.id)
    return _enrich_habit(habit, db)


@router.put("/{habit_id}/unarchive", response_model=HabitResponse)
async def unarchive_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> HabitResponse:
    """Unarchive a habit."""
    habit = habit_service.unarchive_habit(db, habit_id, current_user.id)
    return _enrich_habit(habit, db)
