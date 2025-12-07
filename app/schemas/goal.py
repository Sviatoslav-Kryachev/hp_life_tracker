# app/schemas/goal.py
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_xp: float
    target_date: Optional[datetime] = None
    activity_id: Optional[int] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_xp: Optional[float] = None
    target_date: Optional[datetime] = None
    activity_id: Optional[int] = None


class GoalOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    target_xp: float
    current_xp: float
    target_date: Optional[datetime] = None
    activity_id: Optional[int] = None
    activity_name: Optional[str] = None
    is_completed: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    progress_percent: float
    
    model_config = ConfigDict(from_attributes=True)




