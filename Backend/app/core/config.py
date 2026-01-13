# app/core/config.py
import os
from typing import Optional
try:
    from pydantic_settings import BaseSettings
except ImportError:
    # Fallback для старых версий pydantic
    from pydantic import BaseSettings


class Settings(BaseSettings):
    """Настройки приложения"""
    
    # База данных
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./hp_life_tracker.db"  # По умолчанию SQLite для разработки
    )
    
    # JWT и безопасность
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "your-super-secret-key-change-in-production-123456789"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 часа
    
    # Telegram Bot
    TELEGRAM_BOT_TOKEN: Optional[str] = os.getenv("TELEGRAM_BOT_TOKEN", None)
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]  # Разрешаем все origin для разработки
    
    # Приложение
    APP_NAME: str = "HP Life Tracker"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # PostgreSQL настройки пула соединений
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_PRE_PING: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Создаем экземпляр настроек
settings = Settings()
