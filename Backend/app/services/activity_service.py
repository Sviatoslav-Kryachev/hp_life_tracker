# app/services/activity_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from fastapi import HTTPException
from app.models.base import Activity


class ActivityService:
    """Сервис для работы с активностями"""
    
    @staticmethod
    def get_activities(db: Session, user_id: int) -> List[Dict[str, Any]]:
        """Получить все активности пользователя"""
        try:
            # Пытаемся использовать display_order, если поле существует
            if hasattr(Activity, 'display_order'):
                activities = db.query(Activity).filter(
                    Activity.user_id == user_id
                ).order_by(Activity.display_order.asc(), Activity.id.asc()).all()
            else:
                # Если поле еще не существует, сортируем только по ID
                activities = db.query(Activity).filter(
                    Activity.user_id == user_id
                ).order_by(Activity.id.asc()).all()
        except Exception as e:
            # Если ошибка при сортировке по display_order, используем сортировку по ID
            print(f"Error ordering by display_order: {e}")
            activities = db.query(Activity).filter(
                Activity.user_id == user_id
            ).order_by(Activity.id.asc()).all()
        
        # Обеспечиваем значения по умолчанию для новых полей
        result = []
        for activity in activities:
            # Получаем created_at, если поле существует
            created_at = None
            if hasattr(activity, 'created_at') and activity.created_at:
                created_at = activity.created_at.isoformat() if hasattr(activity.created_at, 'isoformat') else str(activity.created_at)
            
            activity_dict = {
                "id": activity.id,
                "name": activity.name,
                "category": activity.category or "general",
                "xp_per_hour": activity.xp_per_hour or 60.0,
                "unit_type": activity.unit_type if hasattr(activity, 'unit_type') and activity.unit_type else "time",
                "xp_per_unit": activity.xp_per_unit if hasattr(activity, 'xp_per_unit') else None,
                "display_order": getattr(activity, 'display_order', 0) or 0,
                "color": getattr(activity, 'color', "#3498db"),
                "created_at": created_at
            }
            result.append(activity_dict)
        return result
    
    @staticmethod
    def create_activity(db: Session, user_id: int, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Создать новую активность"""
        # Устанавливаем category по умолчанию если не передано
        if 'category' not in activity_data or not activity_data.get('category'):
            activity_data['category'] = 'general'
        
        # Устанавливаем display_order если не передано (ставим в конец списка)
        if 'display_order' not in activity_data and hasattr(Activity, 'display_order'):
            try:
                max_order = db.query(func.max(Activity.display_order)).filter(
                    Activity.user_id == user_id
                ).scalar() or 0
                activity_data['display_order'] = max_order + 1
            except Exception:
                # Если поле еще не существует, не устанавливаем его
                pass
        
        activity = Activity(user_id=user_id, **activity_data)
        db.add(activity)
        db.commit()
        db.refresh(activity)
        
        # Возвращаем в том же формате, что и get_activities
        created_at = None
        if hasattr(activity, 'created_at') and activity.created_at:
            created_at = activity.created_at.isoformat() if hasattr(activity.created_at, 'isoformat') else str(activity.created_at)
        
        return {
            "id": activity.id,
            "name": activity.name,
            "category": activity.category or "general",
            "xp_per_hour": activity.xp_per_hour or 60.0,
            "unit_type": activity.unit_type if hasattr(activity, 'unit_type') and activity.unit_type else "time",
            "xp_per_unit": activity.xp_per_unit if hasattr(activity, 'xp_per_unit') else None,
            "display_order": getattr(activity, 'display_order', 0) or 0,
            "color": getattr(activity, 'color', "#3498db"),
            "created_at": created_at
        }
    
    @staticmethod
    def update_activity(db: Session, user_id: int, activity_id: int, activity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Обновить активность"""
        activity = db.query(Activity).filter(
            Activity.id == activity_id,
            Activity.user_id == user_id
        ).first()
        
        if not activity:
            raise HTTPException(status_code=404, detail="Активность не найдена")
        
        # Устанавливаем category по умолчанию если не передано
        if 'category' in activity_data and not activity_data.get('category'):
            activity_data['category'] = 'general'
        
        for field, value in activity_data.items():
            if hasattr(activity, field):
                setattr(activity, field, value)
        
        db.commit()
        db.refresh(activity)
        
        # Возвращаем в том же формате, что и get_activities
        created_at = None
        if hasattr(activity, 'created_at') and activity.created_at:
            created_at = activity.created_at.isoformat() if hasattr(activity.created_at, 'isoformat') else str(activity.created_at)
        
        return {
            "id": activity.id,
            "name": activity.name,
            "category": activity.category or "general",
            "xp_per_hour": activity.xp_per_hour or 60.0,
            "unit_type": activity.unit_type if hasattr(activity, 'unit_type') and activity.unit_type else "time",
            "xp_per_unit": activity.xp_per_unit if hasattr(activity, 'xp_per_unit') else None,
            "display_order": getattr(activity, 'display_order', 0) or 0,
            "color": getattr(activity, 'color', "#3498db"),
            "created_at": created_at
        }
    
    @staticmethod
    def delete_activity(db: Session, user_id: int, activity_id: int) -> Dict[str, str]:
        """Удалить активность"""
        activity = db.query(Activity).filter(
            Activity.id == activity_id,
            Activity.user_id == user_id
        ).first()
        
        if not activity:
            raise HTTPException(status_code=404, detail="Активность не найдена")
        
        db.delete(activity)
        db.commit()
        return {"message": "Активность удалена"}
    
    @staticmethod
    def reorder_activities(db: Session, user_id: int, activity_ids: List[int]) -> Dict[str, str]:
        """Обновить порядок активностей"""
        # Проверяем, существует ли поле display_order
        if not hasattr(Activity, 'display_order'):
            return {"message": "Поле display_order еще не создано. Примените миграцию базы данных."}
        
        # Проверяем, что все активности принадлежат пользователю
        activities = db.query(Activity).filter(
            Activity.id.in_(activity_ids),
            Activity.user_id == user_id
        ).all()
        
        if len(activities) != len(activity_ids):
            raise HTTPException(status_code=400, detail="Некоторые активности не найдены")
        
        # Обновляем порядок
        for order, activity_id in enumerate(activity_ids):
            activity = next((a for a in activities if a.id == activity_id), None)
            if activity:
                activity.display_order = order
        
        db.commit()
        return {"message": "Порядок активностей обновлен"}
