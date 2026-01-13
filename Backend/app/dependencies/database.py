# app/dependencies/database.py
from typing import Generator
from sqlalchemy.orm import Session
from fastapi import Depends

from app.core.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Dependency для получения сессии базы данных.
    
    Использование:
        @router.get("/items")
        async def get_items(db: Session = Depends(get_db)):
            ...
    
    Автоматически закрывает сессию после завершения запроса.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
