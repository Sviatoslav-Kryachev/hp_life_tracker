# app/schemas/response/goal.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date, datetime


class GoalOut(BaseModel):
    """Схема для вывода информации о цели"""
    id: int = Field(..., description="ID цели")
    name: str = Field(..., description="Название цели")
    description: Optional[str] = Field(None, description="Описание цели")
    target_xp: float = Field(..., description="Целевое количество XP")
    current_xp: float = Field(0.0, description="Текущее количество XP")
    deadline: Optional[date] = Field(None, description="Срок выполнения")
    category: Optional[str] = Field(None, description="Категория цели")
    is_completed: bool = Field(False, description="Выполнена ли цель")
    created_at: Optional[datetime] = Field(None, description="Дата создания")
    completed_at: Optional[datetime] = Field(None, description="Дата выполнения")

    model_config = ConfigDict(from_attributes=True)
