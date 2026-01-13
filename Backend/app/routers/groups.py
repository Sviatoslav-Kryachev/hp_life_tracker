# app/routers/groups.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
import secrets
import string

from app.models.base import User, Group, GroupMember, XPWallet, Streak, ActivityLog
from app.utils.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/groups", tags=["groups"])


# ============= SCHEMAS =============

class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None


class GroupOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    invite_code: str
    created_by: int
    created_at: datetime
    member_count: int
    my_role: str
    
    class Config:
        from_attributes = True


class GroupMemberOut(BaseModel):
    id: int
    user_id: int
    username: str
    email: str
    role: str
    joined_at: datetime
    balance: float
    level: int
    current_streak: int
    total_earned: float
    
    class Config:
        from_attributes = True


class GroupJoin(BaseModel):
    invite_code: str


# ============= HELPER FUNCTIONS =============

def generate_invite_code(length: int = 8) -> str:
    """Генерирует уникальный код приглашения"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))


# ============= API ENDPOINTS =============

@router.post("/", response_model=GroupOut)
async def create_group(
    group_data: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новую группу"""
    # Генерируем уникальный код приглашения
    invite_code = generate_invite_code()
    while db.query(Group).filter(Group.invite_code == invite_code).first():
        invite_code = generate_invite_code()
    
    # Создаем группу
    group = Group(
        name=group_data.name,
        description=group_data.description,
        invite_code=invite_code,
        created_by=current_user.id
    )
    db.add(group)
    db.flush()
    
    # Добавляем создателя как владельца
    member = GroupMember(
        group_id=group.id,
        user_id=current_user.id,
        role="owner"
    )
    db.add(member)
    db.commit()
    db.refresh(group)
    
    # Получаем количество участников
    member_count = db.query(GroupMember).filter(
        and_(
            GroupMember.group_id == group.id,
            GroupMember.is_active == 1
        )
    ).count()
    
    return GroupOut(
        id=group.id,
        name=group.name,
        description=group.description,
        invite_code=group.invite_code,
        created_by=group.created_by,
        created_at=group.created_at,
        member_count=member_count,
        my_role="owner"
    )


@router.post("/join", response_model=GroupOut)
async def join_group(
    join_data: GroupJoin,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Присоединиться к группе по коду приглашения"""
    # Находим группу
    group = db.query(Group).filter(
        and_(
            Group.invite_code == join_data.invite_code,
            Group.is_active == 1
        )
    ).first()
    
    if not group:
        raise HTTPException(status_code=404, detail="Группа не найдена или неактивна")
    
    # Проверяем, не состоит ли уже пользователь в группе
    existing_member = db.query(GroupMember).filter(
        and_(
            GroupMember.group_id == group.id,
            GroupMember.user_id == current_user.id,
            GroupMember.is_active == 1
        )
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="Вы уже состоите в этой группе")
    
    # Добавляем пользователя в группу
    member = GroupMember(
        group_id=group.id,
        user_id=current_user.id,
        role="member"
    )
    db.add(member)
    db.commit()
    db.refresh(group)
    
    # Получаем количество участников
    member_count = db.query(GroupMember).filter(
        and_(
            GroupMember.group_id == group.id,
            GroupMember.is_active == 1
        )
    ).count()
    
    return GroupOut(
        id=group.id,
        name=group.name,
        description=group.description,
        invite_code=group.invite_code,
        created_by=group.created_by,
        created_at=group.created_at,
        member_count=member_count,
        my_role="member"
    )


@router.get("/", response_model=List[GroupOut])
async def get_my_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список групп, в которых состоит пользователь"""
    # Находим все группы пользователя
    memberships = db.query(GroupMember).filter(
        and_(
            GroupMember.user_id == current_user.id,
            GroupMember.is_active == 1
        )
    ).all()
    
    groups = []
    for membership in memberships:
        group = db.query(Group).filter(
            and_(
                Group.id == membership.group_id,
                Group.is_active == 1
            )
        ).first()
        
        if group:
            # Получаем количество участников
            member_count = db.query(GroupMember).filter(
                and_(
                    GroupMember.group_id == group.id,
                    GroupMember.is_active == 1
                )
            ).count()
            
            groups.append(GroupOut(
                id=group.id,
                name=group.name,
                description=group.description,
                invite_code=group.invite_code,
                created_by=group.created_by,
                created_at=group.created_at,
                member_count=member_count,
                my_role=membership.role
            ))
    
    return groups


@router.get("/{group_id}/members", response_model=List[GroupMemberOut])
async def get_group_members(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список участников группы"""
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
    
    result = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        if not user:
            continue
        
        # Получаем статистику пользователя
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
        streak = db.query(Streak).filter(Streak.user_id == user.id).first()
        
        result.append(GroupMemberOut(
            id=member.id,
            user_id=user.id,
            username=user.username,
            email=user.email,
            role=member.role,
            joined_at=member.joined_at,
            balance=wallet.balance if wallet else 0.0,
            level=wallet.level if wallet else 1,
            current_streak=streak.current_streak if streak else 0,
            total_earned=wallet.total_earned if wallet else 0.0
        ))
    
    return result


@router.post("/{group_id}/leave")
async def leave_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Покинуть группу"""
    # Находим членство
    membership = db.query(GroupMember).filter(
        and_(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id,
            GroupMember.is_active == 1
        )
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Вы не состоите в этой группе")
    
    # Проверяем, не является ли пользователь владельцем
    if membership.role == "owner":
        # Проверяем, есть ли другие активные участники
        other_members = db.query(GroupMember).filter(
            and_(
                GroupMember.group_id == group_id,
                GroupMember.user_id != current_user.id,
                GroupMember.is_active == 1
            )
        ).count()
        
        if other_members > 0:
            raise HTTPException(
                status_code=400,
                detail="Владелец не может покинуть группу, пока в ней есть другие участники. Передайте права владельца или удалите группу."
            )
        else:
            # Если владелец один, удаляем группу
            group = db.query(Group).filter(Group.id == group_id).first()
            if group:
                group.is_active = 0
                db.commit()
            return {"message": "Группа удалена"}
    
    # Деактивируем членство
    membership.is_active = 0
    db.commit()
    
    return {"message": "Вы покинули группу"}


@router.delete("/{group_id}")
async def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить группу (только для владельца)"""
    # Проверяем, является ли пользователь владельцем
    membership = db.query(GroupMember).filter(
        and_(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id,
            GroupMember.role == "owner",
            GroupMember.is_active == 1
        )
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Только владелец может удалить группу")
    
    # Деактивируем группу
    group = db.query(Group).filter(Group.id == group_id).first()
    if group:
        group.is_active = 0
        db.commit()
    
    return {"message": "Группа удалена"}
