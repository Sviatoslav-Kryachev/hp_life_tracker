# app/schemas/common.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class Token(BaseModel):
    """Схема для JWT токена"""
    access_token: str = Field(..., description="JWT токен доступа")
    token_type: str = Field("bearer", description="Тип токена")
    refresh_token: Optional[str] = Field(None, description="Токен обновления (опционально)")


class TokenData(BaseModel):
    """Схема для данных токена"""
    user_id: Optional[int] = Field(None, description="ID пользователя")


class MessageResponse(BaseModel):
    """Стандартный ответ с сообщением"""
    message: str = Field(..., description="Сообщение")


class ErrorResponse(BaseModel):
    """Стандартный ответ об ошибке"""
    detail: str = Field(..., description="Описание ошибки")
