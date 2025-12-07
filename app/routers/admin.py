# app/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

from app.models.base import User, XPWallet, ActivityLog, RewardPurchase, Streak, Activity
from app.utils.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


class ChildStats(BaseModel):
    user_id: int
    username: str
    email: str
    balance: float
    level: int
    total_earned: float
    total_spent: float
    current_streak: int
    longest_streak: int
    total_days_active: int
    activities_count: int
    today_earned: float
    today_time: float
    week_earned: float
    
    class Config:
        from_attributes = True


def check_admin(current_user: User) -> bool:
    """Проверка, является ли пользователь администратором"""
    return current_user.is_admin == 1 or current_user.parent_id is None


@router.get("/children")
async def get_children(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список подопечных (детей)"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён. Только администраторы могут просматривать подопечных.")
    
    # Получаем всех пользователей, у которых current_user является родителем
    children = db.query(User).filter(User.parent_id == current_user.id).all()
    
    return [{"id": child.id, "username": child.username, "email": child.email} for child in children]


@router.get("/child/{child_id}/stats")
async def get_child_stats(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить статистику подопечного"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Подопечный не найден")
    
    wallet = db.query(XPWallet).filter(XPWallet.user_id == child_id).first()
    if not wallet:
        wallet = XPWallet(user_id=child_id, balance=0.0, level=1, total_earned=0.0, total_spent=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    
    streak = db.query(Streak).filter(Streak.user_id == child_id).first()
    if not streak:
        streak = Streak(user_id=child_id, current_streak=0, longest_streak=0, total_days_active=0)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    
    activities_count = db.query(Activity).filter(Activity.user_id == child_id).count()
    
    # Статистика за сегодня
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_logs = db.query(ActivityLog).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.end_time >= today_start,
        ActivityLog.xp_earned > 0
    ).all()
    
    today_earned = sum(log.xp_earned for log in today_logs)
    today_time = sum(log.duration_minutes or 0 for log in today_logs)
    
    # Статистика за неделю
    week_start = datetime.utcnow() - timedelta(days=7)
    week_logs = db.query(ActivityLog).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.end_time >= week_start,
        ActivityLog.xp_earned > 0
    ).all()
    
    week_earned = sum(log.xp_earned for log in week_logs)
    
    return ChildStats(
        user_id=child.id,
        username=child.username,
        email=child.email,
        balance=wallet.balance,
        level=wallet.level,
        total_earned=wallet.total_earned,
        total_spent=wallet.total_spent,
        current_streak=streak.current_streak,
        longest_streak=streak.longest_streak,
        total_days_active=streak.total_days_active,
        activities_count=activities_count,
        today_earned=today_earned,
        today_time=today_time,
        week_earned=week_earned
    )


@router.get("/child/{child_id}/history")
async def get_child_history(
    child_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить историю активности подопечного"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Подопечный не найден")
    
    # Получаем логи активностей
    logs = db.query(ActivityLog).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.end_time.isnot(None),
        ActivityLog.xp_earned > 0
    ).order_by(ActivityLog.end_time.desc()).limit(limit).all()
    
    # Получаем покупки наград
    spendings = db.query(RewardPurchase).filter(
        RewardPurchase.user_id == child_id
    ).order_by(RewardPurchase.purchased_at.desc()).limit(limit).all()
    
    history = []
    
    for log in logs:
        activity = db.query(Activity).filter(Activity.id == log.activity_id).first()
        activity_name = activity.name if activity else "Неизвестная активность"
        
        history.append({
            "type": "earn",
            "description": activity_name,
            "amount": round(log.xp_earned, 1),
            "date": log.end_time.isoformat(),
            "duration_minutes": round(log.duration_minutes, 1)
        })
    
    for purchase in spendings:
        history.append({
            "type": "spend",
            "description": purchase.reward_name,
            "amount": round(purchase.xp_spent, 1),
            "date": purchase.purchased_at.isoformat(),
            "duration_minutes": None
        })
    
    history.sort(key=lambda x: x["date"], reverse=True)
    
    return history[:limit]


@router.get("/child/{child_id}/activities")
async def get_child_activities(
    child_id: int,
    category: Optional[str] = None,  # Фильтр по категории
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список активностей подопечного с возможностью фильтрации по категории"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Подопечный не найден")
    
    query = db.query(Activity).filter(Activity.user_id == child_id)
    
    # Фильтр по категории если указан
    if category:
        query = query.filter(Activity.category == category)
    
    activities = query.all()
    return activities


@router.get("/child/{child_id}/category-stats")
async def get_child_category_stats(
    child_id: int,
    period: str = "week",  # week, month, year
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить статистику по категориям для подопечного"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Подопечный не найден")
    
    # Определяем период
    now = datetime.utcnow()
    if period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    elif period == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=7)
    
    # Получаем логи активностей за период
    logs = db.query(ActivityLog).join(Activity).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.end_time >= start_date,
        ActivityLog.xp_earned > 0
    ).all()
    
    # Группируем по категориям
    category_stats = {}
    for log in logs:
        category = log.activity.category if log.activity.category else "general"
        if category not in category_stats:
            category_stats[category] = {
                "category": category,
                "total_xp": 0.0,
                "total_time": 0.0,  # в минутах
                "activity_count": 0
            }
        
        category_stats[category]["total_xp"] += log.xp_earned
        category_stats[category]["total_time"] += log.duration_minutes or 0
        category_stats[category]["activity_count"] += 1
    
    # Преобразуем в список и сортируем по XP
    result = list(category_stats.values())
    result.sort(key=lambda x: x["total_xp"], reverse=True)
    
    return {
        "period": period,
        "categories": result,
        "total_xp": sum(cat["total_xp"] for cat in result),
        "total_time": sum(cat["total_time"] for cat in result)
    }


@router.get("/child/{child_id}/goals")
async def get_child_goals(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список целей подопечного"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Подопечный не найден")
    
    from app.models.base import Goal
    goals = db.query(Goal).filter(Goal.user_id == child_id).all()
    return goals


@router.get("/invite-code")
async def get_invite_code(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить код приглашения текущего пользователя"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    if not current_user.invite_code:
        # Генерируем код если его нет
        import secrets
        current_user.invite_code = secrets.token_urlsafe(16)
        db.commit()
    
    return {"invite_code": current_user.invite_code}
