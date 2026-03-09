"""Admin router for platform management."""

import logging
from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.dependencies import get_admin_user
from app.database import get_db
from app.exceptions import NotFoundError
from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.models.user import User
from app.schemas.admin import AdminStatsResponse, AdminUserResponse, UserStatusUpdate

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/users", response_model=list[AdminUserResponse])
async def list_users(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> list[AdminUserResponse]:
    """List all users with pagination and optional search."""
    query = db.query(User)

    if search:
        query = query.filter(
            User.email.ilike(f"%{search}%") | User.full_name.ilike(f"%{search}%")
        )

    users = query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()

    result = []
    for user in users:
        habits_count = (
            db.query(func.count(Habit.id)).filter(Habit.user_id == user.id).scalar()
        ) or 0
        result.append(
            AdminUserResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                is_active=user.is_active,
                is_verified=user.is_verified,
                is_admin=user.is_admin,
                created_at=user.created_at,
                habits_count=habits_count,
            )
        )
    return result


@router.get("/users/{user_id}", response_model=AdminUserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> AdminUserResponse:
    """Get user details by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")

    habits_count = (
        db.query(func.count(Habit.id)).filter(Habit.user_id == user.id).scalar()
    ) or 0

    return AdminUserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        is_admin=user.is_admin,
        created_at=user.created_at,
        habits_count=habits_count,
    )


@router.put("/users/{user_id}", response_model=AdminUserResponse)
async def update_user_status(
    user_id: int,
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> AdminUserResponse:
    """Update user status (activate/deactivate, admin toggle)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    habits_count = (
        db.query(func.count(Habit.id)).filter(Habit.user_id == user.id).scalar()
    ) or 0

    logger.info("Admin updated user %d status: %s", user_id, update_data)
    return AdminUserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        is_admin=user.is_admin,
        created_at=user.created_at,
        habits_count=habits_count,
    )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> None:
    """Delete a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")

    db.delete(user)
    db.commit()
    logger.info("Admin deleted user %d", user_id)


@router.get("/stats", response_model=AdminStatsResponse)
async def get_platform_stats(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> AdminStatsResponse:
    """Get platform-wide statistics."""
    total_users = db.query(func.count(User.id)).scalar() or 0

    seven_days_ago = date.today() - timedelta(days=7)
    active_users_7d = (
        db.query(func.count(func.distinct(HabitLog.user_id)))
        .filter(HabitLog.completed_at >= seven_days_ago)
        .scalar()
    ) or 0

    total_habits = db.query(func.count(Habit.id)).scalar() or 0
    total_completions = db.query(func.count(HabitLog.id)).scalar() or 0

    return AdminStatsResponse(
        total_users=total_users,
        active_users_7d=active_users_7d,
        total_habits=total_habits,
        total_completions=total_completions,
    )
