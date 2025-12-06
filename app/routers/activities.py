# app/routers/activities.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
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
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
    return activities


@router.post("/")
async def create_activity(
    activity_data: dict, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новую активность"""
    # Убираем category если передано (поля нет в модели)
    activity_data.pop('category', None)
    
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
    
    # Убираем category если передано (поля нет в модели)
    activity_data.pop('category', None)
    
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
