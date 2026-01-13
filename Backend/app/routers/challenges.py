# app/routers/challenges.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

from app.models.base import (
    User, Group, GroupMember, Challenge, ChallengeParticipant,
    XPWallet, Streak, ActivityLog
)
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/challenges", tags=["challenges"])


# ============= SCHEMAS =============

class ChallengeCreate(BaseModel):
    group_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    target_xp: float
    challenge_type: str = "xp"  # xp, time, streak
    start_date: datetime
    end_date: datetime
    reward_xp: float = 0.0


class ChallengeOut(BaseModel):
    id: int
    group_id: Optional[int]
    created_by: int
    title: str
    description: Optional[str]
    target_xp: float
    challenge_type: str
    start_date: datetime
    end_date: datetime
    reward_xp: float
    is_active: int
    created_at: datetime
    participant_count: int
    my_progress: Optional[float] = None
    my_completed: Optional[bool] = False
    
    class Config:
        from_attributes = True


class ChallengeParticipantOut(BaseModel):
    id: int
    user_id: int
    username: str
    current_progress: float
    is_completed: bool
    completed_at: Optional[datetime]
    progress_percent: float
    
    class Config:
        from_attributes = True


# ============= HELPER FUNCTIONS =============

def update_challenge_progress(db: Session, challenge_id: int, user_id: int):
    """Обновить прогресс пользователя в челлендже"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge or challenge.is_active == 0:
        return
    
    participant = db.query(ChallengeParticipant).filter(
        and_(
            ChallengeParticipant.challenge_id == challenge_id,
            ChallengeParticipant.user_id == user_id
        )
    ).first()
    
    if not participant:
        return
    
    now = datetime.utcnow()
    if now < challenge.start_date or now > challenge.end_date:
        return
    
    # Вычисляем прогресс в зависимости от типа челленджа
    if challenge.challenge_type == "xp":
        # Суммируем XP за период челленджа
        xp_earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            and_(
                ActivityLog.user_id == user_id,
                ActivityLog.start_time >= challenge.start_date,
                ActivityLog.start_time <= challenge.end_date
            )
        ).scalar() or 0.0
        participant.current_progress = xp_earned
        
    elif challenge.challenge_type == "time":
        # Суммируем время за период челленджа
        time_minutes = db.query(func.sum(ActivityLog.duration_minutes)).filter(
            and_(
                ActivityLog.user_id == user_id,
                ActivityLog.start_time >= challenge.start_date,
                ActivityLog.start_time <= challenge.end_date
            )
        ).scalar() or 0.0
        participant.current_progress = time_minutes
        
    elif challenge.challenge_type == "streak":
        # Проверяем текущий streak
        streak = db.query(Streak).filter(Streak.user_id == user_id).first()
        if streak:
            # Считаем дни подряд в период челленджа
            days_in_challenge = (challenge.end_date - challenge.start_date).days + 1
            # Упрощенная логика: если streak активен и начался до или во время челленджа
            if streak.last_activity_date and streak.last_activity_date >= challenge.start_date:
                participant.current_progress = min(streak.current_streak, days_in_challenge)
    
    # Проверяем, выполнена ли цель
    if participant.current_progress >= challenge.target_xp and participant.is_completed == 0:
        participant.is_completed = 1
        participant.completed_at = now
        
        # Начисляем бонус XP
        if challenge.reward_xp > 0:
            wallet = db.query(XPWallet).filter(XPWallet.user_id == user_id).first()
            if wallet:
                wallet.balance += challenge.reward_xp
                wallet.total_earned += challenge.reward_xp
    
    db.commit()


# ============= API ENDPOINTS =============

@router.post("/", response_model=ChallengeOut)
async def create_challenge(
    challenge_data: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый челлендж"""
    # Проверяем даты
    if challenge_data.start_date >= challenge_data.end_date:
        raise HTTPException(status_code=400, detail="Дата начала должна быть раньше даты окончания")
    
    if challenge_data.end_date < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Дата окончания не может быть в прошлом")
    
    # Если указана группа, проверяем права
    if challenge_data.group_id:
        membership = db.query(GroupMember).filter(
            and_(
                GroupMember.group_id == challenge_data.group_id,
                GroupMember.user_id == current_user.id,
                GroupMember.is_active == 1
            )
        ).first()
        
        if not membership:
            raise HTTPException(status_code=403, detail="Вы не состоите в этой группе")
    
    # Создаем челлендж
    challenge = Challenge(
        group_id=challenge_data.group_id,
        created_by=current_user.id,
        title=challenge_data.title,
        description=challenge_data.description,
        target_xp=challenge_data.target_xp,
        challenge_type=challenge_data.challenge_type,
        start_date=challenge_data.start_date,
        end_date=challenge_data.end_date,
        reward_xp=challenge_data.reward_xp
    )
    db.add(challenge)
    db.flush()
    
    # Автоматически добавляем создателя как участника
    participant = ChallengeParticipant(
        challenge_id=challenge.id,
        user_id=current_user.id
    )
    db.add(participant)
    db.commit()
    db.refresh(challenge)
    
    # Если это групповой челлендж, добавляем всех участников группы
    if challenge_data.group_id:
        members = db.query(GroupMember).filter(
            and_(
                GroupMember.group_id == challenge_data.group_id,
                GroupMember.is_active == 1,
                GroupMember.user_id != current_user.id
            )
        ).all()
        
        for member in members:
            participant = ChallengeParticipant(
                challenge_id=challenge.id,
                user_id=member.user_id
            )
            db.add(participant)
        
        db.commit()
    
    # Получаем количество участников
    participant_count = db.query(ChallengeParticipant).filter(
        ChallengeParticipant.challenge_id == challenge.id
    ).count()
    
    return ChallengeOut(
        id=challenge.id,
        group_id=challenge.group_id,
        created_by=challenge.created_by,
        title=challenge.title,
        description=challenge.description,
        target_xp=challenge.target_xp,
        challenge_type=challenge.challenge_type,
        start_date=challenge.start_date,
        end_date=challenge.end_date,
        reward_xp=challenge.reward_xp,
        is_active=challenge.is_active,
        created_at=challenge.created_at,
        participant_count=participant_count,
        my_progress=0.0,
        my_completed=False
    )


@router.get("/", response_model=List[ChallengeOut])
async def get_my_challenges(
    group_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список челленджей пользователя"""
    # Находим все челленджи, в которых участвует пользователь
    participants = db.query(ChallengeParticipant).filter(
        ChallengeParticipant.user_id == current_user.id
    ).all()
    
    challenge_ids = [p.challenge_id for p in participants]
    
    if not challenge_ids:
        return []
    
    # Получаем челленджи
    query = db.query(Challenge).filter(Challenge.id.in_(challenge_ids))
    
    if group_id:
        query = query.filter(Challenge.group_id == group_id)
    
    challenges = query.filter(Challenge.is_active == 1).all()
    
    result = []
    for challenge in challenges:
        # Получаем прогресс пользователя
        participant = db.query(ChallengeParticipant).filter(
            and_(
                ChallengeParticipant.challenge_id == challenge.id,
                ChallengeParticipant.user_id == current_user.id
            )
        ).first()
        
        # Обновляем прогресс
        update_challenge_progress(db, challenge.id, current_user.id)
        db.refresh(participant)
        
        participant_count = db.query(ChallengeParticipant).filter(
            ChallengeParticipant.challenge_id == challenge.id
        ).count()
        
        result.append(ChallengeOut(
            id=challenge.id,
            group_id=challenge.group_id,
            created_by=challenge.created_by,
            title=challenge.title,
            description=challenge.description,
            target_xp=challenge.target_xp,
            challenge_type=challenge.challenge_type,
            start_date=challenge.start_date,
            end_date=challenge.end_date,
            reward_xp=challenge.reward_xp,
            is_active=challenge.is_active,
            created_at=challenge.created_at,
            participant_count=participant_count,
            my_progress=participant.current_progress if participant else 0.0,
            my_completed=bool(participant.is_completed) if participant else False
        ))
    
    return result


@router.get("/{challenge_id}/participants", response_model=List[ChallengeParticipantOut])
async def get_challenge_participants(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список участников челленджа с их прогрессом"""
    # Проверяем, участвует ли пользователь в челлендже
    participant = db.query(ChallengeParticipant).filter(
        and_(
            ChallengeParticipant.challenge_id == challenge_id,
            ChallengeParticipant.user_id == current_user.id
        )
    ).first()
    
    if not participant:
        raise HTTPException(status_code=403, detail="Вы не участвуете в этом челлендже")
    
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Челлендж не найден")
    
    # Получаем всех участников
    participants = db.query(ChallengeParticipant).filter(
        ChallengeParticipant.challenge_id == challenge_id
    ).all()
    
    result = []
    for p in participants:
        # Обновляем прогресс
        update_challenge_progress(db, challenge_id, p.user_id)
        db.refresh(p)
        
        user = db.query(User).filter(User.id == p.user_id).first()
        if not user:
            continue
        
        progress_percent = min(100.0, (p.current_progress / challenge.target_xp * 100) if challenge.target_xp > 0 else 0.0)
        
        result.append(ChallengeParticipantOut(
            id=p.id,
            user_id=user.id,
            username=user.username,
            current_progress=p.current_progress,
            is_completed=bool(p.is_completed),
            completed_at=p.completed_at,
            progress_percent=progress_percent
        ))
    
    # Сортируем по прогрессу
    result.sort(key=lambda x: x.current_progress, reverse=True)
    
    return result


@router.post("/{challenge_id}/join")
async def join_challenge(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Присоединиться к челленджу"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Челлендж не найден")
    
    if challenge.is_active == 0:
        raise HTTPException(status_code=400, detail="Челлендж неактивен")
    
    # Проверяем, не участвует ли уже
    existing = db.query(ChallengeParticipant).filter(
        and_(
            ChallengeParticipant.challenge_id == challenge_id,
            ChallengeParticipant.user_id == current_user.id
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Вы уже участвуете в этом челлендже")
    
    # Если это групповой челлендж, проверяем членство в группе
    if challenge.group_id:
        membership = db.query(GroupMember).filter(
            and_(
                GroupMember.group_id == challenge.group_id,
                GroupMember.user_id == current_user.id,
                GroupMember.is_active == 1
            )
        ).first()
        
        if not membership:
            raise HTTPException(status_code=403, detail="Вы не состоите в группе этого челленджа")
    
    # Добавляем участника
    participant = ChallengeParticipant(
        challenge_id=challenge_id,
        user_id=current_user.id
    )
    db.add(participant)
    db.commit()
    
    return {"message": "Вы присоединились к челленджу"}


@router.post("/{challenge_id}/update-progress")
async def update_my_progress(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить свой прогресс в челлендже (вызывается автоматически после активности)"""
    participant = db.query(ChallengeParticipant).filter(
        and_(
            ChallengeParticipant.challenge_id == challenge_id,
            ChallengeParticipant.user_id == current_user.id
        )
    ).first()
    
    if not participant:
        raise HTTPException(status_code=404, detail="Вы не участвуете в этом челлендже")
    
    update_challenge_progress(db, challenge_id, current_user.id)
    
    db.refresh(participant)
    
    return {
        "current_progress": participant.current_progress,
        "is_completed": bool(participant.is_completed)
    }
