# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Generator

from app.core.config import settings

# Поддержка PostgreSQL и SQLite
# Для PostgreSQL используйте переменную окружения DATABASE_URL
# Формат: postgresql://user:password@host:port/database
# Пример: postgresql://myuser:mypassword@localhost:5432/hp_tracker

# Настройки для разных типов БД
if settings.DATABASE_URL.startswith("postgresql"):
    # PostgreSQL
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=settings.DB_POOL_PRE_PING,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW
    )
else:
    # SQLite (для разработки)
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    """Dependency для получения сессии базы данных"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
