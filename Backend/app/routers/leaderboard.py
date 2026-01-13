# app/routers/leaderboard.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

from app.models.base import User, Group, GroupMember, XPWallet, Streak, ActivityLog
from app.utils.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


# ============= SCHEMAS =============

class LeaderboardEntry(BaseModel):
    user_id: int
    username: str
    rank: int
    balance: float
    level: int
    total_earned: float
    current_streak: int
    longest_streak: int
    today_xp: float
    week_xp: float
    month_xp: float
    
    class Config:
        from_attributes = True


# ============= HELPER FUNCTIONS =============

def get_user_stats(db: Session, user_id: int, period: str = "all") -> dict:
    """Получить статистику пользователя за период"""
    now = datetime.utcnow()
    
    if period == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        xp_earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            and_(
                ActivityLog.user_id == user_id,
                ActivityLog.start_time >= start_date
            )
        ).scalar() or 0.0
    elif period == "week":
        start_date = now - timedelta(days=7)
        xp_earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            and_(
                ActivityLog.user_id == user_id,
                ActivityLog.start_time >= start_date
            )
        ).scalar() or 0.0
    elif period == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        xp_earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            and_(
                ActivityLog.user_id == user_id,
                ActivityLog.start_time >= start_date
            )
        ).scalar() or 0.0
    else:  # all
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user_id).first()
        xp_earned = wallet.total_earned if wallet else 0.0
    
    return {"xp_earned": xp_earned}


# ============= API ENDPOINTS =============

@router.get("/group/{group_id}", response_model=List[LeaderboardEntry])
async def get_group_leaderboard(
    group_id: int,
    sort_by: str = "balance",  # balance, level, total_earned, streak, today_xp, week_xp, month_xp
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить лидерборд группы"""
    # Проверяем, состоит ли пользователь в группе
    membership = db.query(GroupMember).filter(
        and_(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id,
            GroupMember.is_active == 1
        )
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Вы не состоите в этой группе")
    
    # Получаем всех участников группы
    members = db.query(GroupMember).filter(
        and_(
            GroupMember.group_id == group_id,
            GroupMember.is_active == 1
        )
    ).all()
    
    leaderboard = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        if not user:
            continue
        
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
        streak = db.query(Streak).filter(Streak.user_id == user.id).first()
        
        # Получаем статистику за разные периоды
        today_stats = get_user_stats(db, user.id, "today")
        week_stats = get_user_stats(db, user.id, "week")
        month_stats = get_user_stats(db, user.id, "month")
        
        leaderboard.append({
            "user_id": user.id,
            "username": user.username,
            "balance": wallet.balance if wallet else 0.0,
            "level": wallet.level if wallet else 1,
            "total_earned": wallet.total_earned if wallet else 0.0,
            "current_streak": streak.current_streak if streak else 0,
            "longest_streak": streak.longest_streak if streak else 0,
            "today_xp": today_stats["xp_earned"],
            "week_xp": week_stats["xp_earned"],
            "month_xp": month_stats["xp_earned"]
        })
    
    # Сортируем по выбранному критерию
    sort_key_map = {
        "balance": "balance",
        "level": "level",
        "total_earned": "total_earned",
        "streak": "current_streak",
        "today_xp": "today_xp",
        "week_xp": "week_xp",
        "month_xp": "month_xp"
    }
    
    sort_key = sort_key_map.get(sort_by, "balance")
    leaderboard.sort(key=lambda x: x[sort_key], reverse=True)
    
    # Добавляем ранги
    result = []
    for idx, entry in enumerate(leaderboard, 1):
        result.append(LeaderboardEntry(
            user_id=entry["user_id"],
            username=entry["username"],
            rank=idx,
            balance=entry["balance"],
            level=entry["level"],
            total_earned=entry["total_earned"],
            current_streak=entry["current_streak"],
            longest_streak=entry["longest_streak"],
            today_xp=entry["today_xp"],
            week_xp=entry["week_xp"],
            month_xp=entry["month_xp"]
        ))
    
    return result


@router.get("/global", response_model=List[LeaderboardEntry])
async def get_global_leaderboard(
    sort_by: str = "total_earned",
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить глобальный лидерборд (топ пользователей)"""
    # Получаем всех пользователей с кошельками
    wallets = db.query(XPWallet).order_by(desc(XPWallet.total_earned)).limit(limit).all()
    
    leaderboard = []
    for wallet in wallets:
        user = db.query(User).filter(User.id == wallet.user_id).first()
        if not user:
            continue
        
        streak = db.query(Streak).filter(Streak.user_id == user.id).first()
        
        # Получаем статистику за разные периоды
        today_stats = get_user_stats(db, user.id, "today")
        week_stats = get_user_stats(db, user.id, "week")
        month_stats = get_user_stats(db, user.id, "month")
        
        leaderboard.append({
            "user_id": user.id,
            "username": user.username,
            "balance": wallet.balance,
            "level": wallet.level,
            "total_earned": wallet.total_earned,
            "current_streak": streak.current_streak if streak else 0,
            "longest_streak": streak.longest_streak if streak else 0,
            "today_xp": today_stats["xp_earned"],
            "week_xp": week_stats["xp_earned"],
            "month_xp": month_stats["xp_earned"]
        })
    
    # Сортируем по выбранному критерию
    sort_key_map = {
        "balance": "balance",
        "level": "level",
        "total_earned": "total_earned",
        "streak": "current_streak",
        "today_xp": "today_xp",
        "week_xp": "week_xp",
        "month_xp": "month_xp"
    }
    
    sort_key = sort_key_map.get(sort_by, "total_earned")
    leaderboard.sort(key=lambda x: x[sort_key], reverse=True)
    
    # Добавляем ранги
    result = []
    for idx, entry in enumerate(leaderboard, 1):
        result.append(LeaderboardEntry(
            user_id=entry["user_id"],
            username=entry["username"],
            rank=idx,
            balance=entry["balance"],
            level=entry["level"],
            total_earned=entry["total_earned"],
            current_streak=entry["current_streak"],
            longest_streak=entry["longest_streak"],
            today_xp=entry["today_xp"],
            week_xp=entry["week_xp"],
            month_xp=entry["month_xp"]
        ))
    
    return result
