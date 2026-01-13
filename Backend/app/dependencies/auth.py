# app/dependencies/auth.py
from typing import Optional
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.core.security import (
    oauth2_scheme,
    decode_token,
)
from app.models.base import User
from app.exceptions import UnauthorizedException


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency для получения текущего пользователя из JWT токена.
    
    Использование:
        @router.get("/profile")
        async def get_profile(current_user: User = Depends(get_current_user)):
            ...
    
    Raises:
        UnauthorizedException: Если токен отсутствует, невалидный или пользователь не найден
    """
    credentials_exception = UnauthorizedException(
        detail="Не удалось проверить учетные данные"
    )
    
    if not token:
        raise credentials_exception
    
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id_str = payload.get("sub")
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Опциональная версия get_current_user.
    Возвращает None если токен отсутствует/невалидный.
    
    Использование:
        @router.get("/public")
        async def public_endpoint(
            current_user: Optional[User] = Depends(get_current_user_optional)
        ):
            if current_user:
                # Пользователь авторизован
                ...
            else:
                # Публичный доступ
                ...
    
    Returns:
        User или None
    """
    if not token:
        return None
    
    payload = decode_token(token)
    if payload is None:
        return None
    
    user_id = payload.get("sub")
    if user_id is None:
        return None
    
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return None
    
    return db.query(User).filter(User.id == user_id).first()
