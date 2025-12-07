# app/routers/activities.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import Activity, User

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("/")
async def get_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все активности текущего пользователя"""
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).order_by(Activity.display_order.asc(), Activity.id.asc()).all()
    # Обеспечиваем значения по умолчанию для новых полей
    result = []
    for activity in activities:
        activity_dict = {
            "id": activity.id,
            "name": activity.name,
            "category": activity.category or "general",
            "xp_per_hour": activity.xp_per_hour or 60.0,
            "unit_type": activity.unit_type if hasattr(activity, 'unit_type') and activity.unit_type else "time",
            "xp_per_unit": activity.xp_per_unit if hasattr(activity, 'xp_per_unit') else None,
            "display_order": getattr(activity, 'display_order', 0) or 0,
            "color": getattr(activity, 'color', "#3498db"),
            "created_at": getattr(activity, 'created_at', None)
        }
        result.append(activity_dict)
    return result


@router.post("/")
async def create_activity(
    activity_data: dict, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новую активность"""
    # Устанавливаем category по умолчанию если не передано
    if 'category' not in activity_data or not activity_data.get('category'):
        activity_data['category'] = 'general'
    
    activity = Activity(user_id=current_user.id, **activity_data)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


@router.put("/{activity_id}")
async def update_activity(
    activity_id: int, 
    activity_data: dict, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить активность"""
    activity = db.query(Activity).filter(
        Activity.id == activity_id, 
        Activity.user_id == current_user.id
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
    return activity


@router.delete("/{activity_id}")
async def delete_activity(
    activity_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить активность"""
    activity = db.query(Activity).filter(
        Activity.id == activity_id,
        Activity.user_id == current_user.id
    ).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Активность не найдена")
    
    db.delete(activity)
    db.commit()
    return {"message": "Активность удалена"}


class ReorderRequest(BaseModel):
    activity_ids: List[int]

@router.post("/reorder")
async def reorder_activities(
    request: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить порядок активностей"""
    activity_ids = request.activity_ids
    
    # Проверяем, что все активности принадлежат пользователю
    activities = db.query(Activity).filter(
        Activity.id.in_(activity_ids),
        Activity.user_id == current_user.id
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
