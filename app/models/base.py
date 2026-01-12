from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from app.utils.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    telegram_id = Column(Integer, unique=True, index=True, nullable=True)  # ID пользователя в Telegram
    telegram_username = Column(String, nullable=True)  # @username в Telegram
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # ID родителя/администратора
    is_admin = Column(Integer, default=0)  # 1 = администратор, 0 = обычный пользователь
    invite_code = Column(String, unique=True, index=True, nullable=True)  # Уникальный код приглашения
    wallet = relationship("XPWallet", back_populates="user", uselist=False)
    rewards = relationship("Reward", back_populates="user")
    activities = relationship("Activity", back_populates="user")
    activity_logs = relationship("ActivityLog", back_populates="user")
    timer_logs = relationship("TimerLog", back_populates="user")
    # Связь с детьми (подопечными)
    children = relationship("User", remote_side=[id], backref="parent")

class XPWallet(Base):
    __tablename__ = "xp_wallets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    balance = Column(Float, default=0.0)
    level = Column(Integer, default=1)
    total_earned = Column(Float, default=0.0)
    total_spent = Column(Float, default=0.0)
    user = relationship("User", back_populates="wallet")

class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    description = Column(String)
    xp_cost = Column(Float, default=0.0)
    user = relationship("User", back_populates="rewards")

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    category = Column(String, default="general")  # Категория: учеба, спорт, хобби и т.д.
    xp_per_hour = Column(Float, default=10.0)
    unit_type = Column(String, default="time")  # "time" или "quantity" - единица измерения
    xp_per_unit = Column(Float, nullable=True)  # XP за единицу (для quantity типа)
    display_order = Column(Integer, default=0)  # Порядок отображения (для drag and drop)
    user = relationship("User", back_populates="activities")
    activity_logs = relationship("ActivityLog", back_populates="activity")
    timer_logs = relationship("TimerLog", back_populates="activity")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_id = Column(Integer, ForeignKey("activities.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Float, default=0.0)
    xp_earned = Column(Float, default=0.0)
    user = relationship("User", back_populates="activity_logs")
    activity = relationship("Activity", back_populates="activity_logs")

class TimerLog(Base):
    __tablename__ = "timer_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_id = Column(Integer, ForeignKey("activities.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    duration_minutes = Column(Float, default=0.0)
    user = relationship("User", back_populates="timer_logs")
    activity = relationship("Activity", back_populates="timer_logs")


class RewardPurchase(Base):
    """История покупок наград"""
    __tablename__ = "reward_purchases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reward_name = Column(String, nullable=False)
    xp_spent = Column(Float, default=0.0)
    purchased_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", backref="purchases")


class Streak(Base):
    """Система streak (дни подряд)"""
    __tablename__ = "streaks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    current_streak = Column(Integer, default=0)  # Текущая серия дней
    longest_streak = Column(Integer, default=0)  # Самая длинная серия
    last_activity_date = Column(DateTime, nullable=True)  # Последний день активности
    total_days_active = Column(Integer, default=0)  # Всего дней активности
    user = relationship("User", backref="streak")


class BlacklistReward(Base):
    """Черный список наград (требуют XP для доступа)"""
    __tablename__ = "blacklist_rewards"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reward_name_pattern = Column(String, nullable=False)  # Паттерн названия (например, "YouTube", "Instagram")
    is_active = Column(Integer, default=1)  # 1 = активен, 0 = отключен
    user = relationship("User", backref="blacklist")


class Goal(Base):
    """Цели пользователя"""
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)  # Название цели
    description = Column(String, nullable=True)  # Описание
    target_xp = Column(Float, nullable=False)  # Целевое количество XP
    current_xp = Column(Float, default=0.0)  # Текущий прогресс
    target_quantity = Column(Float, nullable=True)  # Целевое количество (для quantity типа активности)
    current_quantity = Column(Float, default=0.0)  # Текущее количество (для quantity типа активности)
    completion_bonus_xp = Column(Float, default=0.0)  # Бонус XP за достижение цели
    target_date = Column(DateTime, nullable=True)  # Дата дедлайна (опционально)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=True)  # Связанная активность (опционально)
    is_completed = Column(Integer, default=0)  # 1 = выполнена, 0 = в процессе
    completed_at = Column(DateTime, nullable=True)  # Дата выполнения
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", backref="goals")
    activity = relationship("Activity", backref="goals")


class CustomCategory(Base):
    """Пользовательские категории"""
    __tablename__ = "custom_categories"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)  # Название категории
    replaced_standard_category = Column(String, nullable=True)  # ID стандартной категории, которую заменяет (study, sport и т.д.)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", backref="custom_categories")


class Group(Base):
    """Семейные группы"""
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Название группы
    description = Column(String, nullable=True)  # Описание группы
    invite_code = Column(String, unique=True, index=True, nullable=False)  # Уникальный код приглашения
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)  # Создатель группы
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)  # 1 = активна, 0 = удалена
    creator = relationship("User", foreign_keys=[created_by], backref="created_groups")
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")


class GroupMember(Base):
    """Участники группы"""
    __tablename__ = "group_members"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, default="member")  # "owner", "admin", "member"
    joined_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)  # 1 = активен, 0 = покинул группу
    group = relationship("Group", back_populates="members")
    user = relationship("User", backref="group_memberships")


class Challenge(Base):
    """Челленджи (совместные цели)"""
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=True)  # Если None - глобальный челлендж
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)  # Название челленджа
    description = Column(String, nullable=True)  # Описание
    target_xp = Column(Float, nullable=False)  # Целевое количество XP для каждого участника
    challenge_type = Column(String, default="xp")  # "xp" - по XP, "time" - по времени, "streak" - по серии дней
    start_date = Column(DateTime, nullable=False)  # Дата начала
    end_date = Column(DateTime, nullable=False)  # Дата окончания
    reward_xp = Column(Float, default=0.0)  # Бонус XP за выполнение
    is_active = Column(Integer, default=1)  # 1 = активен, 0 = завершен/отменен
    created_at = Column(DateTime, default=datetime.utcnow)
    creator = relationship("User", foreign_keys=[created_by], backref="created_challenges")
    group = relationship("Group", backref="challenges")
    participants = relationship("ChallengeParticipant", back_populates="challenge", cascade="all, delete-orphan")


class ChallengeParticipant(Base):
    """Участники челленджа"""
    __tablename__ = "challenge_participants"
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    current_progress = Column(Float, default=0.0)  # Текущий прогресс
    is_completed = Column(Integer, default=0)  # 1 = выполнен, 0 = в процессе
    completed_at = Column(DateTime, nullable=True)  # Дата выполнения
    joined_at = Column(DateTime, default=datetime.utcnow)
    challenge = relationship("Challenge", back_populates="participants")
    user = relationship("User", backref="challenge_participations")


class Achievement(Base):
    """Достижения пользователей для обмена"""
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_type = Column(String, nullable=False)  # Тип достижения: "streak", "level", "goal", "custom"
    title = Column(String, nullable=False)  # Название достижения
    description = Column(String, nullable=True)  # Описание
    icon = Column(String, nullable=True)  # Иконка (эмодзи или класс Font Awesome)
    earned_at = Column(DateTime, default=datetime.utcnow)  # Когда получено
    is_shared = Column(Integer, default=0)  # 1 = поделился, 0 = приватное
    shared_at = Column(DateTime, nullable=True)  # Когда поделился
    user = relationship("User", backref="achievements")