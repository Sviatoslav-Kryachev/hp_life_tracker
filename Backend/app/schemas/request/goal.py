# app/schemas/request/goal.py
from pydantic import BaseModel, field_validator, Field
from typing import Optional
from datetime import date


class GoalCreate(BaseModel):
    """Схема для создания цели"""
    name: str = Field(..., min_length=1, max_length=200, description="Название цели")
    description: Optional[str] = Field(None, max_length=500, description="Описание цели")
    target_xp: float = Field(..., ge=1, le=100000, description="Целевое количество XP (1-100000)")
    deadline: Optional[date] = Field(None, description="Срок выполнения цели")
    category: Optional[str] = Field(None, max_length=50, description="Категория цели")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
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

    @field_validator('deadline')
    @classmethod
    def validate_deadline(cls, v: Optional[date]) -> Optional[date]:
        if v and v < date.today():
            raise ValueError('Срок выполнения цели не может быть в прошлом')
        return v


class GoalUpdate(BaseModel):
    """Схема для обновления цели"""
    name: Optional[str] = Field(None, min_length=1, max_length=200, description="Название цели")
    description: Optional[str] = Field(None, max_length=500, description="Описание цели")
    target_xp: Optional[float] = Field(None, ge=1, le=100000, description="Целевое количество XP")
    deadline: Optional[date] = Field(None, description="Срок выполнения цели")
    category: Optional[str] = Field(None, max_length=50, description="Категория цели")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
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

    @field_validator('deadline')
    @classmethod
    def validate_deadline(cls, v: Optional[date]) -> Optional[date]:
        if v and v < date.today():
            raise ValueError('Срок выполнения цели не может быть в прошлом')
        return v
