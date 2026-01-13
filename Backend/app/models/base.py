# Этот файл оставлен для обратной совместимости
# Все модели теперь разделены по доменам в отдельных файлах
# Импортируем все модели для обратной совместимости

from app.models.user import User, XPWallet
from app.models.activity import Activity, ActivityLog, TimerLog
from app.models.reward import Reward, RewardPurchase, BlacklistReward
from app.models.goal import Goal, CustomCategory
from app.models.social import Group, GroupMember, Challenge, ChallengeParticipant
from app.models.achievement import Achievement, Streak

# Экспортируем все модели для обратной совместимости
__all__ = [
    "User",
    "XPWallet",
    "Activity",
    "ActivityLog",
    "TimerLog",
    "Reward",
    "RewardPurchase",
    "BlacklistReward",
    "Goal",
    "CustomCategory",
    "Group",
    "GroupMember",
    "Challenge",
    "ChallengeParticipant",
    "Achievement",
    "Streak",
]
