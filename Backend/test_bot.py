#!/usr/bin/env python3
"""Тестовый скрипт для проверки бота"""
import sys
import os

# Проверяем токен
try:
    from config import TELEGRAM_BOT_TOKEN
    if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN == "YOUR_TOKEN_HERE":
        print("❌ ОШИБКА: Токен не установлен в config.py!")
        print("\n📝 Инструкция:")
        print("1. Откройте файл config.py")
        print("2. Замените YOUR_TOKEN_HERE на ваш реальный токен от @BotFather")
        print("3. Сохраните файл")
        print("4. Запустите бота снова: python run_telegram_bot.py")
        sys.exit(1)
    else:
        print(f"✅ Токен найден: {TELEGRAM_BOT_TOKEN[:10]}...")
except ImportError:
    print("❌ Файл config.py не найден!")
    sys.exit(1)

# Проверяем подключение к Telegram
try:
    from telegram import Bot
    print("🔄 Проверка подключения к Telegram...")
    bot = Bot(token=TELEGRAM_BOT_TOKEN)
    
    import asyncio
    async def test():
        try:
            me = await bot.get_me()
            print(f"✅ Бот подключен: @{me.username}")
            print(f"   Имя: {me.first_name}")
            return True
        except Exception as e:
            print(f"❌ Ошибка подключения: {e}")
            print("\nВозможные причины:")
            print("1. Неправильный токен")
            print("2. Проблемы с интернетом")
            print("3. Telegram API недоступен")
            return False
    
    result = asyncio.run(test())
    if result:
        print("\n✅ Всё готово! Запускаю бота...")
        print("📱 Бот будет работать в фоновом режиме")
        print("💡 Отправьте /start боту в Telegram")
        print("⚠️  Для остановки нажмите Ctrl+C\n")
        from app.telegram_bot import run_bot
        run_bot()
    else:
        sys.exit(1)
        
except ImportError as e:
    print(f"❌ Ошибка импорта: {e}")
    print("Установите зависимости: pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Неожиданная ошибка: {e}")
    sys.exit(1)

