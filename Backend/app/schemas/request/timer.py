# app/schemas/request/timer.py
from pydantic import BaseModel, field_validator, Field
from typing import Optional
from datetime import datetime


class TimerStart(BaseModel):
    """Схема для запуска таймера"""
    activity_id: int = Field(..., gt=0, description="ID активности")


class ManualTimeCreate(BaseModel):
    """Схема для ручного добавления времени"""
    activity_id: int = Field(..., gt=0, description="ID активности")
    duration_minutes: float = Field(..., gt=0, le=1440, description="Длительность в минутах (0-1440)")
    start_time: Optional[datetime] = Field(None, description="Время начала (опционально)")

    @field_validator('duration_minutes')
    @classmethod
    def validate_duration(cls, v: float) -> float:
        if v <= 0:
            raise ValueError('Длительность должна быть больше 0')
        if v > 1440:  # 24 часа
            raise ValueError('Длительность не может превышать 1440 минут (24 часа)')
        return v
