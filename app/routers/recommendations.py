# app/routers/recommendations.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import Activity, ActivityLog, User

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/")
async def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить умные рекомендации"""
    recommendations = []
    
    # Получаем все активности пользователя
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
    
    if not activities:
        return {
            "recommendations": [{
                "type": "info",
                "message": "Создайте первую активность, чтобы начать зарабатывать XP!",
                "priority": "low"
            }]
        }
    
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=7)
    yesterday = today - timedelta(days=1)
    
    # Анализируем каждую активность
    for activity in activities:
        # Последняя активность
        last_log = db.query(ActivityLog).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.activity_id == activity.id,
            ActivityLog.end_time != None
        ).order_by(desc(ActivityLog.end_time)).first()
        
        if not last_log:
            recommendations.append({
                "type": "new",
                "activity_id": activity.id,
                "activity_name": activity.name,
                "message": f"Попробуйте '{activity.name}' - вы ещё не начинали эту активность!",
                "priority": "medium"
            })
            continue
        
        last_date = last_log.end_time.date()
        days_since = (today - last_date).days
        
        # Рекомендация: продолжить серию
        if days_since == 1:
            recommendations.append({
                "type": "continue",
                "activity_id": activity.id,
                "activity_name": activity.name,
                "message": f"Вчера вы делали '{activity.name}' - продолжите серию! 🔥",
                "priority": "high",
                "days_since": days_since
            })
        
        # Рекомендация: давно не делали
        elif days_since >= 4:
            recommendations.append({
                "type": "reminder",
                "activity_id": activity.id,
                "activity_name": activity.name,
                "message": f"Вы {days_since} дней не занимались '{activity.name}' - время вернуться!",
                "priority": "medium",
                "days_since": days_since
            })
        
        # Рекомендация: активность сегодня
        elif days_since == 0:
            # Проверяем, сколько времени сегодня
            today_logs = db.query(func.sum(ActivityLog.duration_minutes)).filter(
                ActivityLog.user_id == current_user.id,
                ActivityLog.activity_id == activity.id,
                func.date(ActivityLog.end_time) == today
            ).scalar() or 0
            
            if today_logs < 30:
                recommendations.append({
                    "type": "more",
                    "activity_id": activity.id,
                    "activity_name": activity.name,
                    "message": f"Сегодня вы занимались '{activity.name}' {int(today_logs)} минут - можно ещё!",
                    "priority": "low",
                    "minutes_today": int(today_logs)
                })
    
    # Сортируем по приоритету
    priority_order = {"high": 3, "medium": 2, "low": 1}
    recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "low"), 0), reverse=True)
    
    return {
        "recommendations": recommendations[:5]  # Топ-5 рекомендаций
    }


