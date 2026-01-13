from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.utils.database import Base
from datetime import datetime


class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    description = Column(String)
    xp_cost = Column(Float, default=0.0)
    user = relationship("User", back_populates="rewards")


class RewardPurchase(Base):
    """История покупок наград"""
    __tablename__ = "reward_purchases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reward_name = Column(String, nullable=False)
    xp_spent = Column(Float, default=0.0)
    purchased_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", backref="purchases")


class BlacklistReward(Base):
    """Черный список наград (требуют XP для доступа)"""
    __tablename__ = "blacklist_rewards"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reward_name_pattern = Column(String, nullable=False)  # Паттерн названия (например, "YouTube", "Instagram")
    is_active = Column(Integer, default=1)  # 1 = активен, 0 = отключен
    user = relationship("User", backref="blacklist")
