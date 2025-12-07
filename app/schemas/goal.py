# app/schemas/goal.py
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_xp: float
    target_quantity: Optional[float] = None  # Целевое количество (для quantity типа)
    completion_bonus_xp: Optional[float] = 0.0  # Бонус XP за достижение цели
    target_date: Optional[datetime] = None
    activity_id: Optional[int] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_xp: Optional[float] = None
    target_quantity: Optional[float] = None
    completion_bonus_xp: Optional[float] = None
    target_date: Optional[datetime] = None
    activity_id: Optional[int] = None


class GoalOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    target_xp: float
    current_xp: float
    target_quantity: Optional[float] = None
    current_quantity: Optional[float] = None
    completion_bonus_xp: float = 0.0
    target_date: Optional[datetime] = None
    activity_id: Optional[int] = None
    activity_name: Optional[str] = None
    is_completed: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    progress_percent: float
    
    model_config = ConfigDict(from_attributes=True)




