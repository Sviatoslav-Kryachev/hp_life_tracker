# app/schemas/response/__init__.py
from app.schemas.response.user import UserOut, UserProfile
from app.schemas.response.activity import ActivityOut
from app.schemas.response.reward import RewardOut
from app.schemas.response.goal import GoalOut
from app.schemas.response.xp import WalletOut, XPHistoryItem, TodayStats, WeekStats

__all__ = [
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
