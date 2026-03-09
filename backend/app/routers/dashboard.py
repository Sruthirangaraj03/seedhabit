"""Dashboard router for aggregated data."""

import logging

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_active_user
from app.database import get_db
from app.models.user import User
from app.schemas.dashboard import (
    DashboardResponse,
    HistoryResponse,
    StatsSection,
    WeeklySummaryResponse,
)
from app.services import dashboard_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> DashboardResponse:
    """Get the full dashboard summary."""
    return dashboard_service.get_dashboard(db, current_user.id)


@router.get("/dashboard/weekly", response_model=WeeklySummaryResponse)
async def get_weekly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> WeeklySummaryResponse:
    """Get the weekly completion summary."""
    return dashboard_service.get_weekly_summary(db, current_user.id)


@router.get("/dashboard/history", response_model=HistoryResponse)
async def get_history(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> HistoryResponse:
    """Get completion history grouped by date."""
    return dashboard_service.get_history(db, current_user.id, days)


@router.get("/stats/overview", response_model=StatsSection)
async def get_stats_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> StatsSection:
    """Get overall statistics."""
    dashboard = dashboard_service.get_dashboard(db, current_user.id)
    return dashboard.stats
