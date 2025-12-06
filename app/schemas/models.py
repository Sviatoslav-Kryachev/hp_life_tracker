from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ----------------- USER -----------------
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True

# ----------------- TOKEN -----------------
class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None

# ----------------- ACTIVITY -----------------
class ActivityBase(BaseModel):
    name: str
    xp_per_hour: Optional[float] = 10.0

class ActivityCreate(ActivityBase):
    pass

class ActivityOut(ActivityBase):
    id: int

    class Config:
        from_attributes = True

# ----------------- MANUAL TIMER -----------------
class ManualTimeCreate(BaseModel):
    activity_id: int
    minutes: float
