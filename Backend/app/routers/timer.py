# app/routers/timer.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import pytz
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.base import Activity, ActivityLog, TimerLog, XPWallet, User, Goal
from app.schemas.models import ManualTimeCreate

router = APIRouter(prefix="/timer", tags=["timer"])


@router.post("/start")
async def start_timer(
    activity_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Запустить таймер для активности"""
    activity = db.query(Activity).filter(
        Activity.id == activity_id,
        Activity.user_id == current_user.id
    ).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Активность не найдена")

    log = ActivityLog(
        user_id=current_user.id, 
        activity_id=activity_id, 
        start_time=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return {"log_id": log.id, "message": f"Таймер запущен для {activity.name}"}


@router.post("/stop/{log_id}")
async def stop_timer(
    log_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Остановить таймер"""
    log = db.query(ActivityLog).filter(
        ActivityLog.id == log_id,
        ActivityLog.user_id == current_user.id
    ).first()
    
    if not log or log.end_time:
        raise HTTPException(status_code=404, detail="Лог не найден или уже остановлен")

    end_time = datetime.utcnow()
    log.end_time = end_time
    
    # Убеждаемся, что оба datetime naive (без timezone) для корректного вычитания
    start_time = log.start_time
    if start_time.tzinfo is not None:
        # Если start_time aware (с timezone), конвертируем в UTC и убираем timezone
        start_time = start_time.astimezone(pytz.UTC).replace(tzinfo=None)
    
    # Считаем по секундам для точности (даже если работал меньше минуты)
    total_seconds = (end_time - start_time).total_seconds()
    log.duration_minutes = total_seconds / 60  # float для точности
    
    # XP за секунду = xp_per_hour / 3600
    xp_per_second = log.activity.xp_per_hour / 3600
    log.xp_earned = total_seconds * xp_per_second

    wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
    if wallet:
        wallet.balance += log.xp_earned
        wallet.total_earned += log.xp_earned
        # Повышение уровня каждые 1000 XP
        if wallet.total_earned >= wallet.level * 1000:
            wallet.level += 1
    
    db.commit()
    
    # Обновляем streak после завершения активности
    from app.services.streak_service import StreakService
    streak_result = StreakService.update_streak(db, current_user.id)
    
    # Обновляем прогресс целей
    from app.routers.goals import update_goal_progress
    from app.models.base import Goal
    user_goals = db.query(Goal).filter(
        Goal.user_id == current_user.id,
        Goal.is_completed == 0
    ).all()
    completed_goals = []
    for goal in user_goals:
        old_completed = goal.is_completed
        update_goal_progress(db, goal)
        if goal.is_completed == 1 and old_completed == 0:
            completed_goals.append(goal.title)
    
    # Обновляем прогресс в челленджах
    from app.routers.challenges import update_challenge_progress
    from app.models.base import ChallengeParticipant
    user_challenges = db.query(ChallengeParticipant).filter(
        ChallengeParticipant.user_id == current_user.id
    ).all()
    for challenge_participant in user_challenges:
        update_challenge_progress(db, challenge_participant.challenge_id, current_user.id)
    
    return {
        "duration_minutes": log.duration_minutes, 
        "xp_earned": log.xp_earned,
        "wallet_balance": wallet.balance if wallet else 0, 
        "level": wallet.level if wallet else 1,
        "streak_bonus": streak_result.get("bonus_xp", 0),
        "streak_message": streak_result.get("message", ""),
        "completed_goals": completed_goals
    }


@router.post("/manual")
async def add_manual_time(
    timer_data: ManualTimeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Добавить время или количество вручную"""
    activity = db.query(Activity).filter(
        Activity.id == timer_data.activity_id, 
        Activity.user_id == current_user.id
    ).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Активность не найдена")

    xp_earned = 0.0
    
    if activity.unit_type == "quantity":
        # Для активностей в штуках
        if timer_data.quantity is None or timer_data.quantity <= 0:
            raise HTTPException(status_code=400, detail="Укажите количество")
        
        if activity.xp_per_unit is None:
            raise HTTPException(status_code=400, detail="Не указано XP за единицу")
        
        xp_earned = timer_data.quantity * activity.xp_per_unit
        
        # Создаем лог активности
        activity_log = ActivityLog(
            user_id=current_user.id,
            activity_id=timer_data.activity_id,
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow(),
            duration_minutes=0.0,  # Для quantity не используем время
            xp_earned=xp_earned
        )
        db.add(activity_log)
    else:
        # Для активностей во времени
        if timer_data.minutes is None or timer_data.minutes <= 0:
            raise HTTPException(status_code=400, detail="Укажите время")
        
        timer_log = TimerLog(
            user_id=current_user.id,
            activity_id=timer_data.activity_id,
            start_time=datetime.utcnow() - timedelta(minutes=timer_data.minutes),
            duration_minutes=timer_data.minutes
        )
        db.add(timer_log)
        db.flush()
        
        xp_earned = (timer_data.minutes / 60) * activity.xp_per_hour
        
        # Создаем лог активности
        activity_log = ActivityLog(
            user_id=current_user.id,
            activity_id=timer_data.activity_id,
            start_time=timer_log.start_time,
            end_time=datetime.utcnow(),
            duration_minutes=timer_data.minutes,
            xp_earned=xp_earned
        )
        db.add(activity_log)
    
    db.flush()
    
    wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
    if wallet:
        wallet.balance += xp_earned
        wallet.total_earned += xp_earned
        # Повышение уровня
        if wallet.total_earned >= wallet.level * 1000:
            wallet.level += 1
    
    # Обновляем прогресс целей
    from app.routers.goals import update_goal_progress
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id,
        Goal.activity_id == timer_data.activity_id,
        Goal.is_completed == 0
    ).all()
    for goal in goals:
        update_goal_progress(db, goal)
    
    # Обновляем прогресс в челленджах
    from app.routers.challenges import update_challenge_progress
    from app.models.base import ChallengeParticipant
    user_challenges = db.query(ChallengeParticipant).filter(
        ChallengeParticipant.user_id == current_user.id
    ).all()
    for challenge_participant in user_challenges:
        update_challenge_progress(db, challenge_participant.challenge_id, current_user.id)
    
    db.commit()

    return {"xp_earned": xp_earned, "log_id": activity_log.id}


@router.get("/active")
async def get_active_timers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить активные таймеры пользователя"""
    from sqlalchemy.orm import joinedload
    
    active_logs = db.query(ActivityLog).options(
        joinedload(ActivityLog.activity)
    ).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time == None
    ).all()
    
    result = []
    for log in active_logs:
        # Проверяем, что активность существует
        if log.activity:
            result.append({
                "log_id": log.id,
                "activity_id": log.activity_id,
                "activity_name": log.activity.name,
                "start_time": log.start_time.isoformat(),
                "xp_per_hour": log.activity.xp_per_hour
            })
        else:
            # Если активность удалена, пропускаем этот лог
            # Или можно вернуть информацию без имени активности
            result.append({
                "log_id": log.id,
                "activity_id": log.activity_id,
                "activity_name": "Неизвестная активность",
                "start_time": log.start_time.isoformat(),
                "xp_per_hour": 0
            })
    
    return result
