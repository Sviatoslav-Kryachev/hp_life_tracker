# app/schemas/response/activity.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class ActivityOut(BaseModel):
    """Схема для вывода информации об активности"""
    id: int = Field(..., description="ID активности")
    name: str = Field(..., description="Название активности")
    category: Optional[str] = Field("general", description="Категория активности")
    xp_per_hour: Optional[float] = Field(60.0, description="XP в час")
    unit_type: Optional[str] = Field("time", description="Тип единицы измерения")
    xp_per_unit: Optional[float] = Field(None, description="XP за единицу")
    display_order: Optional[int] = Field(0, description="Порядок отображения")
    color: Optional[str] = Field("#3498db", description="Цвет активности")
    created_at: Optional[datetime] = Field(None, description="Дата создания")

    model_config = ConfigDict(from_attributes=True)
