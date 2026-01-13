from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime


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
