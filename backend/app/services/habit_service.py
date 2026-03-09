"""Service layer for habit CRUD and completion operations."""

import logging
from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.exceptions import ConflictError, NotFoundError
from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.models.streak import Streak
from app.schemas.habit import HabitCreate, HabitUpdate

logger = logging.getLogger(__name__)


def get_habits(
    db: Session,
    user_id: int,
    include_archived: bool = False,
    category: str | None = None,
    frequency: str | None = None,
) -> list[Habit]:
    """Get all habits for a user with optional filters.

    Args:
        db: Database session.
        user_id: ID of the user.
        include_archived: Whether to include archived habits.
        category: Filter by category.
        frequency: Filter by frequency.

    Returns:
        List of Habit objects.
    """
    query = db.query(Habit).filter(Habit.user_id == user_id)

    if not include_archived:
        query = query.filter(Habit.is_archived == False)  # noqa: E712

    if category:
        query = query.filter(Habit.category == category)

    if frequency:
        query = query.filter(Habit.frequency == frequency)

    return query.order_by(Habit.created_at.desc()).all()


def get_habit(db: Session, habit_id: int, user_id: int) -> Habit:
    """Get a single habit by ID, ensuring it belongs to the user.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.

    Returns:
        The Habit object.

    Raises:
        NotFoundError: If habit not found or belongs to another user.
    """
    habit = (
        db.query(Habit)
        .filter(Habit.id == habit_id, Habit.user_id == user_id)
        .first()
    )
    if not habit:
        raise NotFoundError("Habit not found")
    return habit


def create_habit(db: Session, user_id: int, data: HabitCreate) -> Habit:
    """Create a new habit for a user.

    Args:
        db: Database session.
        user_id: ID of the user.
        data: Habit creation data.

    Returns:
        The created Habit object.

    Raises:
        ConflictError: If a habit with the same name already exists for this user.
    """
    existing = (
        db.query(Habit)
        .filter(Habit.user_id == user_id, Habit.name == data.name)
        .first()
    )
    if existing:
        raise ConflictError("A habit with this name already exists")

    habit = Habit(
        user_id=user_id,
        name=data.name,
        description=data.description,
        frequency=data.frequency,
        category=data.category,
        color=data.color,
        icon=data.icon,
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    logger.info("Created habit '%s' for user %d", habit.name, user_id)
    return habit


def update_habit(
    db: Session, habit_id: int, user_id: int, data: HabitUpdate
) -> Habit:
    """Update an existing habit.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.
        data: Habit update data.

    Returns:
        The updated Habit object.

    Raises:
        NotFoundError: If habit not found.
        ConflictError: If updated name conflicts with existing habit.
    """
    habit = get_habit(db, habit_id, user_id)

    update_data = data.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] != habit.name:
        existing = (
            db.query(Habit)
            .filter(
                Habit.user_id == user_id,
                Habit.name == update_data["name"],
                Habit.id != habit_id,
            )
            .first()
        )
        if existing:
            raise ConflictError("A habit with this name already exists")

    for field, value in update_data.items():
        setattr(habit, field, value)

    db.commit()
    db.refresh(habit)
    logger.info("Updated habit %d for user %d", habit_id, user_id)
    return habit


def delete_habit(db: Session, habit_id: int, user_id: int) -> None:
    """Delete a habit.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.

    Raises:
        NotFoundError: If habit not found.
    """
    habit = get_habit(db, habit_id, user_id)
    db.delete(habit)
    db.commit()
    logger.info("Deleted habit %d for user %d", habit_id, user_id)


def complete_habit(
    db: Session, habit_id: int, user_id: int, note: str | None = None
) -> HabitLog:
    """Mark a habit as completed for today.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.
        note: Optional note for the completion.

    Returns:
        The created HabitLog entry.

    Raises:
        NotFoundError: If habit not found.
        ConflictError: If already completed today.
    """
    habit = get_habit(db, habit_id, user_id)
    today = date.today()

    existing_log = (
        db.query(HabitLog)
        .filter(
            HabitLog.habit_id == habit_id,
            HabitLog.completed_at == today,
        )
        .first()
    )
    if existing_log:
        raise ConflictError("Habit already completed today")

    habit_log = HabitLog(
        habit_id=habit_id,
        user_id=user_id,
        completed_at=today,
        note=note,
    )
    db.add(habit_log)

    # Update or create streak
    streak = db.query(Streak).filter(Streak.habit_id == habit_id).first()
    if not streak:
        streak = Streak(
            habit_id=habit_id,
            user_id=user_id,
            current_streak=0,
            longest_streak=0,
        )
        db.add(streak)

    yesterday = today - timedelta(days=1)
    if streak.last_completed_at == yesterday:
        streak.current_streak += 1
    elif streak.last_completed_at is None or streak.last_completed_at < yesterday:
        streak.current_streak = 1

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    streak.last_completed_at = today

    db.commit()
    db.refresh(habit_log)
    logger.info("Completed habit %d for user %d on %s", habit_id, user_id, today)
    return habit_log


def uncomplete_habit(db: Session, habit_id: int, user_id: int) -> None:
    """Remove today's completion for a habit and recalculate streak.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.

    Raises:
        NotFoundError: If habit not found or no completion today.
    """
    habit = get_habit(db, habit_id, user_id)
    today = date.today()

    log = (
        db.query(HabitLog)
        .filter(
            HabitLog.habit_id == habit_id,
            HabitLog.completed_at == today,
        )
        .first()
    )
    if not log:
        raise NotFoundError("No completion found for today")

    db.delete(log)

    # Recalculate streak from remaining logs
    streak = db.query(Streak).filter(Streak.habit_id == habit_id).first()
    if streak:
        remaining_logs = (
            db.query(HabitLog)
            .filter(HabitLog.habit_id == habit_id)
            .order_by(HabitLog.completed_at.desc())
            .all()
        )

        if not remaining_logs:
            streak.current_streak = 0
            streak.last_completed_at = None
        else:
            streak.last_completed_at = remaining_logs[0].completed_at
            current = 1
            for i in range(len(remaining_logs) - 1):
                diff = remaining_logs[i].completed_at - remaining_logs[i + 1].completed_at
                if diff.days == 1:
                    current += 1
                else:
                    break
            streak.current_streak = current

    db.commit()
    logger.info("Uncompleted habit %d for user %d on %s", habit_id, user_id, today)


def archive_habit(db: Session, habit_id: int, user_id: int) -> Habit:
    """Archive a habit.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.

    Returns:
        The archived Habit object.
    """
    habit = get_habit(db, habit_id, user_id)
    habit.is_archived = True
    db.commit()
    db.refresh(habit)
    logger.info("Archived habit %d for user %d", habit_id, user_id)
    return habit


def unarchive_habit(db: Session, habit_id: int, user_id: int) -> Habit:
    """Unarchive a habit.

    Args:
        db: Database session.
        habit_id: ID of the habit.
        user_id: ID of the user.

    Returns:
        The unarchived Habit object.
    """
    habit = get_habit(db, habit_id, user_id)
    habit.is_archived = False
    db.commit()
    db.refresh(habit)
    logger.info("Unarchived habit %d for user %d", habit_id, user_id)
    return habit
