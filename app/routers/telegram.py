# app/routers/telegram.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.utils.database import get_db
from app.utils.auth import get_current_user
from app.models.base import User

router = APIRouter(prefix="/telegram", tags=["telegram"])


class TelegramLinkRequest(BaseModel):
    telegram_id: int
    telegram_username: str = None


@router.post("/link")
async def link_telegram_account(
    link_data: TelegramLinkRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Привязать Telegram аккаунт к пользователю"""
    # Проверяем, не привязан ли уже этот Telegram ID к другому пользователю
    existing_user = db.query(User).filter(
        User.telegram_id == link_data.telegram_id,
        User.id != current_user.id
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Этот Telegram аккаунт уже привязан к другому пользователю"
        )
    
    # Привязываем Telegram аккаунт
    current_user.telegram_id = link_data.telegram_id
    current_user.telegram_username = link_data.telegram_username
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Telegram аккаунт успешно привязан",
        "telegram_id": current_user.telegram_id,
        "telegram_username": current_user.telegram_username
    }


@router.post("/unlink")
async def unlink_telegram_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отвязать Telegram аккаунт"""
    current_user.telegram_id = None
    current_user.telegram_username = None
    
    db.commit()
    
    return {"message": "Telegram аккаунт отвязан"}


@router.get("/status")
async def get_telegram_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Проверить статус привязки Telegram"""
    return {
        "linked": current_user.telegram_id is not None,
        "telegram_id": current_user.telegram_id,
        "telegram_username": current_user.telegram_username
    }








