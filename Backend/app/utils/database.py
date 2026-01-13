import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Поддержка PostgreSQL и SQLite
# Для PostgreSQL используйте переменную окружения DATABASE_URL
# Формат: postgresql://user:password@host:port/database
# Пример: postgresql://myuser:mypassword@localhost:5432/hp_tracker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./hp_life_tracker.db"  # По умолчанию SQLite для разработки
)

# Настройки для разных типов БД
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Проверка соединения перед использованием
        pool_size=10,
        max_overflow=20
    )
else:
    # SQLite (для разработки)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
