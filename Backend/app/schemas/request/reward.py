# app/schemas/request/reward.py
from pydantic import BaseModel, field_validator, Field
from typing import Optional


class RewardCreate(BaseModel):
    """Схема для создания награды"""
    name: str = Field(..., min_length=1, max_length=200, description="Название награды")
    description: Optional[str] = Field(None, max_length=500, description="Описание награды")
    xp_cost: float = Field(..., ge=0, le=100000, description="Стоимость в XP (0-100000)")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Название награды не может быть пустым')
        return v.strip()

    @field_validator('xp_cost')
    @classmethod
    def validate_xp_cost(cls, v: float) -> float:
        if v < 0:
            raise ValueError('Стоимость награды не может быть отрицательной')
        if v > 100000:
            raise ValueError('Стоимость награды не может превышать 100000 XP')
        return v


class RewardUpdate(BaseModel):
    """Схема для обновления награды"""
    name: Optional[str] = Field(None, min_length=1, max_length=200, description="Название награды")
    description: Optional[str] = Field(None, max_length=500, description="Описание награды")
    xp_cost: Optional[float] = Field(None, ge=0, le=100000, description="Стоимость в XP")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and (not v or not v.strip()):
            raise ValueError('Название награды не может быть пустым')
        return v.strip() if v else v

    @field_validator('xp_cost')
    @classmethod
    def validate_xp_cost(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError('Стоимость награды не может быть отрицательной')
        if v is not None and v > 100000:
            raise ValueError('Стоимость награды не может превышать 100000 XP')
        return v
