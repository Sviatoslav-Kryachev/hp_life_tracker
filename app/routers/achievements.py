# app/routers/achievements.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from app.models.base import User, Achievement, XPWallet, Streak, Goal
from app.utils.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/achievements", tags=["achievements"])


# ============= SCHEMAS =============

class AchievementCreate(BaseModel):
    achievement_type: str
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None


class AchievementOut(BaseModel):
    id: int
    user_id: int
    username: str
    achievement_type: str
    title: str
    description: Optional[str]
    icon: Optional[str]
    earned_at: datetime
    is_shared: bool
    shared_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# ============= HELPER FUNCTIONS =============

def check_and_create_achievements(db: Session, user_id: int):
    """Проверяет условия и создает достижения автоматически"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return
    
    wallet = db.query(XPWallet).filter(XPWallet.user_id == user_id).first()
    streak = db.query(Streak).filter(Streak.user_id == user_id).first()
    
    # Проверяем существующие достижения
    existing_achievements = db.query(Achievement).filter(
        Achievement.user_id == user_id
    ).all()
    existing_types = {a.achievement_type for a in existing_achievements}
    
    achievements_to_create = []
    
    # Достижение: Первая активность
    if "first_activity" not in existing_types:
        # Проверяем, есть ли хотя бы одна активность
        from app.models.base import Activity
        activities = db.query(Activity).filter(Activity.user_id == user_id).count()
        if activities > 0:
            achievements_to_create.append({
                "achievement_type": "first_activity",
                "title": "Первая активность",
                "description": "Создана первая активность",
                "icon": "🎯"
            })
    
    # Достижение: Первый уровень
    if wallet and wallet.level >= 2 and "first_level" not in existing_types:
        achievements_to_create.append({
            "achievement_type": "first_level",
            "title": "Первый уровень",
            "description": "Достигнут уровень 2",
            "icon": "⭐"
        })
    
    # Достижение: Неделя подряд
    if streak and streak.current_streak >= 7 and "week_streak" not in existing_types:
        achievements_to_create.append({
            "achievement_type": "week_streak",
            "title": "Неделя подряд",
            "description": "7 дней активности подряд",
            "icon": "🔥"
        })
    
    # Достижение: Месяц подряд
    if streak and streak.current_streak >= 30 and "month_streak" not in existing_types:
        achievements_to_create.append({
            "achievement_type": "month_streak",
            "title": "Месяц подряд",
            "description": "30 дней активности подряд",
            "icon": "🏆"
        })
    
    # Достижение: 1000 XP
    if wallet and wallet.total_earned >= 1000 and "thousand_xp" not in existing_types:
        achievements_to_create.append({
            "achievement_type": "thousand_xp",
            "title": "1000 XP",
            "description": "Заработано 1000 XP",
            "icon": "💎"
        })
    
    # Достижение: Первая цель
    if "first_goal" not in existing_types:
        goals = db.query(Goal).filter(Goal.user_id == user_id).count()
        if goals > 0:
            achievements_to_create.append({
                "achievement_type": "first_goal",
                "title": "Первая цель",
                "description": "Создана первая цель",
                "icon": "🎯"
            })
    
    # Создаем достижения
    for ach_data in achievements_to_create:
        achievement = Achievement(
            user_id=user_id,
            **ach_data
        )
        db.add(achievement)
    
    if achievements_to_create:
        db.commit()


# ============= API ENDPOINTS =============

@router.get("/", response_model=List[AchievementOut])
async def get_my_achievements(
    shared_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список достижений пользователя"""
    # Проверяем и создаем новые достижения
    check_and_create_achievements(db, current_user.id)
    
    query = db.query(Achievement).filter(Achievement.user_id == current_user.id)
    
    if shared_only:
        query = query.filter(Achievement.is_shared == 1)
    
    achievements = query.order_by(Achievement.earned_at.desc()).all()
    
    result = []
    for ach in achievements:
        result.append(AchievementOut(
            id=ach.id,
            user_id=ach.user_id,
            username=current_user.username,
            achievement_type=ach.achievement_type,
            title=ach.title,
            description=ach.description,
            icon=ach.icon,
            earned_at=ach.earned_at,
            is_shared=bool(ach.is_shared),
            shared_at=ach.shared_at
        ))
    
    return result


@router.get("/group/{group_id}", response_model=List[AchievementOut])
async def get_group_achievements(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить общие достижения группы (только те, которыми поделились)"""
    # Проверяем, состоит ли пользователь в группе
    from app.models.base import GroupMember
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
    
    user_ids = [m.user_id for m in members]
    
    # Получаем все общие достижения участников группы
    achievements = db.query(Achievement).filter(
        and_(
            Achievement.user_id.in_(user_ids),
            Achievement.is_shared == 1
        )
    ).order_by(Achievement.shared_at.desc()).all()
    
    result = []
    for ach in achievements:
        user = db.query(User).filter(User.id == ach.user_id).first()
        if user:
            result.append(AchievementOut(
                id=ach.id,
                user_id=ach.user_id,
                username=user.username,
                achievement_type=ach.achievement_type,
                title=ach.title,
                description=ach.description,
                icon=ach.icon,
                earned_at=ach.earned_at,
                is_shared=bool(ach.is_shared),
                shared_at=ach.shared_at
            ))
    
    return result


@router.post("/", response_model=AchievementOut)
async def create_achievement(
    achievement_data: AchievementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать пользовательское достижение"""
    achievement = Achievement(
        user_id=current_user.id,
        achievement_type=achievement_data.achievement_type,
        title=achievement_data.title,
        description=achievement_data.description,
        icon=achievement_data.icon
    )
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    
    return AchievementOut(
        id=achievement.id,
        user_id=achievement.user_id,
        username=current_user.username,
        achievement_type=achievement.achievement_type,
        title=achievement.title,
        description=achievement.description,
        icon=achievement.icon,
        earned_at=achievement.earned_at,
        is_shared=bool(achievement.is_shared),
        shared_at=achievement.shared_at
    )


@router.post("/{achievement_id}/share")
async def share_achievement(
    achievement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Поделиться достижением (сделать видимым для группы)"""
    achievement = db.query(Achievement).filter(
        and_(
            Achievement.id == achievement_id,
            Achievement.user_id == current_user.id
        )
    ).first()
    
    if not achievement:
        raise HTTPException(status_code=404, detail="Достижение не найдено")
    
    achievement.is_shared = 1
    achievement.shared_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Достижение опубликовано"}


@router.post("/{achievement_id}/unshare")
async def unshare_achievement(
    achievement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Скрыть достижение (убрать из общих)"""
    achievement = db.query(Achievement).filter(
        and_(
            Achievement.id == achievement_id,
            Achievement.user_id == current_user.id
        )
    ).first()
    
    if not achievement:
        raise HTTPException(status_code=404, detail="Достижение не найдено")
    
    achievement.is_shared = 0
    achievement.shared_at = None
    db.commit()
    
    return {"message": "Достижение скрыто"}


@router.delete("/{achievement_id}")
async def delete_achievement(
    achievement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить достижение (только пользовательские)"""
    achievement = db.query(Achievement).filter(
        and_(
            Achievement.id == achievement_id,
            Achievement.user_id == current_user.id
        )
    ).first()
    
    if not achievement:
        raise HTTPException(status_code=404, detail="Достижение не найдено")
    
    # Можно удалять только пользовательские достижения (не автоматические)
    if achievement.achievement_type.startswith("custom_"):
        db.delete(achievement)
        db.commit()
        return {"message": "Достижение удалено"}
    else:
        raise HTTPException(status_code=400, detail="Автоматические достижения нельзя удалить")
