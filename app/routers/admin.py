# app/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List
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
    """Получить полную статистику подопечного"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    # Проверяем, что это действительно наш подопечный
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Подопечный не найден")
    
    # Получаем кошелёк
    wallet = db.query(XPWallet).filter(XPWallet.user_id == child_id).first()
    if not wallet:
        wallet = XPWallet(user_id=child_id, balance=0.0, level=1, total_earned=0.0, total_spent=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    
    # Получаем streak
    streak = db.query(Streak).filter(Streak.user_id == child_id).first()
    if not streak:
        streak = Streak(user_id=child_id, current_streak=0, longest_streak=0)
    
    # Статистика за сегодня
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    today_earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.end_time >= today_start,
        ActivityLog.end_time <= today_end
    ).scalar() or 0
    
    today_time = db.query(func.sum(ActivityLog.duration_minutes)).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.end_time >= today_start,
        ActivityLog.end_time <= today_end
    ).scalar() or 0
    
    # Статистика за неделю
    week_ago = today - timedelta(days=7)
    week_earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.end_time >= week_ago
    ).scalar() or 0
    
    # Количество активностей
    activities_count = db.query(Activity).filter(Activity.user_id == child_id).count()
    
    return {
        "user_id": child.id,
        "username": child.username,
        "email": child.email,
        "balance": wallet.balance,
        "level": wallet.level,
        "total_earned": wallet.total_earned,
        "total_spent": wallet.total_spent,
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak,
        "total_days_active": streak.total_days_active,
        "activities_count": activities_count,
        "today_earned": today_earned,
        "today_time": today_time,
        "week_earned": week_earned
    }


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
    
    # История заработков
    earnings = db.query(ActivityLog).filter(
        ActivityLog.user_id == child_id,
        ActivityLog.xp_earned > 0
    ).order_by(ActivityLog.end_time.desc()).limit(limit).all()
    
    # История расходов
    spendings = db.query(RewardPurchase).filter(
        RewardPurchase.user_id == child_id
    ).order_by(RewardPurchase.purchased_at.desc()).limit(limit).all()
    
    history = []
    
    for log in earnings:
        if log.end_time:
            history.append({
                "type": "earn",
                "description": log.activity.name,
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список активностей подопечного"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Подопечный не найден")
    
    activities = db.query(Activity).filter(Activity.user_id == child_id).all()
    
    return [
        {
            "id": act.id,
            "name": act.name,
            "xp_per_hour": act.xp_per_hour
        }
        for act in activities
    ]


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
    
    from app.routers.goals import update_goal_progress
    from app.models.base import Goal, Activity
    
    goals = db.query(Goal).filter(Goal.user_id == child_id).order_by(Goal.created_at.desc()).all()
    
    result = []
    for goal in goals:
        update_goal_progress(db, goal)
        
        activity_name = None
        if goal.activity_id:
            activity = db.query(Activity).filter(Activity.id == goal.activity_id).first()
            activity_name = activity.name if activity else None
        
        progress_percent = (goal.current_xp / goal.target_xp * 100) if goal.target_xp > 0 else 0
        
        result.append({
            "id": goal.id,
            "title": goal.title,
            "description": goal.description,
            "target_xp": goal.target_xp,
            "current_xp": goal.current_xp,
            "progress_percent": min(progress_percent, 100),
            "is_completed": goal.is_completed,
            "target_date": goal.target_date.isoformat() if goal.target_date else None,
            "activity_name": activity_name,
            "created_at": goal.created_at.isoformat()
        })
    
    return result


@router.get("/invite-code")
async def get_invite_code(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить или создать код приглашения"""
    if not check_admin(current_user):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    # Если код уже есть, возвращаем его
    if current_user.invite_code:
        return {
            "invite_code": current_user.invite_code,
            "invite_link": f"/register?invite={current_user.invite_code}"
        }
    
    # Генерируем новый код
    import secrets
    invite_code = secrets.token_urlsafe(16)[:16]  # 16 символов
    
    current_user.invite_code = invite_code
    db.commit()
    
    return {
        "invite_code": invite_code,
        "invite_link": f"/register?invite={invite_code}"
    }

