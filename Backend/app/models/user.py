from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


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
