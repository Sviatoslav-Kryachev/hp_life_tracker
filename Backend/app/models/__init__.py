# Импортируем все модели для обратной совместимости
# Порядок импорта важен из-за зависимостей между моделями

# Сначала базовые модели пользователя
from app.models.user import User, XPWallet

# Затем модели активностей (зависят от User)
from app.models.activity import Activity, ActivityLog, TimerLog

# Модели наград (зависят от User)
from app.models.reward import Reward, RewardPurchase, BlacklistReward

# Модели целей (зависят от User и Activity)
from app.models.goal import Goal, CustomCategory

# Социальные модели (зависят от User)
from app.models.social import Group, GroupMember, Challenge, ChallengeParticipant

# Модели достижений (зависят от User)
from app.models.achievement import Achievement, Streak

# Экспортируем все модели для обратной совместимости
__all__ = [
    # User models
    "User",
    "XPWallet",
    # Activity models
    "Activity",
    "ActivityLog",
    "TimerLog",
    # Reward models
    "Reward",
    "RewardPurchase",
    "BlacklistReward",
    # Goal models
    "Goal",
    "CustomCategory",
    # Social models
    "Group",
    "GroupMember",
    "Challenge",
    "ChallengeParticipant",
    # Achievement models
    "Achievement",
    "Streak",
]
