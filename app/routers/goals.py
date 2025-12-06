# app/routers/goals.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List

from app.models.base import Goal, Activity, ActivityLog
from app.schemas.goal import GoalCreate, GoalUpdate, GoalOut
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import User

router = APIRouter(prefix="/goals", tags=["goals"])


def update_goal_progress(db: Session, goal: Goal):
    """Обновить прогресс цели на основе заработанного XP"""
    if goal.is_completed == 1:
        return  # Цель уже выполнена
    
    # Если цель привязана к активности, считаем XP только от неё
    if goal.activity_id:
        earned_xp = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == goal.user_id,
            ActivityLog.activity_id == goal.activity_id,
            ActivityLog.end_time >= goal.created_at
        ).scalar() or 0
    else:
        # Если не привязана, считаем весь XP с момента создания цели
        earned_xp = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == goal.user_id,
            ActivityLog.end_time >= goal.created_at
        ).scalar() or 0
    
    goal.current_xp = min(earned_xp, goal.target_xp)  # Не превышаем цель
    
    # Проверяем, выполнена ли цель
    if goal.current_xp >= goal.target_xp and goal.is_completed == 0:
        goal.is_completed = 1
        goal.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(goal)


@router.get("/", response_model=List[GoalOut])
async def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все цели пользователя"""
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.created_at.desc()).all()
    
    result = []
    for goal in goals:
        # Обновляем прогресс
        update_goal_progress(db, goal)
        
        # Получаем название активности если есть
        activity_name = None
        if goal.activity_id:
            activity = db.query(Activity).filter(Activity.id == goal.activity_id).first()
            activity_name = activity.name if activity else None
        
        progress_percent = (goal.current_xp / goal.target_xp * 100) if goal.target_xp > 0 else 0
        
        result.append({
            **goal.__dict__,
            "activity_name": activity_name,
            "progress_percent": min(progress_percent, 100)
        })
    
    return result


@router.post("/", response_model=GoalOut)
async def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новую цель"""
    # Проверяем активность, если указана
    if goal_data.activity_id:
        activity = db.query(Activity).filter(
            Activity.id == goal_data.activity_id,
            Activity.user_id == current_user.id
        ).first()
        if not activity:
            raise HTTPException(status_code=404, detail="Активность не найдена")
    
    new_goal = Goal(
        user_id=current_user.id,
        title=goal_data.title,
        description=goal_data.description,
        target_xp=goal_data.target_xp,
        target_date=goal_data.target_date,
        activity_id=goal_data.activity_id,
        current_xp=0.0,
        is_completed=0
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    # Получаем название активности
    activity_name = None
    if new_goal.activity_id:
        activity = db.query(Activity).filter(Activity.id == new_goal.activity_id).first()
        activity_name = activity.name if activity else None
    
    return {
        **new_goal.__dict__,
        "activity_name": activity_name,
        "progress_percent": 0.0
    }


@router.put("/{goal_id}", response_model=GoalOut)
async def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить цель"""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    
    if goal.is_completed == 1:
        raise HTTPException(status_code=400, detail="Нельзя редактировать выполненную цель")
    
    # Обновляем поля
    if goal_data.title is not None:
        goal.title = goal_data.title
    if goal_data.description is not None:
        goal.description = goal_data.description
    if goal_data.target_xp is not None:
        goal.target_xp = goal_data.target_xp
    if goal_data.target_date is not None:
        goal.target_date = goal_data.target_date
    if goal_data.activity_id is not None:
        if goal_data.activity_id:
            activity = db.query(Activity).filter(
                Activity.id == goal_data.activity_id,
                Activity.user_id == current_user.id
            ).first()
            if not activity:
                raise HTTPException(status_code=404, detail="Активность не найдена")
        goal.activity_id = goal_data.activity_id
    
    # Обновляем прогресс
    update_goal_progress(db, goal)
    
    db.commit()
    db.refresh(goal)
    
    # Получаем название активности
    activity_name = None
    if goal.activity_id:
        activity = db.query(Activity).filter(Activity.id == goal.activity_id).first()
        activity_name = activity.name if activity else None
    
    progress_percent = (goal.current_xp / goal.target_xp * 100) if goal.target_xp > 0 else 0
    
    return {
        **goal.__dict__,
        "activity_name": activity_name,
        "progress_percent": min(progress_percent, 100)
    }


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить цель"""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    
    db.delete(goal)
    db.commit()
    
    return {"message": "Цель удалена"}


@router.post("/{goal_id}/complete")
async def complete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отметить цель как выполненную"""
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Цель не найдена")
    
    goal.is_completed = 1
    goal.completed_at = datetime.utcnow()
    goal.current_xp = goal.target_xp  # Устанавливаем на максимум
    
    db.commit()
    db.refresh(goal)
    
    return {"message": "Цель отмечена как выполненная", "goal": goal}

