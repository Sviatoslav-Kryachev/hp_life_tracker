# app/schemas/response/xp.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class WalletOut(BaseModel):
    """Схема для вывода информации о кошельке"""
    balance: float = Field(..., description="Текущий баланс XP")
    total_earned: float = Field(..., description="Всего заработано XP")
    total_spent: float = Field(..., description="Всего потрачено XP")
    level: int = Field(..., description="Текущий уровень")


class XPHistoryItem(BaseModel):
    """Схема для элемента истории XP"""
    id: int = Field(..., description="ID записи")
    activity_name: str = Field(..., description="Название активности")
    duration_minutes: Optional[float] = Field(None, description="Длительность в минутах")
    xp_earned: float = Field(..., description="Заработано XP")
    date: Optional[str] = Field(None, description="Дата в ISO формате")


class TodayStats(BaseModel):
    """Схема для статистики за сегодня"""
    earned_today: float = Field(..., description="Заработано сегодня")
    spent_today: float = Field(..., description="Потрачено сегодня")
    sessions_today: int = Field(..., description="Количество сессий сегодня")
    time_today_minutes: float = Field(..., description="Время сегодня в минутах")
    net_today: float = Field(..., description="Чистый баланс сегодня")


class WeekStats(BaseModel):
    """Схема для статистики за неделю"""
    date: str = Field(..., description="Дата")
    day_name: str = Field(..., description="Название дня недели")
    earned: float = Field(..., description="Заработано")
    spent: float = Field(..., description="Потрачено")
    time_minutes: float = Field(..., description="Время в минутах")
