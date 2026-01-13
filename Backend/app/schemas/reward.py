# app/schemas/reward.py
from pydantic import BaseModel
from typing import Optional

class RewardCreate(BaseModel):
    name: str
    xp_cost: float

class RewardOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    xp_cost: float

    model_config = {"from_attributes": True}

class RewardUpdate(BaseModel):
    name: str
    xp_cost: float
