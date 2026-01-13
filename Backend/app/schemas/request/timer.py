# app/schemas/request/timer.py
from pydantic import BaseModel, field_validator, Field
from typing import Optional


class TimerStart(BaseModel):
    """Схема для запуска таймера"""
    activity_id: int = Field(..., gt=0, description="ID активности")


class ManualTimeCreate(BaseModel):
    """Схема для ручного добавления времени"""
    activity_id: int = Field(..., gt=0, description="ID активности")
    minutes: Optional[float] = Field(None, gt=0, le=1440, description="Длительность в минутах для time типа (0-1440)")
    quantity: Optional[float] = Field(None, gt=0, description="Количество для quantity типа")

    @field_validator('minutes')
    @classmethod
    def validate_minutes(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError('Длительность должна быть больше 0')
        if v is not None and v > 1440:  # 24 часа
            raise ValueError('Длительность не может превышать 1440 минут (24 часа)')
        return v

    @field_validator('quantity')
    @classmethod
    def validate_quantity(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError('Количество должно быть больше 0')
        return v

    @field_validator('activity_id')
    @classmethod
    def validate_activity_id(cls, v: int) -> int:
        if v <= 0:
            raise ValueError('ID активности должен быть положительным числом')
        return v
