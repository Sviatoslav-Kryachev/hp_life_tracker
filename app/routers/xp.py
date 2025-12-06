from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.database import get_db
from app.models.base import XPWallet, ActivityLog, User  # ✅ + User

router = APIRouter(prefix="/xp", tags=["xp"])


@router.get("/wallet")
def get_wallet(db: Session = Depends(get_db)):
    # БЕРЁМ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ ПО EMAIL (из токена sub:2)
    user = db.query(User).filter(User.email == "test@test.com").first()
    if not user:
        return {"error": "User not found"}

    wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
    if not wallet:
        wallet = XPWallet(user_id=user.id)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return {"balance": wallet.balance, "total_earned": wallet.total_earned, "level": wallet.level}


@router.post("/earn")
def earn_xp(activity_log_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "test@test.com").first()
    if not user:
        return {"error": "User not found"}

    log = db.query(ActivityLog).filter(ActivityLog.id == activity_log_id).first()
    if log and log.user_id == user.id:
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
        xp = log.duration_minutes * (log.activity.xp_per_hour / 60)
        wallet.balance += xp
        wallet.total_earned += xp
        log.xp_earned = xp
        db.commit()
        return {"earned": xp, "new_balance": wallet.balance}
    return {"error": "Activity log not found"}
