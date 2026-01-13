# app/schemas/request/goal.py
from pydantic import BaseModel, field_validator, Field
from typing import Optional
from datetime import datetime


class GoalCreate(BaseModel):
    """Схема для создания цели"""
    title: str = Field(..., min_length=1, max_length=200, description="Название цели")
    description: Optional[str] = Field(None, max_length=500, description="Описание цели")
    target_xp: float = Field(..., ge=1, le=100000, description="Целевое количество XP (1-100000)")
    target_quantity: Optional[float] = Field(None, ge=0, description="Целевое количество (для quantity типа)")
    completion_bonus_xp: Optional[float] = Field(0.0, ge=0, description="Бонус XP за достижение цели")
    target_date: Optional[datetime] = Field(None, description="Срок выполнения цели")
    activity_id: Optional[int] = Field(None, gt=0, description="ID активности (опционально)")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Название цели не может быть пустым')
        return v.strip()

    @field_validator('target_xp')
    @classmethod
    def validate_target_xp(cls, v: float) -> float:
        if v < 1:
            raise ValueError('Целевое количество XP должно быть не менее 1')
        if v > 100000:
            raise ValueError('Целевое количество XP не должно превышать 100000')
        return v

    @field_validator('target_date')
    @classmethod
    def validate_target_date(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v and v < datetime.now():
            raise ValueError('Срок выполнения цели не может быть в прошлом')
        return v


class GoalUpdate(BaseModel):
    """Схема для обновления цели"""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Название цели")
    description: Optional[str] = Field(None, max_length=500, description="Описание цели")
    target_xp: Optional[float] = Field(None, ge=1, le=100000, description="Целевое количество XP")
    target_quantity: Optional[float] = Field(None, ge=0, description="Целевое количество")
    completion_bonus_xp: Optional[float] = Field(None, ge=0, description="Бонус XP за достижение цели")
    target_date: Optional[datetime] = Field(None, description="Срок выполнения цели")
    activity_id: Optional[int] = Field(None, gt=0, description="ID активности")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and (not v or not v.strip()):
            raise ValueError('Название цели не может быть пустым')
        return v.strip() if v else v

    @field_validator('target_xp')
    @classmethod
    def validate_target_xp(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 1:
            raise ValueError('Целевое количество XP должно быть не менее 1')
        if v is not None and v > 100000:
            raise ValueError('Целевое количество XP не должно превышать 100000')
        return v

    @field_validator('target_date')
    @classmethod
    def validate_target_date(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v and v < datetime.now():
            raise ValueError('Срок выполнения цели не может быть в прошлом')
        return v
