# app/routers/blacklist.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import BlacklistReward, Reward, XPWallet, User

router = APIRouter(prefix="/blacklist", tags=["blacklist"])


class BlacklistCreate(BaseModel):
    reward_name_pattern: str
    is_active: bool = True


class BlacklistOut(BaseModel):
    id: int
    reward_name_pattern: str
    is_active: bool
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[BlacklistOut])
async def get_blacklist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить черный список наград"""
    blacklist = db.query(BlacklistReward).filter(
        BlacklistReward.user_id == current_user.id
    ).all()
    return blacklist


@router.post("/", response_model=BlacklistOut)
async def add_to_blacklist(
    blacklist_item: BlacklistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Добавить награду в черный список"""
    # Проверяем, нет ли уже такого паттерна
    existing = db.query(BlacklistReward).filter(
        BlacklistReward.user_id == current_user.id,
        BlacklistReward.reward_name_pattern == blacklist_item.reward_name_pattern
    ).first()
    
    if existing:
        existing.is_active = 1 if blacklist_item.is_active else 0
        db.commit()
        db.refresh(existing)
        return existing
    
    new_item = BlacklistReward(
        user_id=current_user.id,
        reward_name_pattern=blacklist_item.reward_name_pattern,
        is_active=1 if blacklist_item.is_active else 0
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.delete("/{blacklist_id}")
async def remove_from_blacklist(
    blacklist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить из черного списка"""
    item = db.query(BlacklistReward).filter(
        BlacklistReward.id == blacklist_id,
        BlacklistReward.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Элемент не найден")
    
    db.delete(item)
    db.commit()
    return {"message": "Удалено из черного списка"}


@router.post("/check/{reward_id}")
async def check_blacklist(
    reward_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Проверить, заблокирована ли награда"""
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Награда не найдена")
    
    # Проверяем черный список
    blacklist_items = db.query(BlacklistReward).filter(
        BlacklistReward.user_id == current_user.id,
        BlacklistReward.is_active == 1
    ).all()
    
    for item in blacklist_items:
        if item.reward_name_pattern.lower() in reward.name.lower():
            # Проверяем баланс XP
            wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
            if not wallet or wallet.balance < reward.xp_cost:
                return {
                    "blocked": True,
                    "message": f"⚠️ '{reward.name}' заблокирована! Нужно {reward.xp_cost} XP для доступа.",
                    "required_xp": reward.xp_cost,
                    "current_balance": wallet.balance if wallet else 0
                }
    
    return {
        "blocked": False,
        "message": "Доступ разрешён"
    }








