# app/routers/streak.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, date
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import Streak, ActivityLog, XPWallet, User

router = APIRouter(prefix="/streak", tags=["streak"])


def get_or_create_streak(db: Session, user_id: int) -> Streak:
    """Получить или создать streak для пользователя"""
    streak = db.query(Streak).filter(Streak.user_id == user_id).first()
    if not streak:
        streak = Streak(user_id=user_id, current_streak=0, longest_streak=0)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    return streak


def update_streak(db: Session, user_id: int) -> dict:
    """Обновить streak на основе активности за сегодня"""
    streak = get_or_create_streak(db, user_id)
    today = date.today()
    
    # Проверяем, была ли активность сегодня
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    activity_today = db.query(ActivityLog).filter(
        ActivityLog.user_id == user_id,
        ActivityLog.end_time >= today_start,
        ActivityLog.end_time <= today_end,
        ActivityLog.xp_earned > 0
    ).first()
    
    if not activity_today:
        return {
            "current_streak": streak.current_streak,
            "longest_streak": streak.longest_streak,
            "bonus_xp": 0,
            "message": "Нет активности сегодня"
        }
    
    # Проверяем последний день активности
    last_date = streak.last_activity_date.date() if streak.last_activity_date else None
    
    bonus_xp = 0
    if last_date:
        days_diff = (today - last_date).days
        
        if days_diff == 0:
            # Уже засчитано сегодня
            return {
                "current_streak": streak.current_streak,
                "longest_streak": streak.longest_streak,
                "bonus_xp": 0,
                "message": "Уже засчитано сегодня"
            }
        elif days_diff == 1:
            # Продолжаем серию
            streak.current_streak += 1
        else:
            # Серия прервана
            streak.current_streak = 1
    else:
        # Первая активность
        streak.current_streak = 1
    
    # Обновляем самую длинную серию
    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak
    
    # Вычисляем бонус XP
    if streak.current_streak >= 30:
        bonus_xp = 100  # Месяц без пропусков
    elif streak.current_streak >= 7:
        bonus_xp = 20  # Неделя подряд
    elif streak.current_streak >= 3:
        bonus_xp = 10  # 3 дня подряд
    else:
        bonus_xp = streak.current_streak * 2  # Базовый бонус
    
    # Начисляем бонус
    if bonus_xp > 0:
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user_id).first()
        if wallet:
            wallet.balance += bonus_xp
            wallet.total_earned += bonus_xp
    
    streak.last_activity_date = datetime.now()
    streak.total_days_active += 1
    db.commit()
    db.refresh(streak)
    
    return {
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak,
        "bonus_xp": bonus_xp,
        "total_days_active": streak.total_days_active,
        "message": f"🔥 Серия: {streak.current_streak} дней подряд!"
    }


@router.get("/")
async def get_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить текущий streak"""
    streak = get_or_create_streak(db, current_user.id)
    
    # Проверяем, нужно ли обновить streak
    today = date.today()
    last_date = streak.last_activity_date.date() if streak.last_activity_date else None
    
    if last_date and (today - last_date).days > 1:
        # Серия прервана
        streak.current_streak = 0
    
    return {
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak,
        "total_days_active": streak.total_days_active,
        "last_activity_date": streak.last_activity_date.isoformat() if streak.last_activity_date else None
    }


@router.post("/update")
async def update_streak_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить streak (вызывается после завершения активности)"""
    return update_streak(db, current_user.id)


