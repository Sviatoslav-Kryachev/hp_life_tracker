FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements и установка зависимостей
COPY Backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование бэкенд кода
COPY Backend/ ./Backend/

# Копирование фронтенд кода
COPY Frontend/ ./Frontend/

# Создание директории для логов (если нужно)
RUN mkdir -p /app/logs

# Переменные окружения по умолчанию
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Открываем порт
EXPOSE 8000

# Устанавливаем рабочую директорию для бэкенда
WORKDIR /app/Backend

# Команда по умолчанию (переопределяется в docker-compose.yml)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
