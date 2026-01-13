# app/schemas/request/activity.py
from pydantic import BaseModel, field_validator, Field
from typing import Optional, List


class ActivityCreate(BaseModel):
    """Схема для создания активности"""
    name: str = Field(..., min_length=1, max_length=100, description="Название активности")
    category: Optional[str] = Field("general", max_length=50, description="Категория активности")
    xp_per_hour: Optional[float] = Field(60.0, ge=0, le=10000, description="XP в час (0-10000)")
    unit_type: Optional[str] = Field("time", description="Тип единицы измерения: time или quantity")
    xp_per_unit: Optional[float] = Field(None, ge=0, description="XP за единицу (для quantity типа)")
    color: Optional[str] = Field("#3498db", pattern=r"^#[0-9A-Fa-f]{6}$", description="Цвет в формате HEX")
    display_order: Optional[int] = Field(None, ge=0, description="Порядок отображения")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Название активности не может быть пустым')
        return v.strip()

    @field_validator('unit_type')
    @classmethod
    def validate_unit_type(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in ["time", "quantity"]:
            raise ValueError('unit_type должен быть "time" или "quantity"')
        return v

    @field_validator('xp_per_hour')
    @classmethod
    def validate_xp_per_hour(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError('XP в час не может быть отрицательным')
        if v is not None and v > 10000:
            raise ValueError('XP в час не может превышать 10000')
        return v


class ActivityUpdate(BaseModel):
    """Схема для обновления активности"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Название активности")
    category: Optional[str] = Field(None, max_length=50, description="Категория активности")
    xp_per_hour: Optional[float] = Field(None, ge=0, le=10000, description="XP в час")
    unit_type: Optional[str] = Field(None, description="Тип единицы измерения")
    xp_per_unit: Optional[float] = Field(None, ge=0, description="XP за единицу")
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$", description="Цвет в формате HEX")
    display_order: Optional[int] = Field(None, ge=0, description="Порядок отображения")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and (not v or not v.strip()):
            raise ValueError('Название активности не может быть пустым')
        return v.strip() if v else v

    @field_validator('unit_type')
    @classmethod
    def validate_unit_type(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in ["time", "quantity"]:
            raise ValueError('unit_type должен быть "time" или "quantity"')
        return v


class ActivityReorder(BaseModel):
    """Схема для изменения порядка активностей"""
    activity_ids: List[int] = Field(..., min_length=1, description="Список ID активностей в новом порядке")

    @field_validator('activity_ids')
    @classmethod
    def validate_activity_ids(cls, v: List[int]) -> List[int]:
        if not v:
            raise ValueError('Список ID активностей не может быть пустым')
        if len(set(v)) != len(v):
            raise ValueError('ID активностей не должны повторяться')
        return v
