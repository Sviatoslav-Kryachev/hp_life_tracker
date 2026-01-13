# app/exceptions/base.py
from fastapi import HTTPException
from typing import Optional


class BaseAppException(HTTPException):
    """Базовое исключение приложения"""
    
    def __init__(
        self,
        status_code: int = 500,
        detail: str = "Произошла ошибка",
        headers: Optional[dict] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.status_code = status_code
        self.detail = detail


class NotFoundException(BaseAppException):
    """Исключение для ресурсов, которые не найдены"""
    
    def __init__(self, detail: str = "Ресурс не найден", headers: Optional[dict] = None):
        super().__init__(status_code=404, detail=detail, headers=headers)


class BadRequestException(BaseAppException):
    """Исключение для некорректных запросов"""
    
    def __init__(self, detail: str = "Некорректный запрос", headers: Optional[dict] = None):
        super().__init__(status_code=400, detail=detail, headers=headers)


class UnauthorizedException(BaseAppException):
    """Исключение для неавторизованных запросов"""
    
    def __init__(self, detail: str = "Требуется авторизация", headers: Optional[dict] = None):
        super().__init__(status_code=401, detail=detail, headers=headers)


class ForbiddenException(BaseAppException):
    """Исключение для запрещенных операций"""
    
    def __init__(self, detail: str = "Доступ запрещен", headers: Optional[dict] = None):
        super().__init__(status_code=403, detail=detail, headers=headers)


class ConflictException(BaseAppException):
    """Исключение для конфликтующих операций"""
    
    def __init__(self, detail: str = "Конфликт данных", headers: Optional[dict] = None):
        super().__init__(status_code=409, detail=detail, headers=headers)
