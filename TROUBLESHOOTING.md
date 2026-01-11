# Устранение проблем

## Проблема: Ошибка при регистрации

### Симптомы:
- При регистрации показывается ошибка
- Но вход после регистрации работает
- Ошибка связана с полями Telegram

### Решение:

**1. Проверьте миграции базы данных:**

На сервере (VPS):
```bash
cd /opt/hp-life-tracker

# Проверьте, применены ли все миграции
docker compose exec app alembic current

# Примените все миграции
docker compose exec app alembic upgrade head

# Проверьте структуру таблицы users
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "\d users"
```

**2. Если миграции не применяются, пересоздайте базу данных (⚠️ Удалит данные!):**

```bash
# ОСТОРОЖНО: Это удалит все данные!
cd /opt/hp-life-tracker
docker compose down -v
docker compose up -d --build
```

**3. Проверьте логи приложения:**

```bash
docker compose logs app | grep -i error
docker compose logs app | tail -50
```

---

## Проблема: Telegram бот не работает

### Симптомы:
- Telegram бот не отвечает на команды
- Бот не запущен

### Решение:

**1. Telegram бот должен запускаться отдельно от основного приложения**

В `docker-compose.yml` нет сервиса для Telegram бота - он запускается отдельным процессом.

**2. Запустите бота на сервере:**

**Вариант A: Через systemd (рекомендуется для продакшена)**

Создайте файл сервиса:
```bash
nano /etc/systemd/system/hp-life-tracker-bot.service
```

Содержимое файла:
```ini
[Unit]
Description=HP Life Tracker Telegram Bot
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/hp-life-tracker
Environment="TELEGRAM_BOT_TOKEN=ваш_токен_здесь"
Environment="DATABASE_URL=postgresql://hp_life_tracker_user:ваш_пароль@localhost:5432/hp_life_tracker_db"
ExecStart=/usr/bin/docker compose exec -T app python run_telegram_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Или запустите через Python напрямую (если Python установлен на сервере):
```ini
[Unit]
Description=HP Life Tracker Telegram Bot
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/hp-life-tracker
Environment="TELEGRAM_BOT_TOKEN=ваш_токен_здесь"
Environment="DATABASE_URL=postgresql://hp_life_tracker_user:ваш_пароль@db:5432/hp_life_tracker_db"
ExecStart=/usr/bin/python3 run_telegram_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
# Обновите systemd
systemctl daemon-reload

# Включите автозапуск
systemctl enable hp-life-tracker-bot

# Запустите бота
systemctl start hp-life-tracker-bot

# Проверьте статус
systemctl status hp-life-tracker-bot

# Смотрите логи
journalctl -u hp-life-tracker-bot -f
```

**Вариант B: Запуск вручную (для тестирования)**

```bash
cd /opt/hp-life-tracker

# Установите токен в переменную окружения
export TELEGRAM_BOT_TOKEN="ваш_токен_здесь"

# Запустите бота
docker compose exec app python run_telegram_bot.py

# Или если Python установлен на сервере:
python3 run_telegram_bot.py
```

**3. Проверьте токен:**

Убедитесь, что токен установлен в `.env` файле:
```bash
cd /opt/hp-life-tracker
grep TELEGRAM_BOT_TOKEN .env
```

Если токена нет, добавьте его:
```bash
nano .env
# Добавьте строку:
# TELEGRAM_BOT_TOKEN=ваш_токен_здесь
```

**4. Проверьте подключение к базе данных:**

Бот должен иметь доступ к той же базе данных, что и приложение. Убедитесь, что `DATABASE_URL` правильный.

---

## Быстрая диагностика

### Проверить всё сразу:

```bash
cd /opt/hp-life-tracker

# 1. Проверьте статус контейнеров
docker compose ps

# 2. Проверьте логи приложения
docker compose logs app --tail=50

# 3. Проверьте миграции
docker compose exec app alembic current

# 4. Проверьте структуру таблицы users
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "\d users"

# 5. Проверьте, есть ли колонки telegram_id и telegram_username
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT column_name FROM information_schema.columns WHERE table_name='users';"

# 6. Проверьте токен Telegram бота
grep TELEGRAM_BOT_TOKEN .env
```

---

## Частые ошибки

### Ошибка: "column telegram_id does not exist"

**Решение:** Примените миграции:
```bash
docker compose exec app alembic upgrade head
```

### Ошибка: "relation does not exist"

**Решение:** База данных не инициализирована. Примените миграции:
```bash
docker compose exec app alembic upgrade head
```

### Ошибка: "TELEGRAM_BOT_TOKEN not set"

**Решение:** Добавьте токен в `.env` файл:
```bash
nano .env
# Добавьте: TELEGRAM_BOT_TOKEN=ваш_токен
```

### Бот не отвечает

**Решение:** 
1. Проверьте, запущен ли бот: `systemctl status hp-life-tracker-bot`
2. Проверьте логи: `journalctl -u hp-life-tracker-bot -f`
3. Убедитесь, что токен правильный
4. Проверьте, что бот может подключиться к базе данных
