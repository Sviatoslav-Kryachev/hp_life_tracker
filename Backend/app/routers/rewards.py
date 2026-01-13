# app/routers/rewards.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.base import User
from app.schemas import RewardCreate, RewardOut
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.reward_service import RewardService

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.get("/", response_model=list[RewardOut])
async def get_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все награды (и общие, и пользователя)"""
    return RewardService.get_rewards(db, current_user.id)


@router.post("/", response_model=RewardOut)
async def create_reward(
    reward: RewardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новую награду"""
    return RewardService.create_reward(db, current_user.id, reward)


@router.put("/{reward_id}", response_model=RewardOut)
async def update_reward(
    reward_id: int,
    reward_data: RewardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить награду"""
    return RewardService.update_reward(db, current_user.id, reward_id, reward_data)


@router.delete("/{reward_id}")
async def delete_reward(
    reward_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить награду"""
    return RewardService.delete_reward(db, current_user.id, reward_id)


@router.post("/spend/{reward_id}")
async def spend_reward(
    reward_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Потратить XP на награду"""
    return RewardService.spend_reward(db, current_user.id, reward_id)


@router.get("/purchases")
async def get_purchase_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Получить историю покупок наград"""
    return RewardService.get_purchase_history(db, current_user.id, limit)
