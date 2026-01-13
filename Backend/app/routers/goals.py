# app/routers/goals.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List
import pytz

from app.models.base import Goal, Activity, ActivityLog, XPWallet, RewardPurchase
from app.schemas.goal import GoalCreate, GoalUpdate, GoalOut
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import User

router = APIRouter(prefix="/goals", tags=["goals"])

# Берлинское время (Europe/Berlin)
BERLIN_TZ = pytz.timezone('Europe/Berlin')

def get_berlin_time():
    """Получить текущее время по Берлинскому времени, конвертированное в UTC для сохранения в БД"""
    berlin_time = datetime.now(BERLIN_TZ)
    # Конвертируем в UTC для сохранения в БД (SQLAlchemy сохранит как UTC)
    return berlin_time.astimezone(pytz.UTC).replace(tzinfo=None)


def format_goal_achievement_description(db: Session, goal):
    """Формирует описание достижения цели для истории транзакций"""
    # Получаем название активности, если есть
    activity_name = None
    if goal.activity_id:
        activity = db.query(Activity).filter(Activity.id == goal.activity_id).first()
        if activity:
            activity_name = activity.name
    
    # Определяем название цели: если есть title (комментарий), используем его, иначе название активности
    goal_name = goal.title if goal.title else (activity_name if activity_name else "Цель")
    
    # Формируем описание с прогрессом
    # Проверяем, есть ли целевое количество и оно больше 0
    if goal.target_quantity is not None and goal.target_quantity > 0:
        # Цель по количеству
        current_qty = int(goal.current_quantity) if goal.current_quantity and goal.current_quantity > 0 else int(goal.target_quantity)
        target_qty = int(goal.target_quantity)
        progress_text = f"{current_qty} / {target_qty} штук"
    else:
        # Цель по XP
        current_xp = int(goal.current_xp) if goal.current_xp and goal.current_xp > 0 else int(goal.target_xp)
        target_xp = int(goal.target_xp)
        progress_text = f"{current_xp} / {target_xp} XP"
    
    # Добавляем дату дедлайна, если она есть
    deadline_text = ""
    if goal.target_date:
        # Конвертируем в Берлинское время для форматирования
        if goal.target_date.tzinfo is None:
            # Если дата без timezone, считаем что это UTC
            target_date_utc = pytz.UTC.localize(goal.target_date)
        else:
            target_date_utc = goal.target_date
        
        # Конвертируем в Берлинское время
        target_date_berlin = target_date_utc.astimezone(BERLIN_TZ)
        # Форматируем дату в формате ДД.ММ.ГГГГ
        deadline_text = f" до {target_date_berlin.strftime('%d.%m.%Y')}"
    
    # Убеждаемся, что описание не пустое и содержит все необходимые данные
    # Проверяем, что goal_name не пустой
    if not goal_name or goal_name.strip() == "":
        goal_name = "Цель"  # Fallback значение
    
    # Убеждаемся, что progress_text не пустой
    if not progress_text or progress_text.strip() == "":
        # Если progress_text пустой, формируем его заново
        if goal.target_quantity is not None and goal.target_quantity > 0:
            current_qty = int(goal.current_quantity) if goal.current_quantity else int(goal.target_quantity)
            target_qty = int(goal.target_quantity)
            progress_text = f"{current_qty} / {target_qty} штук"
        else:
            current_xp = int(goal.current_xp) if goal.current_xp else int(goal.target_xp)
            target_xp = int(goal.target_xp)
            progress_text = f"{current_xp} / {target_xp} XP"
    
    # Формируем описание - убеждаемся, что все части не пустые
    # Если goal_name пустой, используем "Цель"
    if not goal_name or goal_name.strip() == "":
        goal_name = "Цель"
    
    # Если progress_text пустой, формируем его заново
    if not progress_text or progress_text.strip() == "":
        if goal.target_quantity is not None and goal.target_quantity > 0:
            current_qty = int(goal.current_quantity) if goal.current_quantity else int(goal.target_quantity)
            target_qty = int(goal.target_quantity)
            progress_text = f"{current_qty} / {target_qty} штук"
        else:
            current_xp = int(goal.current_xp) if goal.current_xp else int(goal.target_xp)
            target_xp = int(goal.target_xp)
            progress_text = f"{current_xp} / {target_xp} XP"
    
    # Формируем описание - гарантируем, что оно не пустое
    description = f"🎯 Достижение цели: {goal_name} ({progress_text}){deadline_text}"
    
    # Дополнительная проверка - если описание все еще пустое или содержит только "🎯 Достижение цели:", добавляем информацию
    if description.strip() == "🎯 Достижение цели:" or description.strip() == "🎯 Достижение цели: ()":
        # Если описание пустое, добавляем хотя бы базовую информацию
        if goal.target_quantity is not None and goal.target_quantity > 0:
            description = f"🎯 Достижение цели: {goal_name} ({int(goal.target_quantity)} / {int(goal.target_quantity)} штук){deadline_text}"
        else:
            description = f"🎯 Достижение цели: {goal_name} ({int(goal.target_xp)} / {int(goal.target_xp)} XP){deadline_text}"
    
    return description


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
            goal.completed_at = get_berlin_time()
            goal.current_xp = goal.target_xp  # Устанавливаем на максимум
            goal.current_quantity = goal.target_quantity  # Устанавливаем на максимум для правильного отображения
            
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
                    
                    # Добавляем запись в историю транзакций только если кошелек найден
                    purchase = RewardPurchase(
                        user_id=goal.user_id,
                        reward_name=format_goal_achievement_description(db, goal),
                        xp_spent=-bonus_xp,  # Отрицательное значение означает заработок
                        purchased_at=get_berlin_time()
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
            goal.completed_at = get_berlin_time()
            goal.current_xp = goal.target_xp  # Устанавливаем на максимум для правильного отображения
            
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
                    
                    # Добавляем запись в историю транзакций только если кошелек найден
                    purchase = RewardPurchase(
                        user_id=goal.user_id,
                        reward_name=format_goal_achievement_description(db, goal),
                        xp_spent=-bonus_xp,  # Отрицательное значение означает заработок
                        purchased_at=get_berlin_time()
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
    goal.completed_at = get_berlin_time()
    goal.current_xp = goal.target_xp  # Устанавливаем на максимум
    
    # Если цель по количеству, устанавливаем текущее количество на целевое
    if goal.target_quantity:
        goal.current_quantity = goal.target_quantity
    
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
            
            # Добавляем запись в историю транзакций только если кошелек найден
            purchase = RewardPurchase(
                user_id=current_user.id,
                reward_name=format_goal_achievement_description(db, goal),
                xp_spent=-bonus_xp,  # Отрицательное значение означает заработок
                purchased_at=get_berlin_time()
            )
            db.add(purchase)
    
    db.commit()
    db.refresh(goal)
    
    return {
        "message": "Цель отмечена как выполненная",
        "goal": goal,
        "bonus_xp": bonus_xp
    }




