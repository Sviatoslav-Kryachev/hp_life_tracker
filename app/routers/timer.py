from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.utils.database import get_db
from app.models.base import Activity, ActivityLog, TimerLog, XPWallet, User  # ✅ + User
from app.schemas.models import ManualTimeCreate

router = APIRouter(prefix="/timer", tags=["timer"])


def get_current_user(db: Session):
    """Получаем текущего пользователя по email из токена"""
    return db.query(User).filter(User.email == "test@test.com").first()


@router.post("/start")
def start_timer(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    log = ActivityLog(user_id=user.id, activity_id=activity_id, start_time=datetime.utcnow())
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"log_id": log.id, "message": f"Таймер запущен для {activity.name}"}


@router.post("/stop/{log_id}")
def stop_timer(log_id: int, db: Session = Depends(get_db)):
    log = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
    if not log or log.end_time:
        raise HTTPException(status_code=404, detail="Log not found or already stopped")

    log.end_time = datetime.utcnow()
    log.duration_minutes = int((log.end_time - log.start_time).total_seconds() / 60)
    xp_rate = log.activity.xp_per_hour / 60
    log.xp_earned = log.duration_minutes * xp_rate

    user = get_current_user(db)
    wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
    if wallet:
        wallet.balance += log.xp_earned
        wallet.total_earned += log.xp_earned
        if wallet.balance >= wallet.level * 1000:
            wallet.level += 1
        db.commit()

    return {"duration_minutes": log.duration_minutes, "xp_earned": log.xp_earned,
            "wallet_balance": wallet.balance, "level": wallet.level}


@router.post("/manual")
def add_manual_time(timer_data: ManualTimeCreate, db: Session = Depends(get_db)):
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    activity = db.query(Activity).filter(Activity.id == timer_data.activity_id, Activity.user_id == user.id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    timer_log = TimerLog(
        user_id=user.id,
        activity_id=timer_data.activity_id,
        start_time=datetime.utcnow() - timedelta(minutes=timer_data.minutes),
        duration_minutes=timer_data.minutes
    )
    db.add(timer_log)
    db.flush()

    xp_earned = (timer_data.minutes / 60) * activity.xp_per_hour
    wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
    if wallet:
        wallet.balance += xp_earned
        wallet.total_earned += xp_earned
        db.commit()

    return {"xp_earned": xp_earned, "log_id": timer_log.id}
