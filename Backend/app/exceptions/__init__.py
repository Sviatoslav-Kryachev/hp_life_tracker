# app/exceptions/__init__.py
from app.exceptions.base import (
    BaseAppException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
)
from app.exceptions.activity_exceptions import (
    ActivityNotFoundException,
    ActivityAccessDeniedException,
    ActivityValidationException,
    ActivityReorderException,
    ActivityDisplayOrderException,
)
from app.exceptions.user_exceptions import (
    UserNotFoundException,
    UserAlreadyExistsException,
    InvalidCredentialsException,
    WalletNotFoundException,
    InsufficientXPException,
    UserValidationException,
)

__all__ = [
    # Base exceptions
    "BaseAppException",
    "NotFoundException",
    "BadRequestException",
    "UnauthorizedException",
    "ForbiddenException",
    "ConflictException",
    # Activity exceptions
    "ActivityNotFoundException",
    "ActivityAccessDeniedException",
    "ActivityValidationException",
    "ActivityReorderException",
    "ActivityDisplayOrderException",
    # User exceptions
    "UserNotFoundException",
    "UserAlreadyExistsException",
    "InvalidCredentialsException",
    "WalletNotFoundException",
    "InsufficientXPException",
    "UserValidationException",
]
