"""Pydantic schemas for admin operations."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AdminUserResponse(BaseModel):
    """Schema for admin user list/detail response."""

    id: int
    email: str
    full_name: str
    is_active: bool
    is_verified: bool
    is_admin: bool
    created_at: datetime
    habits_count: int

    model_config = ConfigDict(from_attributes=True)


class AdminStatsResponse(BaseModel):
    """Schema for platform-wide admin statistics."""

    total_users: int
    active_users_7d: int
    total_habits: int
    total_completions: int


class UserStatusUpdate(BaseModel):
    """Schema for updating user status (admin action)."""

    is_active: bool | None = None
    is_admin: bool | None = None
