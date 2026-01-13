# app/schemas/response/goal.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class GoalOut(BaseModel):
    """Схема для вывода информации о цели"""
    id: int = Field(..., description="ID цели")
    user_id: int = Field(..., description="ID пользователя")
    title: str = Field(..., description="Название цели")
    description: Optional[str] = Field(None, description="Описание цели")
    target_xp: float = Field(..., description="Целевое количество XP")
    current_xp: float = Field(0.0, description="Текущее количество XP")
    target_quantity: Optional[float] = Field(None, description="Целевое количество (для quantity типа)")
    current_quantity: Optional[float] = Field(None, description="Текущее количество")
    completion_bonus_xp: float = Field(0.0, description="Бонус XP за достижение цели")
    target_date: Optional[datetime] = Field(None, description="Срок выполнения")
    activity_id: Optional[int] = Field(None, description="ID активности")
    activity_name: Optional[str] = Field(None, description="Название активности")
    is_completed: int = Field(0, description="Выполнена ли цель (0 или 1)")
    completed_at: Optional[datetime] = Field(None, description="Дата выполнения")
    created_at: datetime = Field(..., description="Дата создания")
    progress_percent: float = Field(0.0, description="Процент выполнения")

    model_config = ConfigDict(from_attributes=True)
