# app/schemas/__init__.py
# Импортируем все схемы для обратной совместимости
from app.schemas.common import Token, TokenData, MessageResponse, ErrorResponse
from app.schemas.request import (
    UserCreate,
    UserLogin,
    ActivityCreate,
    ActivityUpdate,
    ActivityReorder,
    RewardCreate,
    RewardUpdate,
    GoalCreate,
    GoalUpdate,
    ManualTimeCreate,
    TimerStart,
)
from app.schemas.response import (
    UserOut,
    UserProfile,
    ActivityOut,
    RewardOut,
    GoalOut,
    WalletOut,
    XPHistoryItem,
    TodayStats,
    WeekStats,
)

__all__ = [
    # Common
    "Token",
    "TokenData",
    "MessageResponse",
    "ErrorResponse",
    # Request schemas
    "UserCreate",
    "UserLogin",
    "ActivityCreate",
    "ActivityUpdate",
    "ActivityReorder",
    "RewardCreate",
    "RewardUpdate",
    "GoalCreate",
    "GoalUpdate",
    "ManualTimeCreate",
    "TimerStart",
    # Response schemas
    "UserOut",
    "UserProfile",
    "ActivityOut",
    "RewardOut",
    "GoalOut",
    "WalletOut",
    "XPHistoryItem",
    "TodayStats",
    "WeekStats",
]
