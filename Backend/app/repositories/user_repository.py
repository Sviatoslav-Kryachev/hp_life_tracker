# app/repositories/user_repository.py
from typing import Optional
from sqlalchemy.orm import Session
from app.models.base import User, XPWallet
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """Репозиторий для работы с пользователями"""
    
    def __init__(self, db: Session):
        super().__init__(User, db)
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Получить пользователя по email"""
        return self.get_by_field("email", email)
    
    def get_by_username(self, username: str) -> Optional[User]:
        """Получить пользователя по username"""
        return self.get_by_field("username", username)
    
    def get_by_telegram_id(self, telegram_id: int) -> Optional[User]:
        """Получить пользователя по Telegram ID"""
        return self.get_by_field("telegram_id", telegram_id)
    
    def get_by_invite_code(self, invite_code: str) -> Optional[User]:
        """Получить пользователя по коду приглашения"""
        return self.get_by_field("invite_code", invite_code)
    
    def get_wallet(self, user_id: int) -> Optional[XPWallet]:
        """Получить кошелёк пользователя"""
        return self.db.query(XPWallet).filter(XPWallet.user_id == user_id).first()
    
    def get_or_create_wallet(self, user_id: int) -> XPWallet:
        """Получить или создать кошелёк пользователя"""
        wallet = self.get_wallet(user_id)
        if not wallet:
            wallet = XPWallet(
                user_id=user_id,
                balance=0.0,
                level=1,
                total_earned=0.0,
                total_spent=0.0
            )
            self.db.add(wallet)
            self.db.commit()
            self.db.refresh(wallet)
        return wallet
    
    def get_children(self, user_id: int) -> list[User]:
        """Получить всех детей (подопечных) пользователя"""
        user = self.get_by_id(user_id)
        if not user:
            return []
        return user.children if hasattr(user, 'children') else []
    
    def get_parent(self, user_id: int) -> Optional[User]:
        """Получить родителя пользователя"""
        user = self.get_by_id(user_id)
        if not user or not user.parent_id:
            return None
        return self.get_by_id(user.parent_id)
    
    def is_admin(self, user_id: int) -> bool:
        """Проверить, является ли пользователь администратором"""
        user = self.get_by_id(user_id)
        return user is not None and user.is_admin == 1
