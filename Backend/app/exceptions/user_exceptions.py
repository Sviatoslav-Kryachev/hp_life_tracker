# app/exceptions/user_exceptions.py
from app.exceptions.base import NotFoundException, BadRequestException, UnauthorizedException, ConflictException


class UserNotFoundException(NotFoundException):
    """Пользователь не найден"""
    
    def __init__(self, user_id: int = None, identifier: str = None):
        if user_id:
            detail = f"Пользователь с ID {user_id} не найден"
        elif identifier:
            detail = f"Пользователь '{identifier}' не найден"
        else:
            detail = "Пользователь не найден"
        super().__init__(detail=detail)


class UserAlreadyExistsException(ConflictException):
    """Пользователь уже существует"""
    
    def __init__(self, email: str = None, username: str = None):
        if email:
            detail = f"Пользователь с email {email} уже существует"
        elif username:
            detail = f"Пользователь с именем {username} уже существует"
        else:
            detail = "Пользователь уже существует"
        super().__init__(detail=detail)


class InvalidCredentialsException(UnauthorizedException):
    """Неверные учетные данные"""
    
    def __init__(self, detail: str = "Неверный email или пароль"):
        super().__init__(detail=detail)


class WalletNotFoundException(NotFoundException):
    """Кошелёк не найден"""
    
    def __init__(self, user_id: int = None):
        if user_id:
            detail = f"Кошелёк пользователя с ID {user_id} не найден"
        else:
            detail = "Кошелёк не найден"
        super().__init__(detail=detail)


class InsufficientXPException(BadRequestException):
    """Недостаточно XP"""
    
    def __init__(self, required: float = None, available: float = None):
        if required and available:
            detail = f"Недостаточно XP. Требуется: {required}, доступно: {available}"
        else:
            detail = "Недостаточно XP"
        super().__init__(detail=detail)


class UserValidationException(BadRequestException):
    """Ошибка валидации данных пользователя"""
    
    def __init__(self, detail: str = "Некорректные данные пользователя"):
        super().__init__(detail=detail)
