# app/routers/activities.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import User
from app.services.activity_service import ActivityService

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("/")
async def get_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все активности текущего пользователя"""
    return ActivityService.get_activities(db, current_user.id)


@router.post("/")
async def create_activity(
    activity_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новую активность"""
    return ActivityService.create_activity(db, current_user.id, activity_data)


@router.put("/{activity_id}")
async def update_activity(
    activity_id: int,
    activity_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить активность"""
    return ActivityService.update_activity(db, current_user.id, activity_id, activity_data)


@router.delete("/{activity_id}")
async def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить активность"""
    return ActivityService.delete_activity(db, current_user.id, activity_id)


class ReorderRequest(BaseModel):
    activity_ids: List[int]


@router.post("/reorder")
async def reorder_activities(
    request: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить порядок активностей"""
    return ActivityService.reorder_activities(db, current_user.id, request.activity_ids)
