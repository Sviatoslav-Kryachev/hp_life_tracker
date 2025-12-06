from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.utils.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    wallet = relationship("XPWallet", back_populates="user", uselist=False)
    rewards = relationship("Reward", back_populates="user")
    activities = relationship("Activity", back_populates="user")
    activity_logs = relationship("ActivityLog", back_populates="user")
    timer_logs = relationship("TimerLog", back_populates="user")

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
    xp_per_hour = Column(Float, default=10.0)
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
