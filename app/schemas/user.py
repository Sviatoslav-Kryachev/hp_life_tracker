from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    username: Optional[str]
    role: str

    model_config = ConfigDict(from_attributes=True)  # ✅ Pydantic v2 [web:11]


class UserLogin(BaseModel):  # ✅ Добавили для auth
    email: EmailStr
    password: str
