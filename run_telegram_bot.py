#!/usr/bin/env python3
"""
Скрипт для запуска Telegram бота отдельно от основного сервера
"""
import os
import sys
from app.telegram_bot import run_bot

if __name__ == "__main__":
    # Проверяем наличие токена
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        print("❌ Ошибка: TELEGRAM_BOT_TOKEN не установлен!")
        print("\nКак получить токен:")
        print("1. Найдите @BotFather в Telegram")
        print("2. Отправьте /newbot")
        print("3. Следуйте инструкциям")
        print("4. Скопируйте токен и установите переменную окружения:")
        print("   Windows: set TELEGRAM_BOT_TOKEN=your_token_here")
        print("   Linux/Mac: export TELEGRAM_BOT_TOKEN=your_token_here")
        sys.exit(1)
    
    # Устанавливаем токен в модуль
    import app.telegram_bot as bot_module
    bot_module.TELEGRAM_BOT_TOKEN = token
    
    print("🤖 Запуск Telegram бота...")
    run_bot()








