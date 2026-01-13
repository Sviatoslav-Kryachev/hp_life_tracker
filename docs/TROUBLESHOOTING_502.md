# Исправление ошибки 502 Bad Gateway

## Проблема
Nginx возвращает 502 Bad Gateway - это означает, что Nginx не может подключиться к приложению FastAPI.

## Диагностика

### 1. Проверьте статус Docker контейнеров
```bash
cd /opt/hp-life-tracker
docker compose ps
```

Ожидаемый результат:
- `hp-life-tracker_app` должен быть в статусе `Up`
- `hp-life-tracker_db` должен быть в статусе `Up (healthy)`

### 2. Проверьте логи приложения
```bash
docker compose logs app
# Или последние 50 строк:
docker compose logs --tail=50 app
```

Ищите ошибки:
- Ошибки импорта Python
- Ошибки подключения к БД
- Ошибки миграций Alembic

### 3. Проверьте, что приложение слушает правильный порт
```bash
docker exec hp-life-tracker_app netstat -tlnp | grep 8000
# Или
docker exec hp-life-tracker_app ps aux | grep uvicorn
```

### 4. Проверьте конфигурацию Nginx
```bash
# Проверьте конфиг Nginx
cat /etc/nginx/sites-available/hp-life-tracker.conf
# Или если используется другой путь:
cat /etc/nginx/conf.d/hp-life-tracker.conf

# Проверьте синтаксис Nginx
sudo nginx -t

# Перезагрузите Nginx
sudo systemctl reload nginx
```

## Решения

### Решение 1: Перезапустить контейнеры
```bash
cd /opt/hp-life-tracker
docker compose restart app
docker compose logs -f app
```

### Решение 2: Проверить подключение к БД
```bash
# Проверьте, что БД доступна
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT 1;"

# Проверьте переменные окружения
docker compose exec app env | grep DATABASE
```

### Решение 3: Пересоздать контейнеры
```bash
cd /opt/hp-life-tracker
docker compose down
docker compose up -d
docker compose logs -f app
```

### Решение 4: Проверить миграции Alembic
```bash
docker compose exec app alembic current
docker compose exec app alembic upgrade head
```

### Решение 5: Проверить конфигурацию Nginx
Убедитесь, что в конфиге Nginx указан правильный upstream:
```nginx
upstream hp_life_tracker {
    server 127.0.0.1:8000;
}
```

И что proxy_pass указывает на этот upstream:
```nginx
location / {
    proxy_pass http://hp_life_tracker;
    ...
}
```

## Быстрая проверка

Выполните все команды по порядку:
```bash
cd /opt/hp-life-tracker

# 1. Проверка статуса
docker compose ps

# 2. Проверка логов
docker compose logs --tail=100 app

# 3. Перезапуск
docker compose restart app

# 4. Проверка логов в реальном времени
docker compose logs -f app
```

Если проблема не решена, скопируйте вывод логов и проверьте конфигурацию Nginx.
