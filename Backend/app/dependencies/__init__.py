# app/dependencies/__init__.py
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user, get_current_user_optional
from app.dependencies.permissions import (
    require_admin,
    require_owner_or_admin,
    check_user_permission,
    check_admin,
    require_user_permission_factory,
)

__all__ = [
    "get_db",
    "get_current_user",
    "get_current_user_optional",
    "require_admin",
    "require_owner_or_admin",
    "check_user_permission",
    "check_admin",
    "require_user_permission_factory",
]
