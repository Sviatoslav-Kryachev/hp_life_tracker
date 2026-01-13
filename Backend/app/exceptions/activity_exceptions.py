# app/exceptions/activity_exceptions.py
from app.exceptions.base import NotFoundException, BadRequestException, ForbiddenException


class ActivityNotFoundException(NotFoundException):
    """Активность не найдена"""
    
    def __init__(self, activity_id: int = None):
        if activity_id:
            detail = f"Активность с ID {activity_id} не найдена"
        else:
            detail = "Активность не найдена"
        super().__init__(detail=detail)


class ActivityAccessDeniedException(ForbiddenException):
    """Доступ к активности запрещен"""
    
    def __init__(self, activity_id: int = None):
        if activity_id:
            detail = f"У вас нет доступа к активности с ID {activity_id}"
        else:
            detail = "У вас нет доступа к этой активности"
        super().__init__(detail=detail)


class ActivityValidationException(BadRequestException):
    """Ошибка валидации данных активности"""
    
    def __init__(self, detail: str = "Некорректные данные активности"):
        super().__init__(detail=detail)


class ActivityReorderException(BadRequestException):
    """Ошибка при изменении порядка активностей"""
    
    def __init__(self, detail: str = "Некоторые активности не найдены"):
        super().__init__(detail=detail)


class ActivityDisplayOrderException(BadRequestException):
    """Ошибка при работе с display_order"""
    
    def __init__(self, detail: str = "Поле display_order еще не создано. Примените миграцию базы данных."):
        super().__init__(detail=detail)
