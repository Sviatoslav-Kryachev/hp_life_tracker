from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ActivityCreate(BaseModel):
    name: str
    category: Optional[str] = "general"
    xp_per_hour: Optional[float] = 60.0
    color: Optional[str] = "#3498db"


class ActivityOut(BaseModel):
    id: int
    name: str
    category: str = "general"  # ✅ Optional по умолчанию
    xp_per_hour: float = 60.0  # ✅ Optional по умолчанию
    color: str = "#3498db"  # ✅ Optional по умолчанию
    created_at: datetime = datetime.now()  # ✅ Optional по умолчанию

    model_config = ConfigDict(from_attributes=True)  # ✅ Pydantic v2 [web:11]
