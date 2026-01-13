from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.utils.database import Base
from datetime import datetime


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
