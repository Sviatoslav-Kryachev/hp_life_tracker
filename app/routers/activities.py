from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.database import get_db
from app.models.base import Activity, User

router = APIRouter(prefix="/activities", tags=["activities"])


def get_current_user(db: Session):
    return db.query(User).filter(User.email == "test@test.com").first()


@router.get("/")
def get_activities(db: Session = Depends(get_db)):
    user = get_current_user(db)
    activities = db.query(Activity).filter(Activity.user_id == user.id).all()
    return activities


@router.post("/")
def create_activity(activity_data: dict, db: Session = Depends(get_db)):
    user = get_current_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Фикс category ошибки
    activity_data.pop('category', None)
    activity = Activity(user_id=user.id, **activity_data)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity
