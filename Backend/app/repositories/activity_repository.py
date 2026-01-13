# app/repositories/activity_repository.py
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.base import Activity
from app.repositories.base_repository import BaseRepository


class ActivityRepository(BaseRepository[Activity]):
    """Репозиторий для работы с активностями"""
    
    def __init__(self, db: Session):
        super().__init__(Activity, db)
    
    def get_by_user_id(self, user_id: int) -> List[Activity]:
        """Получить все активности пользователя с сортировкой"""
        try:
            # Пытаемся использовать display_order, если поле существует
            if hasattr(Activity, 'display_order'):
                return self.db.query(Activity).filter(
                    Activity.user_id == user_id
                ).order_by(Activity.display_order.asc(), Activity.id.asc()).all()
            else:
                # Если поле еще не существует, сортируем только по ID
                return self.db.query(Activity).filter(
                    Activity.user_id == user_id
                ).order_by(Activity.id.asc()).all()
        except Exception as e:
            # Если ошибка при сортировке по display_order, используем сортировку по ID
            print(f"Error ordering by display_order: {e}")
            return self.db.query(Activity).filter(
                Activity.user_id == user_id
            ).order_by(Activity.id.asc()).all()
    
    def get_by_user_and_id(self, user_id: int, activity_id: int) -> Optional[Activity]:
        """Получить активность пользователя по ID"""
        return self.db.query(Activity).filter(
            Activity.id == activity_id,
            Activity.user_id == user_id
        ).first()
    
    def get_max_display_order(self, user_id: int) -> int:
        """Получить максимальный display_order для пользователя"""
        try:
            if hasattr(Activity, 'display_order'):
                max_order = self.db.query(func.max(Activity.display_order)).filter(
                    Activity.user_id == user_id
                ).scalar()
                return max_order or 0
            return 0
        except Exception:
            return 0
    
    def get_by_ids_and_user(self, activity_ids: List[int], user_id: int) -> List[Activity]:
        """Получить активности по списку ID, принадлежащие пользователю"""
        return self.db.query(Activity).filter(
            Activity.id.in_(activity_ids),
            Activity.user_id == user_id
        ).all()
    
    def update_display_order(self, activity_id: int, display_order: int) -> bool:
        """Обновить display_order активности"""
        activity = self.get_by_id(activity_id)
        if not activity or not hasattr(activity, 'display_order'):
            return False
        
        activity.display_order = display_order
        self.db.commit()
        self.db.refresh(activity)
        return True
