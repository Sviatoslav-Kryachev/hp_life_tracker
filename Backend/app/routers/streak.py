# app/routers/streak.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.base import User
from app.services.streak_service import StreakService

router = APIRouter(prefix="/streak", tags=["streak"])


@router.get("/")
async def get_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить текущий streak"""
    return StreakService.get_streak(db, current_user.id)


@router.post("/update")
async def update_streak_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить streak (вызывается после завершения активности)"""
    return StreakService.update_streak(db, current_user.id)















