from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.utils.database import Base
from datetime import datetime


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
