# app/routers/xp.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import XPWallet, ActivityLog, User, RewardPurchase, TimerLog

router = APIRouter(prefix="/xp", tags=["xp"])


@router.get("/wallet")
async def get_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить кошелёк XP текущего пользователя"""
    wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
    
    if not wallet:
        # Создаём кошелёк если его нет
        wallet = XPWallet(
            user_id=current_user.id,
            balance=0.0,
            level=1,
            total_earned=0.0,
            total_spent=0.0
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return {
        "balance": wallet.balance, 
        "total_earned": wallet.total_earned,
        "total_spent": wallet.total_spent,
        "level": wallet.level
    }


@router.post("/earn")
async def earn_xp(
    activity_log_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Начислить XP за активность"""
    log = db.query(ActivityLog).filter(
        ActivityLog.id == activity_log_id,
        ActivityLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Лог активности не найден")
    
    wallet = db.query(XPWallet).filter(XPWallet.user_id == current_user.id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Кошелёк не найден")
    
    xp = log.duration_minutes * (log.activity.xp_per_hour / 60)
    wallet.balance += xp
    wallet.total_earned += xp
    log.xp_earned = xp
    
    # Повышение уровня
    if wallet.total_earned >= wallet.level * 1000:
        wallet.level += 1
    
    db.commit()
    
    return {
        "earned": xp, 
        "new_balance": wallet.balance,
        "level": wallet.level
    }


@router.get("/history")
async def get_xp_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """Получить историю заработанного XP"""
    logs = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.xp_earned > 0
    ).order_by(ActivityLog.end_time.desc()).limit(limit).all()
    
    return [
        {
            "id": log.id,
            "activity_name": log.activity.name,
            "duration_minutes": log.duration_minutes,
            "xp_earned": log.xp_earned,
            "date": log.end_time.isoformat() if log.end_time else None
        }
        for log in logs
    ]


@router.get("/today")
async def get_today_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за сегодня"""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # XP заработано сегодня
    earned_today = db.query(func.sum(ActivityLog.xp_earned)).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time >= today_start
    ).scalar() or 0
    
    # Также из TimerLog (ручной ввод)
    timer_logs_today = db.query(func.sum(TimerLog.duration_minutes)).filter(
        TimerLog.user_id == current_user.id,
        TimerLog.start_time >= today_start
    ).scalar() or 0
    
    # XP потрачено сегодня
    spent_today = db.query(func.sum(RewardPurchase.xp_spent)).filter(
        RewardPurchase.user_id == current_user.id,
        RewardPurchase.purchased_at >= today_start
    ).scalar() or 0
    
    # Количество сессий сегодня
    sessions_today = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time >= today_start
    ).count()
    
    # Общее время сегодня (минуты)
    time_today = db.query(func.sum(ActivityLog.duration_minutes)).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time >= today_start
    ).scalar() or 0
    
    return {
        "earned_today": round(earned_today, 1),
        "spent_today": round(spent_today, 1),
        "sessions_today": sessions_today,
        "time_today_minutes": round(time_today, 1),
        "net_today": round(earned_today - spent_today, 1)
    }


@router.get("/week")
async def get_week_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за неделю (для календаря)"""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Получаем данные по дням
    daily_stats = []
    for i in range(7):
        day_start = today - timedelta(days=6-i)
        day_end = day_start + timedelta(days=1)
        
        earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= day_start,
            ActivityLog.end_time < day_end
        ).scalar() or 0
        
        spent = db.query(func.sum(RewardPurchase.xp_spent)).filter(
            RewardPurchase.user_id == current_user.id,
            RewardPurchase.purchased_at >= day_start,
            RewardPurchase.purchased_at < day_end
        ).scalar() or 0
        
        time_mins = db.query(func.sum(ActivityLog.duration_minutes)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= day_start,
            ActivityLog.end_time < day_end
        ).scalar() or 0
        
        daily_stats.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "day_name": ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day_start.weekday()],
            "earned": round(earned, 1),
            "spent": round(spent, 1),
            "time_minutes": round(time_mins, 1)
        })
    
    return daily_stats


@router.get("/month")
async def get_month_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за месяц (для календаря)"""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    first_day = today.replace(day=1)
    
    # Получаем количество дней в месяце
    if today.month == 12:
        last_day = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        last_day = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
    
    days_in_month = last_day.day
    
    # Получаем данные по дням
    daily_stats = []
    for day_num in range(1, days_in_month + 1):
        day_start = first_day.replace(day=day_num)
        day_end = day_start + timedelta(days=1)
        
        earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= day_start,
            ActivityLog.end_time < day_end
        ).scalar() or 0
        
        spent = db.query(func.sum(RewardPurchase.xp_spent)).filter(
            RewardPurchase.user_id == current_user.id,
            RewardPurchase.purchased_at >= day_start,
            RewardPurchase.purchased_at < day_end
        ).scalar() or 0
        
        time_mins = db.query(func.sum(ActivityLog.duration_minutes)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= day_start,
            ActivityLog.end_time < day_end
        ).scalar() or 0
        
        daily_stats.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "day_number": day_num,
            "day_name": ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day_start.weekday()],
            "earned": round(earned, 1),
            "spent": round(spent, 1),
            "time_minutes": round(time_mins, 1)
        })
    
    return daily_stats


@router.get("/year")
async def get_year_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Статистика за год (для календаря)"""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    first_day = today.replace(month=1, day=1)
    
    # Получаем данные по месяцам
    monthly_stats = []
    month_names = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
    
    for month_num in range(1, 13):
        month_start = first_day.replace(month=month_num)
        if month_num == 12:
            month_end = first_day.replace(year=first_day.year + 1, month=1, day=1)
        else:
            month_end = first_day.replace(month=month_num + 1, day=1)
        
        earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= month_start,
            ActivityLog.end_time < month_end
        ).scalar() or 0
        
        spent = db.query(func.sum(RewardPurchase.xp_spent)).filter(
            RewardPurchase.user_id == current_user.id,
            RewardPurchase.purchased_at >= month_start,
            RewardPurchase.purchased_at < month_end
        ).scalar() or 0
        
        time_mins = db.query(func.sum(ActivityLog.duration_minutes)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= month_start,
            ActivityLog.end_time < month_end
        ).scalar() or 0
        
        monthly_stats.append({
            "month": month_num,
            "month_name": month_names[month_num - 1],
            "earned": round(earned, 1),
            "spent": round(spent, 1),
            "time_minutes": round(time_mins, 1)
        })
    
    return monthly_stats


@router.get("/day/{date}")
async def get_day_details(
    date: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Детальная информация по конкретному дню"""
    try:
        day_start = datetime.strptime(date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0)
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат даты. Используйте YYYY-MM-DD")
    
    day_end = day_start + timedelta(days=1)
    
    # Заработки за день
    earnings = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time >= day_start,
        ActivityLog.end_time < day_end,
        ActivityLog.xp_earned > 0
    ).order_by(ActivityLog.end_time.desc()).all()
    
    # Расходы за день
    spendings = db.query(RewardPurchase).filter(
        RewardPurchase.user_id == current_user.id,
        RewardPurchase.purchased_at >= day_start,
        RewardPurchase.purchased_at < day_end
    ).order_by(RewardPurchase.purchased_at.desc()).all()
    
    # Общая статистика
    total_earned = sum(log.xp_earned for log in earnings)
    total_spent = sum(purchase.xp_spent for purchase in spendings)
    total_time = sum(log.duration_minutes for log in earnings)
    
    # Детали заработков
    earnings_details = []
    for log in earnings:
        earnings_details.append({
            "activity_name": log.activity.name,
            "xp_earned": round(log.xp_earned, 1),
            "duration_minutes": round(log.duration_minutes, 1),
            "time": log.end_time.isoformat() if log.end_time else None
        })
    
    # Детали расходов
    spendings_details = []
    for purchase in spendings:
        spendings_details.append({
            "reward_name": purchase.reward_name,
            "xp_spent": round(purchase.xp_spent, 1),
            "time": purchase.purchased_at.isoformat() if purchase.purchased_at else None
        })
    
    return {
        "date": date,
        "total_earned": round(total_earned, 1),
        "total_spent": round(total_spent, 1),
        "total_time": round(total_time, 1),
        "net": round(total_earned - total_spent, 1),
        "earnings": earnings_details,
        "spendings": spendings_details,
        "sessions_count": len(earnings),
        "purchases_count": len(spendings)
    }


@router.get("/full-history")
async def get_full_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 50
):
    """Полная история доходов и расходов"""
    # Заработки
    earnings = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.xp_earned > 0
    ).order_by(ActivityLog.end_time.desc()).limit(limit).all()
    
    # Расходы
    spendings = db.query(RewardPurchase).filter(
        RewardPurchase.user_id == current_user.id
    ).order_by(RewardPurchase.purchased_at.desc()).limit(limit).all()
    
    # Объединяем и сортируем
    history = []
    
    for log in earnings:
        if log.end_time:
            history.append({
                "type": "earn",
                "description": log.activity.name,
                "amount": round(log.xp_earned, 1),
                "date": log.end_time.isoformat(),
                "duration_minutes": round(log.duration_minutes, 1)
            })
    
    for purchase in spendings:
        history.append({
            "type": "spend",
            "description": purchase.reward_name,
            "amount": round(purchase.xp_spent, 1),
            "date": purchase.purchased_at.isoformat(),
            "duration_minutes": None
        })
    
    # Сортируем по дате
    history.sort(key=lambda x: x["date"], reverse=True)
    
    return history[:limit]
