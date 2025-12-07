# app/routers/goals.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List

from app.models.base import Goal, Activity, ActivityLog, XPWallet, RewardPurchase
from app.schemas.goal import GoalCreate, GoalUpdate, GoalOut
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import User

router = APIRouter(prefix="/goals", tags=["goals"])


def update_goal_progress(db: Session, goal):
    """Обновить прогресс цели на основе заработанного XP или количества"""
    from app.models.base import Activity, ActivityLog, XPWallet, RewardPurchase
    from sqlalchemy import func
    
    if goal.is_completed == 1:
        return  # Цель уже выполнена
    
    # Получаем активность для проверки типа
    activity = None
    if goal.activity_id:
        activity = db.query(Activity).filter(Activity.id == goal.activity_id).first()
    
    # Если активность в штуках и есть целевое количество
    if activity and activity.unit_type == 'quantity' and goal.target_quantity:
        # Считаем количество из логов активности
        
        # Получаем количество из логов (для quantity типа нужно считать количество единиц)
        # Пока используем XP как индикатор количества (можно улучшить в будущем)
        earned_xp = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == goal.user_id,
            ActivityLog.activity_id == goal.activity_id,
            ActivityLog.end_time >= goal.created_at
        ).scalar() or 0
        
        # Вычисляем количество на основе XP (если xp_per_unit задан)
        if activity.xp_per_unit and activity.xp_per_unit > 0:
            current_quantity = earned_xp / activity.xp_per_unit
            goal.current_quantity = min(current_quantity, goal.target_quantity)
        else:
            goal.current_quantity = 0
        
        goal.current_xp = min(earned_xp, goal.target_xp)
        
        # Проверяем, выполнена ли цель по количеству
        if goal.current_quantity >= goal.target_quantity and goal.is_completed == 0:
            goal.is_completed = 1
            goal.completed_at = datetime.utcnow()
            goal.current_xp = goal.target_xp  # Устанавливаем на максимум
            
            # Начисляем бонус XP за достижение цели
            bonus_xp = goal.completion_bonus_xp or 0.0
            if bonus_xp > 0:
                from app.models.base import XPWallet, RewardPurchase
                wallet = db.query(XPWallet).filter(XPWallet.user_id == goal.user_id).first()
                if wallet:
                    wallet.balance += bonus_xp
                    wallet.total_earned += bonus_xp
                    # Повышение уровня
                    if wallet.total_earned >= wallet.level * 1000:
                        wallet.level += 1
                
                # Добавляем запись в историю транзакций
                purchase = RewardPurchase(
                    user_id=goal.user_id,
                    reward_name=f"🎯 Достижение цели: {goal.title}",
                    xp_spent=-bonus_xp,  # Отрицательное значение означает заработок
                    purchased_at=datetime.utcnow()
                )
                db.add(purchase)
    else:
        # Для активностей во времени или целей без количества
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
            
            # Начисляем бонус XP за достижение цели
            bonus_xp = goal.completion_bonus_xp or 0.0
            if bonus_xp > 0:
                from app.models.base import XPWallet, RewardPurchase
                wallet = db.query(XPWallet).filter(XPWallet.user_id == goal.user_id).first()
                if wallet:
                    wallet.balance += bonus_xp
                    wallet.total_earned += bonus_xp
                    # Повышение уровня
                    if wallet.total_earned >= wallet.level * 1000:
                        wallet.level += 1
                
                # Добавляем запись в историю транзакций
                purchase = RewardPurchase(
                    user_id=goal.user_id,
                    reward_name=f"🎯 Достижение цели: {goal.title}",
                    xp_spent=-bonus_xp,  # Отрицательное значение означает заработок
                    purchased_at=datetime.utcnow()
                )
                db.add(purchase)
    
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
        
        # Обеспечиваем значения по умолчанию для новых полей
        goal_dict = {
            **goal.__dict__,
            "activity_name": activity_name,
            "progress_percent": min(progress_percent, 100)
        }
        # Устанавливаем значения по умолчанию для новых полей, если они None
        if goal_dict.get('target_quantity') is None:
            goal_dict['target_quantity'] = None
        if goal_dict.get('current_quantity') is None:
            goal_dict['current_quantity'] = 0.0
        if goal_dict.get('completion_bonus_xp') is None:
            goal_dict['completion_bonus_xp'] = 0.0
        
        result.append(goal_dict)
    
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
        target_quantity=goal_data.target_quantity,
        completion_bonus_xp=goal_data.completion_bonus_xp or 0.0,
        target_date=goal_data.target_date,
        activity_id=goal_data.activity_id,
        current_xp=0.0,
        current_quantity=0.0,
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
    
    if goal.is_completed == 1:
        raise HTTPException(status_code=400, detail="Цель уже выполнена")
    
    goal.is_completed = 1
    goal.completed_at = datetime.utcnow()
    goal.current_xp = goal.target_xp  # Устанавливаем на максимум
    
    # Начисляем бонус XP за достижение цели
    bonus_xp = goal.completion_bonus_xp or 0.0
    if bonus_xp > 0:
        wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
        if wallet:
            wallet.balance += bonus_xp
            wallet.total_earned += bonus_xp
            # Повышение уровня
            if wallet.total_earned >= wallet.level * 1000:
                wallet.level += 1
        
        # Добавляем запись в историю транзакций
        purchase = RewardPurchase(
            user_id=current_user.id,
            reward_name=f"🎯 Достижение цели: {goal.title}",
            xp_spent=-bonus_xp,  # Отрицательное значение означает заработок
            purchased_at=datetime.utcnow()
        )
        db.add(purchase)
    
    db.commit()
    db.refresh(goal)
    
    return {
        "message": "Цель отмечена как выполненная",
        "goal": goal,
        "bonus_xp": bonus_xp
    }




