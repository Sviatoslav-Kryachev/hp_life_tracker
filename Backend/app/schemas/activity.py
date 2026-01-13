from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ActivityCreate(BaseModel):
    name: str
    category: Optional[str] = "general"
    xp_per_hour: Optional[float] = 60.0
    unit_type: Optional[str] = "time"  # "time" или "quantity"
    xp_per_unit: Optional[float] = None  # XP за единицу (для quantity типа)
    color: Optional[str] = "#3498db"


class ActivityOut(BaseModel):
    id: int
    name: str
    category: Optional[str] = "general"  # ✅ Optional по умолчанию
    xp_per_hour: Optional[float] = 60.0  # ✅ Optional по умолчанию
    unit_type: Optional[str] = "time"  # Единица измерения
    xp_per_unit: Optional[float] = None  # XP за единицу
    color: Optional[str] = "#3498db"  # ✅ Optional по умолчанию
    created_at: Optional[datetime] = None  # ✅ Optional по умолчанию

    model_config = ConfigDict(from_attributes=True)  # ✅ Pydantic v2 [web:11]
