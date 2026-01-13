# app/schemas/common.py
from pydantic import BaseModel, ConfigDict


class Token(BaseModel):
    """Схема для JWT токена"""
    access_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    """Стандартный ответ с сообщением"""
    message: str


class ErrorResponse(BaseModel):
    """Стандартный ответ об ошибке"""
    detail: str
