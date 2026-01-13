# app/repositories/base_repository.py
from typing import Generic, TypeVar, Type, Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from fastapi import HTTPException

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    """Базовый репозиторий с общими CRUD операциями"""
    
    def __init__(self, model: Type[ModelType], db: Session):
        """
        Инициализация репозитория
        
        Args:
            model: SQLAlchemy модель
            db: Сессия базы данных
        """
        self.model = model
        self.db = db
    
    def get_by_id(self, id: int) -> Optional[ModelType]:
        """Получить запись по ID"""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Получить все записи с пагинацией"""
        return self.db.query(self.model).offset(skip).limit(limit).all()
    
    def get_by_field(self, field_name: str, value: Any) -> Optional[ModelType]:
        """Получить запись по полю"""
        return self.db.query(self.model).filter(getattr(self.model, field_name) == value).first()
    
    def get_all_by_field(self, field_name: str, value: Any, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Получить все записи по полю"""
        return self.db.query(self.model).filter(
            getattr(self.model, field_name) == value
        ).offset(skip).limit(limit).all()
    
    def create(self, **kwargs) -> ModelType:
        """Создать новую запись"""
        instance = self.model(**kwargs)
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)
        return instance
    
    def update(self, id: int, **kwargs) -> Optional[ModelType]:
        """Обновить запись по ID"""
        instance = self.get_by_id(id)
        if not instance:
            return None
        
        for key, value in kwargs.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        
        self.db.commit()
        self.db.refresh(instance)
        return instance
    
    def delete(self, id: int) -> bool:
        """Удалить запись по ID"""
        instance = self.get_by_id(id)
        if not instance:
            return False
        
        self.db.delete(instance)
        self.db.commit()
        return True
    
    def count(self) -> int:
        """Получить количество записей"""
        return self.db.query(self.model).count()
    
    def count_by_field(self, field_name: str, value: Any) -> int:
        """Получить количество записей по полю"""
        return self.db.query(self.model).filter(getattr(self.model, field_name) == value).count()
    
    def exists(self, id: int) -> bool:
        """Проверить существование записи по ID"""
        return self.db.query(self.model).filter(self.model.id == id).first() is not None
    
    def exists_by_field(self, field_name: str, value: Any) -> bool:
        """Проверить существование записи по полю"""
        return self.db.query(self.model).filter(getattr(self.model, field_name) == value).first() is not None
