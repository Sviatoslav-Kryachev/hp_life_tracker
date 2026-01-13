# app/routers/categories.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.base import CustomCategory, User, Activity

router = APIRouter(prefix="/categories", tags=["categories"])


class CategoryCreate(BaseModel):
    name: str
    replace_standard_category: Optional[str] = None  # ID стандартной категории для замены


class CategoryUpdate(BaseModel):
    name: str


@router.get("/")
async def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все категории пользователя (стандартные + пользовательские)"""
    # Стандартные категории
    standard_categories = [
        {"id": "general", "name": "Общее", "is_custom": False},
        {"id": "study", "name": "Учеба", "is_custom": False},
        {"id": "sport", "name": "Спорт", "is_custom": False},
        {"id": "hobby", "name": "Хобби", "is_custom": False},
        {"id": "work", "name": "Работа", "is_custom": False},
        {"id": "health", "name": "Здоровье", "is_custom": False},
    ]
    
    # Пользовательские категории
    custom_categories = db.query(CustomCategory).filter(
        CustomCategory.user_id == current_user.id
    ).all()
    
    custom_list = [
        {
            "id": f"custom_{cat.id}", 
            "name": cat.name, 
            "is_custom": True, 
            "db_id": cat.id,
            "replaced_standard_category": cat.replaced_standard_category  # ID стандартной категории, которую заменяет
        }
        for cat in custom_categories
    ]
    
    return {
        "standard": standard_categories,
        "custom": custom_list,
        "all": standard_categories + custom_list
    }


@router.post("/")
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать пользовательскую категорию"""
    # Стандартные категории
    standard_categories = ["Общее", "Учеба", "Спорт", "Хобби", "Работа", "Здоровье"]
    
    # Проверяем, не является ли это стандартной категорией
    if category.name in standard_categories:
        raise HTTPException(status_code=400, detail="Категория с таким названием уже существует (стандартная категория)")
    
    # Проверяем, не существует ли уже такая пользовательская категория
    existing = db.query(CustomCategory).filter(
        CustomCategory.user_id == current_user.id,
        CustomCategory.name == category.name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Категория с таким названием уже существует")
    
    new_category = CustomCategory(
        user_id=current_user.id,
        name=category.name,
        replaced_standard_category=category.replace_standard_category if category.replace_standard_category else None
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    # Если редактируем стандартную категорию, обновляем все активности
    if category.replace_standard_category:
        # Обновляем все активности, которые используют старую стандартную категорию
        db.query(Activity).filter(
            Activity.user_id == current_user.id,
            Activity.category == category.replace_standard_category
        ).update({Activity.category: f"custom_{new_category.id}"})
        db.commit()
    
    return {"id": f"custom_{new_category.id}", "name": new_category.name, "is_custom": True, "db_id": new_category.id}


@router.put("/{category_id}")
async def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить пользовательскую категорию"""
    custom_category = db.query(CustomCategory).filter(
        CustomCategory.id == category_id,
        CustomCategory.user_id == current_user.id
    ).first()
    
    if not custom_category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Проверяем, не существует ли уже категория с таким названием
    existing = db.query(CustomCategory).filter(
        CustomCategory.user_id == current_user.id,
        CustomCategory.name == category.name,
        CustomCategory.id != category_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Категория с таким названием уже существует")
    
    old_name = custom_category.name
    custom_category.name = category.name
    
    # Обновляем все активности, использующие эту категорию
    db.query(Activity).filter(
        Activity.user_id == current_user.id,
        Activity.category == f"custom_{category_id}"
    ).update({Activity.category: f"custom_{custom_category.id}"})
    
    db.commit()
    db.refresh(custom_category)
    
    return {"id": f"custom_{custom_category.id}", "name": custom_category.name, "is_custom": True, "db_id": custom_category.id}


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить пользовательскую категорию"""
    custom_category = db.query(CustomCategory).filter(
        CustomCategory.id == category_id,
        CustomCategory.user_id == current_user.id
    ).first()
    
    if not custom_category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    
    # Проверяем, используется ли категория в активностях
    activities_count = db.query(Activity).filter(
        Activity.user_id == current_user.id,
        Activity.category == f"custom_{category_id}"
    ).count()
    
    if activities_count > 0:
        # Переводим активности в категорию "Общее"
        db.query(Activity).filter(
            Activity.user_id == current_user.id,
            Activity.category == f"custom_{category_id}"
        ).update({Activity.category: "general"})
    
    db.delete(custom_category)
    db.commit()
    
    return {"message": "Категория удалена"}

