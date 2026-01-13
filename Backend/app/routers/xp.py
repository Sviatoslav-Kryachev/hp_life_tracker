# app/routers/xp.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.base import User
from app.services.xp_service import XPService

router = APIRouter(prefix="/xp", tags=["xp"])


@router.get("/wallet")
async def get_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить кошелёк XP текущего пользователя"""
    return XPService.get_wallet(db, current_user.id)


@router.post("/earn")
async def earn_xp(
    activity_log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Начислить XP за активность"""
    return XPService.earn_xp(db, current_user.id, activity_log_id)


@router.get("/history")
async def get_xp_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Получить историю заработанного XP"""
    return XPService.get_xp_history(db, current_user.id, limit)


@router.get("/today")
async def get_today_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за сегодня"""
    return XPService.get_today_stats(db, current_user.id)


@router.get("/week")
async def get_week_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за неделю (для календаря)"""
    return XPService.get_week_stats(db, current_user.id)


@router.get("/month")
async def get_month_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за месяц (для календаря)"""
    return XPService.get_month_stats(db, current_user.id)


@router.get("/year")
async def get_year_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за год (для календаря)"""
    return XPService.get_year_stats(db, current_user.id)


@router.get("/day/{date}")
async def get_day_details(
    date: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Детальная информация по конкретному дню"""
    return XPService.get_day_details(db, current_user.id, date)


@router.get("/full-history")
async def get_full_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 50
):
    """Полная история доходов и расходов"""
    return XPService.get_full_history(db, current_user.id, limit)


@router.get("/category-stats")
async def get_category_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    period: str = "week"  # week, month, year
):
    """Получить статистику по категориям активностей"""
    return XPService.get_category_stats(db, current_user.id, period)
