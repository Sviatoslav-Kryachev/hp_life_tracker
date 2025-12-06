from sqlalchemy.orm import Session
from app.models.base import Reward

def init_system_rewards(db: Session, user_id: int = 1):
    rewards = [
        {"name": "Welcome Badge", "description": "First reward", "xp_cost": 0},
        {"name": "Starter Pack", "description": "Basic reward", "xp_cost": 10},
    ]
    for r in rewards:
        existing = db.query(Reward).filter(Reward.user_id == user_id, Reward.name == r["name"]).first()
        if not existing:
            reward = Reward(user_id=user_id, **r)
            db.add(reward)
    db.commit()
