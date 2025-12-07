#!/usr/bin/env python3
"""Запуск бота с подробными логами"""
import logging
import sys

# Настройка подробного логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.DEBUG,
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

try:
    print("🔄 Проверка конфигурации...")
    from config import TELEGRAM_BOT_TOKEN
    
    if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN == "YOUR_TOKEN_HERE":
        print("❌ Токен не установлен!")
        sys.exit(1)
    
    print(f"✅ Токен найден: {TELEGRAM_BOT_TOKEN[:15]}...")
    print("🔄 Импорт модулей бота...")
    
    from app.telegram_bot import run_bot
    
    print("✅ Модули загружены")
    print("🤖 Запуск бота...")
    print("=" * 50)
    print("Бот запущен! Отправьте /start в Telegram")
    print("Для остановки нажмите Ctrl+C")
    print("=" * 50)
    
    run_bot()
    
except KeyboardInterrupt:
    print("\n\n⏹️  Бот остановлен пользователем")
except Exception as e:
    print(f"\n❌ Ошибка при запуске: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)




