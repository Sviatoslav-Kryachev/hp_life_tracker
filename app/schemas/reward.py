# app/schemas/reward.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RewardCreate(BaseModel):
    name: str
    xp_cost: float
    category: Optional[str] = "entertainment"

class RewardOut(BaseModel):
    id: int
    user_id: int
    name: str
    xp_cost: float
    category: str
    is_custom: bool  # ← обязательно, если есть поле в модели
    created_at: datetime

    model_config = {"from_attributes": True}

class RewardUpdate(BaseModel):
    name: str
    xp_cost: float
    category: Optional[str] = None
