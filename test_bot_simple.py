#!/usr/bin/env python3
"""Простой тест бота"""
import asyncio
import logging
from telegram import Bot
from telegram.ext import Application, CommandHandler

logging.basicConfig(level=logging.INFO)

async def start(update, context):
    await update.message.reply_text("✅ Бот работает! Это тестовое сообщение.")

async def main():
    from config import TELEGRAM_BOT_TOKEN
    
    print(f"🔄 Создание приложения с токеном: {TELEGRAM_BOT_TOKEN[:15]}...")
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    print("📝 Регистрация команды /start...")
    application.add_handler(CommandHandler("start", start))
    
    print("🤖 Запуск бота...")
    print("=" * 50)
    print("✅ Бот запущен! Отправьте /start в Telegram")
    print("=" * 50)
    
    await application.initialize()
    await application.start()
    await application.updater.start_polling()
    
    # Держим бота запущенным
    try:
        await asyncio.Event().wait()
    except KeyboardInterrupt:
        print("\n⏹️  Остановка бота...")
    finally:
        await application.updater.stop()
        await application.stop()
        await application.shutdown()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()









