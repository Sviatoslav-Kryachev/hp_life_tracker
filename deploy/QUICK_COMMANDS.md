# Быстрые команды для работы с проектом на VPS

## Подключение к серверу
```powershell
# PowerShell (локально)
ssh root@SERVER_IP
```

## Основные команды Docker Compose

### VPS (root) - все команды выполняются в `/opt/hp-life-tracker`

```bash
cd /opt/hp-life-tracker

# Запуск проекта
docker compose up -d --build

# Остановка проекта (данные сохраняются)
docker compose down

# Перезапуск
docker compose restart

# Просмотр логов
docker compose logs -f app
docker compose logs -f db

# Статус контейнеров
docker compose ps

# Пересборка и перезапуск
docker compose up -d --build
```

## Работа с базой данных

```bash
# Подключение к PostgreSQL
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db

# Выполнение SQL команды
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT COUNT(*) FROM users;"

# Резервная копия
docker compose exec db pg_dump -U hp_life_tracker_user hp_life_tracker_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Список таблиц
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "\dt"
```

## Работа с volumes (проверка сохранения данных)

```bash
# Список volumes
docker volume ls | grep hp_life_tracker

# Информация о volume
docker volume inspect pgdata_hp_life_tracker

# Размер данных в volume
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT pg_size_pretty(pg_database_size('hp_life_tracker_db'));"
```

## Nginx

```bash
# Проверка конфига
nginx -t

# Перезагрузка
systemctl reload nginx

# Логи
tail -f /var/log/nginx/hp-life-tracker_error.log
tail -f /var/log/nginx/hp-life-tracker_access.log
```

## SSL (Certbot)

```bash
# Обновление сертификата (тест)
certbot renew --dry-run

# Принудительное обновление
certbot renew --force-renewal

# Список сертификатов
certbot certificates
```

## Проверка работоспособности

```bash
# Проверка приложения локально
curl http://127.0.0.1:8001/

# Проверка через домен (на сервере)
curl https://hp-life-tracker.app-toolbox.space/

# Проверка подключения к БД
docker compose exec db pg_isready -U hp_life_tracker_user
```

## Полный перезапуск с сохранением данных

```bash
cd /opt/hp-life-tracker
docker compose down
docker compose up -d
```

## Проверка сохранения данных БД

```bash
# 1. Создаем тестовую таблицу
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "CREATE TABLE IF NOT EXISTS test_persistence (id SERIAL PRIMARY KEY, data TEXT, created_at TIMESTAMP DEFAULT NOW());"

# 2. Добавляем данные
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "INSERT INTO test_persistence (data) VALUES ('Тест ' || NOW());"

# 3. Проверяем данные
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT * FROM test_persistence ORDER BY created_at DESC LIMIT 5;"

# 4. Останавливаем контейнеры
docker compose down

# 5. Запускаем заново
docker compose up -d

# 6. Ждем запуска БД (10 секунд)
sleep 10

# 7. Проверяем, что данные на месте
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT * FROM test_persistence ORDER BY created_at DESC LIMIT 5;"
```
