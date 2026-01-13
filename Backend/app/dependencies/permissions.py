# app/dependencies/permissions.py
from typing import Callable
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.base import User
from app.exceptions import ForbiddenException


def check_admin(user: User) -> bool:
    """
    Проверка, является ли пользователь администратором.
    
    Args:
        user: Пользователь для проверки
    
    Returns:
        True если пользователь администратор, иначе False
    """
    return user.is_admin == 1 or user.parent_id is None


async def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency для проверки прав администратора.
    
    Использование:
        @router.get("/admin/users")
        async def get_all_users(
            admin: User = Depends(require_admin)
        ):
            ...
    
    Raises:
        ForbiddenException: Если пользователь не является администратором
    """
    if not check_admin(current_user):
        raise ForbiddenException(
            detail="Доступ запрещён. Только администраторы могут выполнять эту операцию."
        )
    return current_user


async def require_owner_or_admin(
    resource_user_id: int,
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency для проверки, что пользователь является владельцем ресурса или администратором.
    
    Использование:
        @router.delete("/activities/{activity_id}")
        async def delete_activity(
            activity_id: int,
            current_user: User = Depends(get_current_user),
            db: Session = Depends(get_db)
        ):
            activity = db.query(Activity).filter(Activity.id == activity_id).first()
            if not activity:
                raise NotFoundException()
            
            # Проверяем права доступа
            await require_owner_or_admin(activity.user_id, current_user)
            ...
    
    Args:
        resource_user_id: ID пользователя-владельца ресурса
        current_user: Текущий пользователь
    
    Raises:
        ForbiddenException: Если пользователь не является владельцем или администратором
    """
    if current_user.id != resource_user_id and not check_admin(current_user):
        raise ForbiddenException(
            detail="Доступ запрещён. Вы не являетесь владельцем этого ресурса."
        )
    return current_user


def check_user_permission(
    user_id: int,
    current_user: User
) -> bool:
    """
    Проверка прав пользователя на доступ к ресурсу другого пользователя.
    
    Args:
        user_id: ID пользователя, к ресурсам которого нужен доступ
        current_user: Текущий пользователь
    
    Returns:
        True если есть доступ (владелец или администратор), иначе False
    """
    return current_user.id == user_id or check_admin(current_user)


def require_user_permission_factory(user_id: int):
    """
    Фабрика для создания dependency проверки прав доступа к ресурсам пользователя.
    
    Использование:
        @router.get("/users/{user_id}/stats")
        async def get_user_stats(
            user_id: int,
            current_user: User = Depends(lambda: require_user_permission_factory(user_id))
        ):
            ...
    
    Или через класс:
        class UserPermissionChecker:
            def __init__(self, user_id: int):
                self.user_id = user_id
            
            async def __call__(self, current_user: User = Depends(get_current_user)) -> User:
                if not check_user_permission(self.user_id, current_user):
                    raise ForbiddenException(
                        detail="Доступ запрещён. У вас нет прав для доступа к ресурсам этого пользователя."
                    )
                return current_user
    """
    async def _check_permission(current_user: User = Depends(get_current_user)) -> User:
        if not check_user_permission(user_id, current_user):
            raise ForbiddenException(
                detail="Доступ запрещён. У вас нет прав для доступа к ресурсам этого пользователя."
            )
        return current_user
    return _check_permission
