# app/schemas/response/user.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class UserOut(BaseModel):
    """Схема для вывода информации о пользователе"""
    id: int = Field(..., description="ID пользователя")
    email: str = Field(..., description="Email пользователя")
    username: Optional[str] = Field(None, description="Имя пользователя")

    model_config = ConfigDict(from_attributes=True)


class UserProfile(BaseModel):
    """Расширенная схема профиля пользователя"""
    id: int = Field(..., description="ID пользователя")
    email: str = Field(..., description="Email пользователя")
    username: Optional[str] = Field(None, description="Имя пользователя")
    telegram_id: Optional[int] = Field(None, description="Telegram ID")
    telegram_username: Optional[str] = Field(None, description="Telegram username")
    is_admin: bool = Field(False, description="Является ли администратором")

    model_config = ConfigDict(from_attributes=True)
