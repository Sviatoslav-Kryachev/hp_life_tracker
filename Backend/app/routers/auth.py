# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.models.base import User, XPWallet
from app.schemas import UserCreate, UserOut, Token
from pydantic import BaseModel
from app.utils.database import get_db
from app.utils.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    # Проверяем, не занят ли email
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует"
        )
    
    # Проверяем username если указан
    username = user_data.username or user_data.email.split("@")[0]
    existing_username = db.query(User).filter(User.username == username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Это имя пользователя уже занято"
        )
    
    # Проверяем код приглашения, если указан
    parent_id = None
    is_admin = 0
    
    # Проверяем, есть ли уже пользователи в системе
    user_count = db.query(User).count()
    
    if hasattr(user_data, 'invite_code') and user_data.invite_code:
        parent = db.query(User).filter(User.invite_code == user_data.invite_code).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный код приглашения"
            )
        parent_id = parent.id
    elif user_count == 0:
        # Первый пользователь автоматически становится администратором
        is_admin = 1
    
    # Создаём пользователя
    new_user = User(
        email=user_data.email,
        username=username,
        password_hash=get_password_hash(user_data.password),
        parent_id=parent_id,
        is_admin=is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Создаём кошелёк XP для нового пользователя
    wallet = XPWallet(user_id=new_user.id, balance=0.0, level=1, total_earned=0.0, total_spent=0.0)
    db.add(wallet)
    db.commit()
    
    return new_user


@router.post("/login", response_model=Token)
def login(form_data: UserCreate, db: Session = Depends(get_db)):
    """Вход в систему"""
    # Убираем пробелы в начале и конце email
    email = form_data.email.strip().lower() if form_data.email else ""
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Проверяем пароль (убираем пробелы в начале и конце)
    password = form_data.password.strip() if form_data.password else ""
    
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    """Получить информацию о текущем пользователе"""
    return current_user


class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Запрос на сброс пароля - генерирует код"""
    email = request.email
    """Запрос на сброс пароля - генерирует код"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Не раскрываем, существует ли пользователь (безопасность)
        return {"message": "Если пользователь с таким email существует, код отправлен"}
    
    # Генерируем простой 6-значный код
    import random
    reset_code = str(random.randint(100000, 999999))
    
    # Сохраняем код в сессии/памяти (в продакшене - в Redis или БД)
    # Для простоты используем словарь в памяти
    if not hasattr(forgot_password, 'reset_codes'):
        forgot_password.reset_codes = {}
    
    forgot_password.reset_codes[email] = {
        'code': reset_code,
        'user_id': user.id,
        'expires_at': None  # В продакшене добавить время истечения
    }
    
    # В реальном приложении отправить код на email
    # Для разработки просто возвращаем код
    return {
        "message": "Код для сброса пароля сгенерирован",
        "code": reset_code,  # Только для разработки! В продакшене убрать
        "note": "В продакшене код будет отправлен на email"
    }


@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """Сброс пароля по коду"""
    email = request.email
    code = request.code
    new_password = request.new_password
    
    if not hasattr(forgot_password, 'reset_codes'):
        raise HTTPException(status_code=400, detail="Код не найден или истёк")
    
    if email not in forgot_password.reset_codes:
        raise HTTPException(status_code=400, detail="Код не найден или истёк")
    
    reset_data = forgot_password.reset_codes[email]
    
    if reset_data['code'] != code:
        raise HTTPException(status_code=400, detail="Неверный код")
    
    # Обновляем пароль
    user = db.query(User).filter(User.id == reset_data['user_id']).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    user.password_hash = get_password_hash(new_password)
    db.commit()
    
    # Удаляем использованный код
    del forgot_password.reset_codes[email]
    
    return {"message": "Пароль успешно изменён"}
