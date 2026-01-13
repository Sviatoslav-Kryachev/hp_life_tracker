# app/routers/xp.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime, timedelta
import pytz
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import XPWallet, ActivityLog, User, RewardPurchase, TimerLog, Activity

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
    
    # Безопасно получаем xp_per_hour
    if not log.activity:
        raise HTTPException(status_code=404, detail="Активность не найдена")
    
    xp_per_hour = log.activity.xp_per_hour or 60.0
    xp = log.duration_minutes * (xp_per_hour / 60)
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
    
    result = []
    for log in logs:
        # Безопасно получаем название активности
        activity_name = "Неизвестная активность"
        try:
            if log.activity and hasattr(log.activity, 'name') and log.activity.name:
                activity_name = log.activity.name
            elif log.activity_id:
                # Если активность не загружена, пытаемся получить её из базы
                activity = db.query(Activity).filter(Activity.id == log.activity_id).first()
                if activity and hasattr(activity, 'name') and activity.name:
                    activity_name = activity.name
        except (AttributeError, TypeError) as e:
            print(f"Error getting activity name for log {log.id}: {e}")
            activity_name = "Неизвестная активность"
        
        result.append({
            "id": log.id,
            "activity_name": activity_name,
            "duration_minutes": log.duration_minutes,
            "xp_earned": log.xp_earned,
            "date": log.end_time.isoformat() if log.end_time else None
        })
    
    return result


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
    # Используем Берлинское время для правильного определения текущего дня
    berlin_tz = pytz.timezone('Europe/Berlin')
    now_berlin = datetime.now(berlin_tz)
    today = now_berlin.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Определяем понедельник текущей недели
    # weekday() возвращает: 0=Пн, 1=Вт, ..., 6=Вс
    days_since_monday = today.weekday()
    monday = today - timedelta(days=days_since_monday)
    
    # Получаем данные по дням недели (от понедельника до воскресенья)
    daily_stats = []
    for i in range(7):
        day_start = monday + timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        
        # Конвертируем в UTC для запросов к БД (данные в БД хранятся в UTC)
        day_start_utc = day_start.astimezone(pytz.UTC).replace(tzinfo=None)
        day_end_utc = day_end.astimezone(pytz.UTC).replace(tzinfo=None)
        
        earned = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= day_start_utc,
            ActivityLog.end_time < day_end_utc
        ).scalar() or 0
        
        spent = db.query(func.sum(RewardPurchase.xp_spent)).filter(
            RewardPurchase.user_id == current_user.id,
            RewardPurchase.purchased_at >= day_start_utc,
            RewardPurchase.purchased_at < day_end_utc
        ).scalar() or 0
        
        time_mins = db.query(func.sum(ActivityLog.duration_minutes)).filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.end_time >= day_start_utc,
            ActivityLog.end_time < day_end_utc
        ).scalar() or 0
        
        # Используем дату в Берлинском времени для отображения
        day_date_str = day_start.strftime("%Y-%m-%d")
        day_weekday = day_start.weekday()  # 0=Пн, 1=Вт, ..., 6=Вс
        
        daily_stats.append({
            "date": day_date_str,
            "day_name": ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][day_weekday],
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
    
    # Заработки за день (загружаем активность вместе с логами)
    earnings = db.query(ActivityLog).options(joinedload(ActivityLog.activity)).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time >= day_start,
        ActivityLog.end_time < day_end,
        ActivityLog.xp_earned > 0
    ).order_by(ActivityLog.end_time.desc()).all()
    
    # Покупки/награды за день (включая бонусы за достижение целей)
    purchases = db.query(RewardPurchase).filter(
        RewardPurchase.user_id == current_user.id,
        RewardPurchase.purchased_at >= day_start,
        RewardPurchase.purchased_at < day_end
    ).order_by(RewardPurchase.purchased_at.desc()).all()
    
    # Разделяем на заработки (отрицательный xp_spent) и траты (положительный xp_spent)
    bonus_earnings = [p for p in purchases if p.xp_spent < 0]
    spendings = [p for p in purchases if p.xp_spent > 0]
    
    # Общая статистика
    total_earned = sum(log.xp_earned for log in earnings) + sum(abs(p.xp_spent) for p in bonus_earnings)
    total_spent = sum(p.xp_spent for p in spendings)
    total_time = sum(log.duration_minutes for log in earnings)
    
    # Детали заработков (активности + бонусы)
    earnings_details = []
    for log in earnings:
        # Безопасно получаем название активности
        activity_name = "Неизвестная активность"
        try:
            if log.activity and hasattr(log.activity, 'name') and log.activity.name:
                activity_name = log.activity.name
            elif log.activity_id:
                # Если активность не загружена, пытаемся получить её из базы
                activity = db.query(Activity).filter(Activity.id == log.activity_id).first()
                if activity and hasattr(activity, 'name') and activity.name:
                    activity_name = activity.name
        except (AttributeError, TypeError) as e:
            # Если возникла ошибка при доступе к атрибутам, используем значение по умолчанию
            print(f"Error getting activity name for log {log.id}: {e}")
            activity_name = "Неизвестная активность"
        
        earnings_details.append({
            "activity_name": activity_name,
            "xp_earned": round(log.xp_earned, 1),
            "duration_minutes": round(log.duration_minutes, 1) if log.duration_minutes else 0,
            "time": log.end_time.isoformat() if log.end_time else None
        })
    
    # Добавляем бонусы за достижение целей как заработки
    for purchase in bonus_earnings:
        earnings_details.append({
            "activity_name": purchase.reward_name or "Бонус",
            "xp_earned": round(abs(purchase.xp_spent), 1),
            "duration_minutes": None,
            "time": purchase.purchased_at.isoformat() if purchase.purchased_at else None
        })
    
    # Сортируем заработки по времени
    earnings_details.sort(key=lambda x: x["time"] or "", reverse=True)
    
    # Детали расходов (только реальные траты)
    spendings_details = []
    for purchase in spendings:
        spendings_details.append({
            "reward_name": purchase.reward_name or "Неизвестная награда",
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
    # Увеличиваем лимит для каждого источника, чтобы после объединения и сортировки получить нужное количество
    source_limit = limit * 2
    
    # Заработки
    earnings = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.xp_earned > 0
    ).order_by(ActivityLog.end_time.desc()).limit(source_limit).all()
    
    # Расходы
    spendings = db.query(RewardPurchase).filter(
        RewardPurchase.user_id == current_user.id
    ).order_by(RewardPurchase.purchased_at.desc()).limit(source_limit).all()
    
    # Объединяем и сортируем
    history = []
    
    for log in earnings:
        if log.end_time:
            # Безопасно получаем название активности
            activity_name = "Неизвестная активность"
            try:
                if log.activity and hasattr(log.activity, 'name') and log.activity.name:
                    activity_name = log.activity.name
                elif log.activity_id:
                    # Если активность не загружена, пытаемся получить её из базы
                    activity = db.query(Activity).filter(Activity.id == log.activity_id).first()
                    if activity and hasattr(activity, 'name') and activity.name:
                        activity_name = activity.name
            except (AttributeError, TypeError) as e:
                print(f"Error getting activity name for log {log.id}: {e}")
                activity_name = "Неизвестная активность"
            
            history.append({
                "type": "earn",
                "description": activity_name,
                "amount": round(log.xp_earned, 1),
                "date": log.end_time.isoformat(),
                "duration_minutes": round(log.duration_minutes, 1) if log.duration_minutes else None,
                "log_id": log.id,  # Добавляем ID для стабильной сортировки
                "id": log.id  # Также добавляем в id для совместимости
            })
    
    for purchase in spendings:
        # Если xp_spent отрицательный, это заработок (например, бонус за достижение цели)
        # Также если описание содержит "Достижение цели" или начинается с "🎯", это всегда заработок
        # (для совместимости со старыми транзакциями, которые могли быть созданы с положительным значением)
        reward_name = purchase.reward_name or ""
        # КРИТИЧНО: Если описание содержит "🎯" в любом месте - это всегда достижение цели (заработок)
        # Это должно работать даже для старых транзакций с пустым описанием после "🎯 Достижение цели:"
        is_goal_achievement = False
        if reward_name and "🎯" in reward_name:
            is_goal_achievement = True
        elif reward_name:
            reward_name_lower = reward_name.lower()
            reward_name_stripped = reward_name.strip()
            # Проверяем разными способами для надежности
            is_goal_achievement = (
                "достижение цели" in reward_name_lower or 
                reward_name.startswith("🎯") or
                "🎯" in reward_name or
                reward_name_stripped == "🎯 Достижение цели:" or  # Для старых транзакций
                reward_name_stripped.startswith("🎯 Достижение цели") or  # Любое описание, начинающееся с этого
                reward_name_stripped == "🎯 Достижение цели"  # Без двоеточия
            )
        
        # Всегда считаем транзакции достижения цели как заработок
        # Если xp_spent отрицательный - это точно заработок
        # Если описание содержит "🎯" или "Достижение цели" - это тоже заработок
        is_earn = purchase.xp_spent < 0 or is_goal_achievement
        amount = abs(purchase.xp_spent)  # Используем абсолютное значение для отображения
        
        # Конвертируем время в Берлинское время для отображения
        # purchased_at сохраняется в UTC (без timezone), поэтому считаем что это UTC
        berlin_tz = pytz.timezone('Europe/Berlin')
        if purchase.purchased_at:
            # Если время без timezone, считаем что это UTC
            if purchase.purchased_at.tzinfo is None:
                purchased_at_utc = pytz.UTC.localize(purchase.purchased_at)
            else:
                purchased_at_utc = purchase.purchased_at
            # Конвертируем в Берлинское время
            purchased_at_berlin = purchased_at_utc.astimezone(berlin_tz)
            date_iso = purchased_at_berlin.isoformat()
        else:
            date_iso = purchase.purchased_at.isoformat() if purchase.purchased_at else None
        
        history.append({
            "type": "earn" if is_earn else "spend",
            "description": purchase.reward_name or "Неизвестная награда",
            "amount": round(amount, 1),
            "date": date_iso,
            "duration_minutes": None,
            "purchase_id": purchase.id,  # Добавляем ID для стабильной сортировки
            "id": purchase.id  # Также добавляем в id для совместимости
        })
    
    # Сортируем по дате (самые новые сверху)
    # Используем безопасную сортировку с обработкой None значений
    # Сортируем по ISO строке даты, которая уже содержит время
    def sort_key(x):
        date_str = x.get("date", "")
        if not date_str:
            return ("", 0)  # Возвращаем кортеж для вторичной сортировки
        
        # Используем ISO строку напрямую для сортировки (она уже отсортирована лексикографически)
        # ISO формат позволяет сортировать строки напрямую
        # В качестве вторичного ключа используем ID (более новые ID идут выше)
        item_id = x.get("id") or x.get("log_id") or x.get("purchase_id") or 0
        return (date_str, -item_id)  # Отрицательный ID для обратной сортировки
    
    # Сортируем по убыванию даты (новые сверху)
    history.sort(key=sort_key, reverse=True)
    
    # Возвращаем только нужное количество самых новых транзакций
    return history[:limit]


@router.get("/category-stats")
async def get_category_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    period: str = "week"  # week, month, year
):
    """Получить статистику по категориям активностей"""
    from datetime import datetime, timedelta
    
    # Определяем период
    now = datetime.utcnow()
    if period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now - timedelta(days=30)
    elif period == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=7)
    
    # Получаем логи активностей за период
    logs = db.query(ActivityLog).join(Activity).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.end_time >= start_date,
        ActivityLog.xp_earned > 0
    ).all()
    
    # Группируем по категориям
    category_stats = {}
    for log in logs:
        category = log.activity.category if log.activity.category else "general"
        if category not in category_stats:
            category_stats[category] = {
                "category": category,
                "total_xp": 0.0,
                "total_time": 0.0,  # в минутах
                "activity_count": 0
            }
        
        category_stats[category]["total_xp"] += log.xp_earned
        category_stats[category]["total_time"] += log.duration_minutes or 0
        category_stats[category]["activity_count"] += 1
    
    # Преобразуем в список и сортируем по XP
    result = list(category_stats.values())
    result.sort(key=lambda x: x["total_xp"], reverse=True)
    
    return {
        "period": period,
        "categories": result,
        "total_xp": sum(cat["total_xp"] for cat in result),
        "total_time": sum(cat["total_time"] for cat in result)
    }
