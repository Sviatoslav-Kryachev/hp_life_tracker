# app/telegram_bot.py
import asyncio
import logging
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackQueryHandler
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import SessionLocal
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
    DEFAULT_TOKEN = "8351741227:AAEkDtvBaDe3HP_reSegjtaoiUfItqRhKJI"

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


def get_main_menu_keyboard():
    """Главное меню с кнопками"""
    keyboard = [
        [
            InlineKeyboardButton("💰 XP", callback_data="menu_xp"),
            InlineKeyboardButton("📊 Отчёт", callback_data="menu_report")
        ],
        [
            InlineKeyboardButton("📝 Активности", callback_data="menu_activities"),
            InlineKeyboardButton("➕ Добавить время", callback_data="menu_add_time")
        ],
        [
            InlineKeyboardButton("❓ Помощь", callback_data="menu_help")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /start"""
    try:
        logger.info(f"Received /start from user {update.effective_user.id}")
        user = get_user_by_telegram_id(update.effective_user.id)
        
        if not user:
            message = (
                "👋 Привет! Я бот для HP Life Tracker.\n\n"
                "Чтобы использовать бота, нужно сначала связать ваш Telegram аккаунт с аккаунтом в приложении.\n\n"
                "📱 <b>Инструкция по привязке:</b>\n"
                "1. Войдите в веб-приложение\n"
                "2. Перейдите в настройки (внизу страницы)\n"
                "3. Нажмите \"Привязать Telegram\"\n"
                "4. Вставьте ваш Telegram ID: <code>" + str(update.effective_user.id) + "</code>\n\n"
                "После привязки вы сможете использовать все функции бота!"
            )
            # Добавляем кнопку помощи даже для непривязанных пользователей
            help_keyboard = InlineKeyboardMarkup([
                [InlineKeyboardButton("❓ Помощь", callback_data="menu_help")]
            ])
            await update.message.reply_text(message, parse_mode='HTML', reply_markup=help_keyboard)
            logger.info("Sent start message to unlinked user")
            return
        
        message = (
            f"✅ Привет, {user.username}!\n\n"
            "🎮 <b>Главное меню</b>\n\n"
            "Выберите действие:"
        )
        try:
            keyboard = get_main_menu_keyboard()
            logger.info(f"Sending menu with keyboard to user {user.username}, keyboard: {keyboard}")
            await update.message.reply_text(message, parse_mode='HTML', reply_markup=keyboard)
            logger.info(f"Successfully sent start message with keyboard to linked user {user.username}")
        except Exception as e:
            logger.error(f"Error sending keyboard: {e}", exc_info=True)
            # Отправляем без кнопок в случае ошибки
            await update.message.reply_text(message, parse_mode='HTML')
            logger.warning("Sent message without keyboard due to error")
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
        "/start - главное меню\n"
        "/xp - показать баланс XP и уровень\n"
        "/add_time <минуты> <название> - добавить время активности\n"
        "   Пример: /add_time 30 German\n"
        "/report - отчёт за сегодня\n"
        "/activities - список ваших активностей\n"
        "/help - эта справка\n\n"
        "💡 <b>Совет:</b> Используйте кнопки меню для быстрого доступа к функциям!"
    )
    await update.message.reply_text(help_text, parse_mode='HTML', reply_markup=get_main_menu_keyboard())


async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик нажатий на кнопки"""
    query = update.callback_query
    logger.info(f"Button callback received: {query.data} from user {query.from_user.id}")
    
    try:
        await query.answer()
    except Exception as e:
        logger.error(f"Error answering query: {e}")
    
    user = get_user_by_telegram_id(query.from_user.id)
    
    # Обработка кнопки помощи для непривязанных пользователей
    if query.data == "menu_help" and not user:
        help_text = (
            "📖 <b>Справка</b>\n\n"
            "Для использования бота нужно привязать ваш Telegram аккаунт:\n\n"
            "1. Войдите в веб-приложение\n"
            "2. Перейдите в настройки (внизу страницы)\n"
            "3. Нажмите \"Привязать Telegram\"\n"
            "4. Вставьте ваш Telegram ID\n\n"
            "После привязки вы сможете использовать все функции!"
        )
        keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("◀️ Назад", callback_data="back_to_start")]
        ])
        await query.edit_message_text(help_text, parse_mode='HTML', reply_markup=keyboard)
        return
    
    if not user:
        logger.warning(f"User {query.from_user.id} not linked, trying to use: {query.data}")
        await query.edit_message_text("❌ Ваш аккаунт не привязан. Используйте /start для инструкций.")
        return
    
    if query.data == "menu_xp":
        await show_xp_info(query, user)
    elif query.data == "menu_report":
        await show_report(query, user)
    elif query.data == "menu_activities":
        await show_activities(query, user)
    elif query.data == "menu_add_time":
        await show_activity_selection(query, user)
    elif query.data == "menu_help":
        await show_help(query)
    elif query.data.startswith("activity_"):
        activity_id = int(query.data.split("_")[1])
        await show_minutes_selection(query, user, activity_id)
    elif query.data.startswith("minutes_"):
        parts = query.data.split("_")
        activity_id = int(parts[1])
        minutes = int(parts[2])
        await add_time_from_button(query, user, activity_id, minutes)
    elif query.data == "back_to_menu":
        message = "🎮 <b>Главное меню</b>\n\nВыберите действие:"
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=get_main_menu_keyboard())
    elif query.data == "back_to_start":
        # Возврат к начальному сообщению для непривязанных пользователей
        message = (
            "👋 Привет! Я бот для HP Life Tracker.\n\n"
            "Чтобы использовать бота, нужно сначала связать ваш Telegram аккаунт с аккаунтом в приложении.\n\n"
            "📱 <b>Инструкция по привязке:</b>\n"
            "1. Войдите в веб-приложение\n"
            "2. Перейдите в настройки (внизу страницы)\n"
            "3. Нажмите \"Привязать Telegram\"\n"
            "4. Вставьте ваш Telegram ID: <code>" + str(query.from_user.id) + "</code>\n\n"
            "После привязки вы сможете использовать все функции бота!"
        )
        help_keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("❓ Помощь", callback_data="menu_help")]
        ])
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=help_keyboard)
    elif query.data == "enter_custom_minutes":
        await query.edit_message_text(
            "⏱ Введите количество минут (число от 1 до 1440):",
            reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]])
        )
        context.user_data['waiting_for_minutes'] = True
        context.user_data['activity_id'] = int(query.data.split("_")[-1]) if "_" in query.data else None


async def show_xp_info(query, user):
    """Показать информацию о XP"""
    db: Session = SessionLocal()
    try:
        wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
        
        if not wallet:
            message = "💰 Баланс: 0 XP\n📊 Уровень: 1"
            await query.edit_message_text(message, reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]]))
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
        
        keyboard = [[InlineKeyboardButton("🔄 Обновить", callback_data="menu_xp"), InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]]
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))
    finally:
        db.close()


async def show_report(query, user):
    """Показать отчёт за сегодня"""
    db: Session = SessionLocal()
    try:
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        logs_today = db.query(ActivityLog).filter(
            ActivityLog.user_id == user.id,
            ActivityLog.end_time >= today_start,
            ActivityLog.end_time <= today_end
        ).all()
        
        earned_today = sum(log.xp_earned for log in logs_today)
        time_today = sum(log.duration_minutes for log in logs_today)
        sessions_today = len(logs_today)
        
        activity_stats = {}
        for log in logs_today:
            name = log.activity.name
            if name not in activity_stats:
                activity_stats[name] = {"time": 0, "xp": 0}
            activity_stats[name]["time"] += log.duration_minutes
            activity_stats[name]["xp"] += log.xp_earned
        
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
        
        keyboard = [[InlineKeyboardButton("🔄 Обновить", callback_data="menu_report"), InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]]
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))
    finally:
        db.close()


async def show_activities(query, user):
    """Показать список активностей"""
    db: Session = SessionLocal()
    try:
        activities = db.query(Activity).filter(Activity.user_id == user.id).all()
        
        if not activities:
            message = "📝 У вас пока нет активностей.\n\nСоздайте их в веб-приложении."
            await query.edit_message_text(message, reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]]))
            return
        
        message = "📝 <b>Ваши активности:</b>\n\n"
        for i, activity in enumerate(activities, 1):
            message += f"{i}. {activity.name} ({activity.xp_per_hour} XP/час)\n"
        
        keyboard = [[InlineKeyboardButton("🔄 Обновить", callback_data="menu_activities"), InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]]
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))
    finally:
        db.close()


async def show_activity_selection(query, user):
    """Показать выбор активности для добавления времени"""
    db: Session = SessionLocal()
    try:
        activities = db.query(Activity).filter(Activity.user_id == user.id).all()
        
        if not activities:
            await query.edit_message_text(
                "📝 У вас пока нет активностей.\n\nСоздайте их в веб-приложении.",
                reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]])
            )
            return
        
        message = "➕ <b>Добавить время</b>\n\nВыберите активность:"
        keyboard = []
        
        # Группируем активности по 2 в ряд
        for i in range(0, len(activities), 2):
            row = []
            row.append(InlineKeyboardButton(activities[i].name, callback_data=f"activity_{activities[i].id}"))
            if i + 1 < len(activities):
                row.append(InlineKeyboardButton(activities[i + 1].name, callback_data=f"activity_{activities[i + 1].id}"))
            keyboard.append(row)
        
        keyboard.append([InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")])
        
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))
    finally:
        db.close()


async def show_minutes_selection(query, user, activity_id):
    """Показать выбор количества минут"""
    db: Session = SessionLocal()
    try:
        activity = db.query(Activity).filter(Activity.id == activity_id, Activity.user_id == user.id).first()
        
        if not activity:
            await query.answer("Активность не найдена", show_alert=True)
            return
        
        message = f"⏱ <b>Добавить время</b>\n\nАктивность: {activity.name}\n\nВыберите количество минут:"
        
        keyboard = [
            [
                InlineKeyboardButton("15 мин", callback_data=f"minutes_{activity_id}_15"),
                InlineKeyboardButton("30 мин", callback_data=f"minutes_{activity_id}_30")
            ],
            [
                InlineKeyboardButton("45 мин", callback_data=f"minutes_{activity_id}_45"),
                InlineKeyboardButton("60 мин", callback_data=f"minutes_{activity_id}_60")
            ],
            [
                InlineKeyboardButton("90 мин", callback_data=f"minutes_{activity_id}_90"),
                InlineKeyboardButton("120 мин", callback_data=f"minutes_{activity_id}_120")
            ],
            [
                InlineKeyboardButton("✏️ Свое значение", callback_data=f"enter_custom_minutes_{activity_id}")
            ],
            [
                InlineKeyboardButton("◀️ Назад", callback_data="menu_add_time")
            ]
        ]
        
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))
    finally:
        db.close()


async def add_time_from_button(query, user, activity_id, minutes):
    """Добавить время через кнопку"""
    db: Session = SessionLocal()
    try:
        activity = db.query(Activity).filter(Activity.id == activity_id, Activity.user_id == user.id).first()
        
        if not activity:
            await query.answer("Активность не найдена", show_alert=True)
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
            f"✅ <b>Время добавлено!</b>\n\n"
            f"📝 Активность: {activity.name}\n"
            f"⏱ Время: {minutes} минут\n"
            f"💰 Заработано: {int(xp_earned)} XP{bonus_text}\n"
            f"💳 Баланс: {int(wallet.balance) if wallet else 0} XP"
        )
        
        keyboard = [
            [InlineKeyboardButton("➕ Добавить ещё", callback_data="menu_add_time")],
            [InlineKeyboardButton("◀️ Главное меню", callback_data="back_to_menu")]
        ]
        
        await query.edit_message_text(message, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))
    except Exception as e:
        logger.error(f"Error adding time: {e}")
        await query.answer("❌ Произошла ошибка при добавлении времени.", show_alert=True)
    finally:
        db.close()


async def show_help(query):
    """Показать справку"""
    help_text = (
        "📖 <b>Справка</b>\n\n"
        "Используйте кнопки меню для быстрого доступа к функциям:\n\n"
        "💰 <b>XP</b> - посмотреть баланс и статистику\n"
        "📊 <b>Отчёт</b> - статистика за сегодня\n"
        "📝 <b>Активности</b> - список ваших активностей\n"
        "➕ <b>Добавить время</b> - добавить время активности\n\n"
        "💡 <b>Совет:</b> Вы можете использовать команды или кнопки меню!"
    )
    keyboard = [[InlineKeyboardButton("◀️ Назад", callback_data="back_to_menu")]]
    await query.edit_message_text(help_text, parse_mode='HTML', reply_markup=InlineKeyboardMarkup(keyboard))


async def handle_custom_minutes(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка ввода пользовательского количества минут"""
    if not context.user_data.get('waiting_for_minutes'):
        return
    
    try:
        minutes = int(update.message.text)
        if minutes < 1 or minutes > 1440:
            await update.message.reply_text("❌ Введите число от 1 до 1440 минут.")
            return
        
        activity_id = context.user_data.get('activity_id')
        if not activity_id:
            await update.message.reply_text("❌ Ошибка: активность не выбрана.")
            context.user_data.pop('waiting_for_minutes', None)
            return
        
        user = get_user_by_telegram_id(update.effective_user.id)
        if not user:
            await update.message.reply_text("❌ Ваш аккаунт не привязан.")
            context.user_data.pop('waiting_for_minutes', None)
            return
        
        # Добавляем время
        db: Session = SessionLocal()
        try:
            activity = db.query(Activity).filter(Activity.id == activity_id, Activity.user_id == user.id).first()
            
            if not activity:
                await update.message.reply_text("❌ Активность не найдена.")
                context.user_data.pop('waiting_for_minutes', None)
                return
            
            timer_log = TimerLog(
                user_id=user.id,
                activity_id=activity.id,
                start_time=datetime.utcnow(),
                duration_minutes=minutes
            )
            db.add(timer_log)
            db.flush()
            
            xp_earned = (minutes / 60) * activity.xp_per_hour
            
            wallet = db.query(XPWallet).filter(XPWallet.user_id == user.id).first()
            if wallet:
                wallet.balance += xp_earned
                wallet.total_earned += xp_earned
                if wallet.total_earned >= wallet.level * 1000:
                    wallet.level += 1
            
            streak_result = update_streak(db, user.id)
            db.commit()
            
            bonus_text = ""
            if streak_result.get("bonus_xp", 0) > 0:
                bonus_text = f"\n🔥 Бонус за серию: +{int(streak_result['bonus_xp'])} XP"
            
            message = (
                f"✅ <b>Время добавлено!</b>\n\n"
                f"📝 Активность: {activity.name}\n"
                f"⏱ Время: {minutes} минут\n"
                f"💰 Заработано: {int(xp_earned)} XP{bonus_text}\n"
                f"💳 Баланс: {int(wallet.balance) if wallet else 0} XP"
            )
            
            await update.message.reply_text(message, parse_mode='HTML', reply_markup=get_main_menu_keyboard())
            context.user_data.pop('waiting_for_minutes', None)
            context.user_data.pop('activity_id', None)
        finally:
            db.close()
            
    except ValueError:
        await update.message.reply_text("❌ Введите число от 1 до 1440 минут.")
    except Exception as e:
        logger.error(f"Error handling custom minutes: {e}")
        await update.message.reply_text("❌ Произошла ошибка.")
        context.user_data.pop('waiting_for_minutes', None)
        context.user_data.pop('activity_id', None)


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
    
    # Обработчик нажатий на кнопки (должен быть ПЕРЕД MessageHandler)
    application.add_handler(CallbackQueryHandler(button_callback))
    logger.info("CallbackQueryHandler registered for button_callback")
    
    # Обработчик ввода пользовательского количества минут
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_custom_minutes))
    logger.info("MessageHandler registered for custom minutes input")
    
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

