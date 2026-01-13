# app/schemas/response/reward.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class RewardOut(BaseModel):
    """Схема для вывода информации о награде"""
    id: int = Field(..., description="ID награды")
    user_id: Optional[int] = Field(None, description="ID пользователя (None для общих наград)")
    name: str = Field(..., description="Название награды")
    description: Optional[str] = Field(None, description="Описание награды")
    xp_cost: float = Field(..., description="Стоимость в XP")

    model_config = ConfigDict(from_attributes=True)
