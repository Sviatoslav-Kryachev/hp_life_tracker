# app/services/reward_service.py
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from fastapi import HTTPException
from app.models.base import Reward, XPWallet, RewardPurchase, BlacklistReward
from app.schemas import RewardCreate


class RewardService:
    """Сервис для работы с наградами"""
    
    @staticmethod
    def get_rewards(db: Session, user_id: int) -> List[Reward]:
        """Получить все награды (и общие, и пользователя)"""
        # Возвращаем награды пользователя + общие (user_id = None)
        # Сортируем по ID по возрастанию: старые сверху, новые внизу
        rewards = db.query(Reward).filter(
            (Reward.user_id == user_id) | (Reward.user_id == None)
        ).order_by(Reward.id.asc()).all()
        return rewards
    
    @staticmethod
    def create_reward(db: Session, user_id: int, reward: RewardCreate) -> Reward:
        """Создать новую награду"""
        new_reward = Reward(user_id=user_id, **reward.model_dump())
        db.add(new_reward)
        db.commit()
        db.refresh(new_reward)
        return new_reward
    
    @staticmethod
    def update_reward(db: Session, user_id: int, reward_id: int, reward_data: RewardCreate) -> Reward:
        """Обновить награду"""
        reward = db.query(Reward).filter(
            Reward.id == reward_id,
            Reward.user_id == user_id
        ).first()
        
        if not reward:
            raise HTTPException(status_code=404, detail="Награда не найдена")
        
        for field, value in reward_data.model_dump().items():
            setattr(reward, field, value)
        
        db.commit()
        db.refresh(reward)
        return reward
    
    @staticmethod
    def delete_reward(db: Session, user_id: int, reward_id: int) -> Dict[str, str]:
        """Удалить награду"""
        reward = db.query(Reward).filter(
            Reward.id == reward_id,
            Reward.user_id == user_id
        ).first()
        
        if not reward:
            raise HTTPException(status_code=404, detail="Награда не найдена")
        
        db.delete(reward)
        db.commit()
        return {"message": "Награда удалена"}
    
    @staticmethod
    def spend_reward(db: Session, user_id: int, reward_id: int) -> Dict[str, Any]:
        """Потратить XP на награду"""
        reward = db.query(Reward).filter(Reward.id == reward_id).first()
        if not reward:
            raise HTTPException(status_code=404, detail="Награда не найдена")
        
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user_id).first()
        if not wallet:
            raise HTTPException(status_code=404, detail="Кошелёк не найден")
        
        # Проверяем черный список
        blacklist_items = db.query(BlacklistReward).filter(
            BlacklistReward.user_id == user_id,
            BlacklistReward.is_active == 1
        ).all()
        
        for item in blacklist_items:
            if item.reward_name_pattern.lower() in reward.name.lower():
                # Награда в черном списке - требуем XP
                if wallet.balance < reward.xp_cost:
                    raise HTTPException(
                        status_code=403,
                        detail=f"⚠️ '{reward.name}' заблокирована! Нужно {reward.xp_cost} XP для доступа. У вас: {wallet.balance} XP"
                    )
        
        if wallet.balance < reward.xp_cost:
            raise HTTPException(status_code=400, detail="Недостаточно XP")
        
        wallet.balance -= reward.xp_cost
        wallet.total_spent += reward.xp_cost
        
        # Сохраняем в историю покупок
        purchase = RewardPurchase(
            user_id=user_id,
            reward_name=reward.name,
            xp_spent=reward.xp_cost
        )
        db.add(purchase)
        db.commit()
        
        return {
            "reward": reward.name,
            "spent": reward.xp_cost,
            "new_balance": wallet.balance
        }
    
    @staticmethod
    def get_purchase_history(db: Session, user_id: int, limit: int = 20) -> List[Dict[str, Any]]:
        """Получить историю покупок наград"""
        purchases = db.query(RewardPurchase).filter(
            RewardPurchase.user_id == user_id
        ).order_by(RewardPurchase.purchased_at.desc()).limit(limit).all()
        
        return [
            {
                "id": p.id,
                "reward_name": p.reward_name,
                "xp_spent": p.xp_spent,
                "date": p.purchased_at.isoformat()
            }
            for p in purchases
        ]
