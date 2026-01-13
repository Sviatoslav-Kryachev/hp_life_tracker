# app/core/__init__.py
from app.core.config import settings
from app.core.database import engine, SessionLocal, Base, get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_token,
    pwd_context,
    oauth2_scheme,
)

# Импортируем зависимости из dependencies/ для удобства
# Рекомендуется использовать зависимости напрямую из app.dependencies
from app.dependencies import (
    get_db as get_db_dependency,
    get_current_user,
    get_current_user_optional,
    require_admin,
    require_owner_or_admin,
    check_user_permission,
    check_admin,
)

__all__ = [
    "settings",
    "engine",
    "SessionLocal",
    "Base",
    "get_db",  # Из core.database (для обратной совместимости)
    "verify_password",
    "get_password_hash",
    "create_access_token",
    "decode_token",
    "pwd_context",
    "oauth2_scheme",
    # Dependencies (рекомендуется использовать из app.dependencies)
    "get_db_dependency",
    "get_current_user",
    "get_current_user_optional",
    "require_admin",
    "require_owner_or_admin",
    "check_user_permission",
    "check_admin",
]
