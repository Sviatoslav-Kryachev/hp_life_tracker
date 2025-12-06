from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from app.models.base import User
from app.schemas import UserCreate, Token
from app.utils.database import get_db
from passlib.context import CryptContext
from jose import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["auth"])

def create_access_token(data: dict, expires_delta):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=Token)
def login(form_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.email).first()
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль")
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}
