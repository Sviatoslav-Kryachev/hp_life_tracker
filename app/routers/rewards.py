# app/routers/rewards.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.base import Reward, XPWallet, User, RewardPurchase
from app.schemas import RewardCreate, RewardOut
from app.utils.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.get("/", response_model=list[RewardOut])
async def get_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все награды (и общие, и пользователя)"""
    # Возвращаем награды пользователя + общие (user_id = None)
    rewards = db.query(Reward).filter(
        (Reward.user_id == current_user.id) | (Reward.user_id == None)
    ).all()
    return rewards


@router.post("/", response_model=RewardOut)
async def create_reward(
    reward: RewardCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новую награду"""
    new_reward = Reward(user_id=current_user.id, **reward.model_dump())
    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)
    return new_reward


@router.put("/{reward_id}", response_model=RewardOut)
async def update_reward(
    reward_id: int, 
    reward_data: RewardCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить награду"""
    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.user_id == current_user.id
    ).first()
    
    if not reward:
        raise HTTPException(status_code=404, detail="Награда не найдена")
    
    for field, value in reward_data.model_dump().items():
        setattr(reward, field, value)
    
    db.commit()
    db.refresh(reward)
    return reward


@router.delete("/{reward_id}")
async def delete_reward(
    reward_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить награду"""
    reward = db.query(Reward).filter(
        Reward.id == reward_id,
        Reward.user_id == current_user.id
    ).first()
    
    if not reward:
        raise HTTPException(status_code=404, detail="Награда не найдена")
    
    db.delete(reward)
    db.commit()
    return {"message": "Награда удалена"}


@router.post("/spend/{reward_id}")
async def spend_reward(
    reward_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Потратить XP на награду"""
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Награда не найдена")
    
    wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Кошелёк не найден")
    
    if wallet.balance < reward.xp_cost:
        raise HTTPException(status_code=400, detail="Недостаточно XP")
    
    wallet.balance -= reward.xp_cost
    wallet.total_spent += reward.xp_cost
    
    # Сохраняем в историю покупок
    purchase = RewardPurchase(
        user_id=current_user.id,
        reward_name=reward.name,
        xp_spent=reward.xp_cost
    )
    db.add(purchase)
    db.commit()
    
    return {
        "reward": reward.name,
        "spent": reward.xp_cost,
        "new_balance": wallet.balance
    }


@router.get("/purchases")
async def get_purchase_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Получить историю покупок наград"""
    purchases = db.query(RewardPurchase).filter(
        RewardPurchase.user_id == current_user.id
    ).order_by(RewardPurchase.purchased_at.desc()).limit(limit).all()
    
    return [
        {
            "id": p.id,
            "reward_name": p.reward_name,
            "xp_spent": p.xp_spent,
            "date": p.purchased_at.isoformat()
        }
        for p in purchases
    ]
