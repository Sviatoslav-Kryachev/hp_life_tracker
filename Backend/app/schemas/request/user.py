# app/schemas/request/user.py
from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional


class UserCreate(BaseModel):
    """Схема для создания пользователя"""
    email: EmailStr = Field(..., description="Email пользователя")
    password: str = Field(..., min_length=6, max_length=100, description="Пароль (минимум 6 символов)")
    username: Optional[str] = Field(None, max_length=50, description="Имя пользователя")
    invite_code: Optional[str] = Field(None, max_length=20, description="Код приглашения")

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Пароль должен содержать минимум 6 символов')
        return v

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        if v and len(v) < 2:
            raise ValueError('Имя пользователя должно содержать минимум 2 символа')
        if v and len(v) > 50:
            raise ValueError('Имя пользователя не должно превышать 50 символов')
        return v


class UserLogin(BaseModel):
    """Схема для входа пользователя"""
    email: EmailStr = Field(..., description="Email пользователя")
    password: str = Field(..., min_length=1, description="Пароль")
