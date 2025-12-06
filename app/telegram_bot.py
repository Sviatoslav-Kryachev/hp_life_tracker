# app/telegram_bot.py
import asyncio
import logging
from datetime import datetime
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.utils.database import SessionLocal
from app.models.base import User, Activity, XPWallet, ActivityLog, TimerLog
from app.routers.streak import update_streak

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Токен бота (получите у @BotFather)
# Можно установить через переменную окружения TELEGRAM_BOT_TOKEN или config.py
import os
try:
    from config import TELEGRAM_BOT_TOKEN as CONFIG_TOKEN
    DEFAULT_TOKEN = CONFIG_TOKEN
except ImportError:
    DEFAULT_TOKEN = "YOUR_BOT_TOKEN_HERE"

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", DEFAULT_TOKEN)


def get_user_by_telegram_id(telegram_id: int) -> User:
    """Получить пользователя по Telegram ID"""
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.telegram_id == telegram_id).first()
        return user
    except Exception as e:
        logger.error(f"Error getting user by telegram_id: {e}")
        return None
    finally:
        db.close()


def get_activity_by_name(user_id: int, activity_name: str) -> Activity:
    """Найти активность по имени (регистронезависимо)"""
    db: Session = SessionLocal()
    try:
        activity = db.query(Activity).filter(
            Activity.user_id == user_id,
            Activity.name.ilike(f"%{activity_name}%")
        ).first()
        return activity
    finally:
        db.close()


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /start"""
    try:
        logger.info(f"Received /start from user {update.effective_user.id}")
        user = get_user_by_telegram_id(update.effective_user.id)
        
        if not user:
            message = (
                "👋 Привет! Я бот для HP Life Tracker.\n\n"
                "Чтобы использовать бота, нужно сначала связать ваш Telegram аккаунт с аккаунтом в приложении.\n\n"
                "📱 Инструкция по привязке:\n"
                "1. Войдите в веб-приложение\n"
                "2. Используйте API endpoint: POST /telegram/link\n"
                "3. Отправьте ваш Telegram ID: " + str(update.effective_user.id) + "\n\n"
                "Или используйте команды для тестирования (без привязки):\n"
                "/help - справка по командам"
            )
            await update.message.reply_text(message)
            logger.info("Sent start message to unlinked user")
            return
        
        message = (
            f"✅ Привет, {user.username}!\n\n"
            "Доступные команды:\n"
            "/xp - показать баланс XP\n"
            "/add_time <минуты> <название активности> - добавить время\n"
            "   Пример: /add_time 30 German\n"
            "/report - получить отчёт за сегодня\n"
            "/activities - список активностей\n"
            "/help - помощь"
        )
        await update.message.reply_text(message)
        logger.info(f"Sent start message to linked user {user.username}")
    except Exception as e:
        logger.error(f"Error in start_command: {e}", exc_info=True)
        await update.message.reply_text("❌ Произошла ошибка. Попробуйте позже.")


async def xp_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /xp - показать баланс XP"""
    user = get_user_by_telegram_id(update.effective_user.id)
    
    if not user:
        await update.message.reply_text("❌ Ваш аккаунт не привязан. Используйте /start для инструкций.")
        return
    
    db: Session = SessionLocal()
    try:
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
        
        if not wallet:
            await update.message.reply_text("💰 Баланс: 0 XP\n📊 Уровень: 1")
            return
        
        # Получаем статистику за сегодня
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        earned_today = db.query(func.sum(ActivityLog.xp_earned)).filter(
            ActivityLog.user_id == user.id,
            ActivityLog.end_time >= today_start,
            ActivityLog.end_time <= today_end
        ).scalar() or 0
        
        message = (
            f"💰 <b>Баланс: {int(wallet.balance)} XP</b>\n"
            f"📊 Уровень: {wallet.level}\n"
            f"📈 Всего заработано: {int(wallet.total_earned)} XP\n"
            f"💸 Всего потрачено: {int(wallet.total_spent)} XP\n\n"
            f"🔥 Сегодня: +{int(earned_today)} XP"
        )
        
        await update.message.reply_text(message, parse_mode='HTML')
    finally:
        db.close()


async def add_time_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /add_time <минуты> <название активности>"""
    user = get_user_by_telegram_id(update.effective_user.id)
    
    if not user:
        await update.message.reply_text("❌ Ваш аккаунт не привязан. Используйте /start для инструкций.")
        return
    
    if not context.args or len(context.args) < 2:
        await update.message.reply_text(
            "❌ Неверный формат команды.\n\n"
            "Использование: /add_time <минуты> <название активности>\n"
            "Пример: /add_time 30 German"
        )
        return
    
    try:
        minutes = int(context.args[0])
        activity_name = " ".join(context.args[1:])
    except ValueError:
        await update.message.reply_text("❌ Количество минут должно быть числом.")
        return
    
    db: Session = SessionLocal()
    try:
        # Находим активность
        activity = get_activity_by_name(user.id, activity_name)
        
        if not activity:
            await update.message.reply_text(
                f"❌ Активность '{activity_name}' не найдена.\n\n"
                "Используйте /activities чтобы увидеть список ваших активностей."
            )
            return
        
        # Создаём запись о времени
        timer_log = TimerLog(
            user_id=user.id,
            activity_id=activity.id,
            start_time=datetime.utcnow(),
            duration_minutes=minutes
        )
        db.add(timer_log)
        db.flush()
        
        # Вычисляем XP
        xp_earned = (minutes / 60) * activity.xp_per_hour
        
        # Обновляем кошелёк
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
        if wallet:
            wallet.balance += xp_earned
            wallet.total_earned += xp_earned
            if wallet.total_earned >= wallet.level * 1000:
                wallet.level += 1
        
        # Обновляем streak
        streak_result = update_streak(db, user.id)
        
        db.commit()
        
        bonus_text = ""
        if streak_result.get("bonus_xp", 0) > 0:
            bonus_text = f"\n🔥 Бонус за серию: +{int(streak_result['bonus_xp'])} XP"
        
        message = (
            f"✅ Время добавлено!\n\n"
            f"📝 Активность: {activity.name}\n"
            f"⏱ Время: {minutes} минут\n"
            f"💰 Заработано: {int(xp_earned)} XP{bonus_text}\n"
            f"💳 Баланс: {int(wallet.balance) if wallet else 0} XP"
        )
        
        await update.message.reply_text(message)
    except Exception as e:
        logger.error(f"Error adding time: {e}")
        await update.message.reply_text("❌ Произошла ошибка при добавлении времени.")
    finally:
        db.close()


async def report_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /report - отчёт за сегодня"""
    user = get_user_by_telegram_id(update.effective_user.id)
    
    if not user:
        await update.message.reply_text("❌ Ваш аккаунт не привязан. Используйте /start для инструкций.")
        return
    
    db: Session = SessionLocal()
    try:
        from sqlalchemy import func
        
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        # Статистика за сегодня
        logs_today = db.query(ActivityLog).filter(
            ActivityLog.user_id == user.id,
            ActivityLog.end_time >= today_start,
            ActivityLog.end_time <= today_end
        ).all()
        
        earned_today = sum(log.xp_earned for log in logs_today)
        time_today = sum(log.duration_minutes for log in logs_today)
        sessions_today = len(logs_today)
        
        # Топ активностей за сегодня
        activity_stats = {}
        for log in logs_today:
            name = log.activity.name
            if name not in activity_stats:
                activity_stats[name] = {"time": 0, "xp": 0}
            activity_stats[name]["time"] += log.duration_minutes
            activity_stats[name]["xp"] += log.xp_earned
        
        # Формируем сообщение
        message = f"📊 <b>Отчёт за сегодня</b>\n\n"
        message += f"💰 Заработано: {int(earned_today)} XP\n"
        message += f"⏱ Время: {int(time_today)} минут\n"
        message += f"📝 Сессий: {sessions_today}\n\n"
        
        if activity_stats:
            message += "<b>Активности:</b>\n"
            sorted_activities = sorted(activity_stats.items(), key=lambda x: x[1]["time"], reverse=True)
            for name, stats in sorted_activities[:5]:
                message += f"• {name}: {int(stats['time'])}м ({int(stats['xp'])} XP)\n"
        else:
            message += "Сегодня активности не было 😴"
        
        await update.message.reply_text(message, parse_mode='HTML')
    finally:
        db.close()


async def activities_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /activities - список активностей"""
    user = get_user_by_telegram_id(update.effective_user.id)
    
    if not user:
        await update.message.reply_text("❌ Ваш аккаунт не привязан. Используйте /start для инструкций.")
        return
    
    db: Session = SessionLocal()
    try:
        activities = db.query(Activity).filter(Activity.user_id == user.id).all()
        
        if not activities:
            await update.message.reply_text("📝 У вас пока нет активностей.")
            return
        
        message = "📝 <b>Ваши активности:</b>\n\n"
        for i, activity in enumerate(activities, 1):
            message += f"{i}. {activity.name} ({activity.xp_per_hour} XP/час)\n"
        
        message += "\nИспользуйте: /add_time <минуты> <название>"
        
        await update.message.reply_text(message, parse_mode='HTML')
    finally:
        db.close()


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /help"""
    help_text = (
        "📖 <b>Доступные команды:</b>\n\n"
        "/xp - показать баланс XP и уровень\n"
        "/add_time <минуты> <название> - добавить время активности\n"
        "   Пример: /add_time 30 German\n"
        "/report - отчёт за сегодня\n"
        "/activities - список ваших активностей\n"
        "/help - эта справка\n\n"
        "💡 <b>Совет:</b> Название активности можно писать частично, например 'Ger' вместо 'German'"
    )
    await update.message.reply_text(help_text, parse_mode='HTML')


def run_bot():
    """Запустить бота"""
    if TELEGRAM_BOT_TOKEN == "YOUR_BOT_TOKEN_HERE" or not TELEGRAM_BOT_TOKEN:
        logger.warning("Telegram bot token not set! Bot will not start.")
        return
    
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Регистрируем команды
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("xp", xp_command))
    application.add_handler(CommandHandler("add_time", add_time_command))
    application.add_handler(CommandHandler("report", report_command))
    application.add_handler(CommandHandler("activities", activities_command))
    application.add_handler(CommandHandler("help", help_command))
    
    # Запускаем бота
    logger.info("=" * 50)
    logger.info("Starting Telegram bot...")
    logger.info("Bot is ready! Send /start in Telegram.")
    logger.info("=" * 50)
    print("\n" + "=" * 50)
    print("🤖 Telegram бот запущен!")
    print("📱 Отправьте /start боту в Telegram")
    print("⏹️  Для остановки нажмите Ctrl+C")
    print("=" * 50 + "\n")
    application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)


if __name__ == "__main__":
    run_bot()

