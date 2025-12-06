# routers/rewards.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.base import Reward
from app.schemas import RewardCreate, RewardOut
from app.utils.database import get_db

router = APIRouter(tags=["rewards"])

@router.get("/", response_model=list[RewardOut])
def get_rewards(db: Session = Depends(get_db)):
    return db.query(Reward).all()

@router.post("/", response_model=RewardOut)
def create_reward(reward: RewardCreate, db: Session = Depends(get_db)):
    new_reward = Reward(**reward.model_dump())  # ✅ Pydantic v2 [web:11]
    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)
    return new_reward

@router.put("/{reward_id}", response_model=RewardOut)
def update_reward(reward_id: int, reward_data: RewardCreate, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    for field, value in reward_data.model_dump().items():  # ✅ Pydantic v2
        setattr(reward, field, value)
    db.commit()
    db.refresh(reward)
    return reward


@router.delete("/{reward_id}")
def delete_reward(reward_id: int, db: Session = Depends(get_db)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    db.delete(reward)
    db.commit()
    return {"message": "Reward deleted"}
