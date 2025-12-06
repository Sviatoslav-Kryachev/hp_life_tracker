# app/routers/timer.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import Activity, ActivityLog, TimerLog, XPWallet, User
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

    log.end_time = datetime.utcnow()
    
    # Считаем по секундам для точности (даже если работал меньше минуты)
    total_seconds = (log.end_time - log.start_time).total_seconds()
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
    from app.routers.streak import update_streak as update_streak_func
    streak_result = update_streak_func(db, current_user.id)
    
    return {
        "duration_minutes": log.duration_minutes, 
        "xp_earned": log.xp_earned,
        "wallet_balance": wallet.balance if wallet else 0, 
        "level": wallet.level if wallet else 1,
        "streak_bonus": streak_result.get("bonus_xp", 0),
        "streak_message": streak_result.get("message", "")
    }


@router.post("/manual")
async def add_manual_time(
    timer_data: ManualTimeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Добавить время вручную"""
    activity = db.query(Activity).filter(
        Activity.id == timer_data.activity_id, 
        Activity.user_id == current_user.id
    ).first()
    
    if not activity:
        raise HTTPException(status_code=404, detail="Активность не найдена")

    timer_log = TimerLog(
        user_id=current_user.id,
        activity_id=timer_data.activity_id,
        start_time=datetime.utcnow() - timedelta(minutes=timer_data.minutes),
        duration_minutes=timer_data.minutes
    )
    db.add(timer_log)
    db.flush()

    xp_earned = (timer_data.minutes / 60) * activity.xp_per_hour
    
    wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
    if wallet:
        wallet.balance += xp_earned
        wallet.total_earned += xp_earned
        # Повышение уровня
        if wallet.total_earned >= wallet.level * 1000:
            wallet.level += 1
    
    db.commit()

    return {"xp_earned": xp_earned, "log_id": timer_log.id}


@router.get("/active")
async def get_active_timers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить активные таймеры пользователя"""
    active_logs = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time == None
    ).all()
    
    return [
        {
            "log_id": log.id,
            "activity_id": log.activity_id,
            "activity_name": log.activity.name,
            "start_time": log.start_time.isoformat(),
            "xp_per_hour": log.activity.xp_per_hour
        }
        for log in active_logs
    ]
