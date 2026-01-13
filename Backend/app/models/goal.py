from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime


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
