# Исправление проблемы с Telegram ботом

## Диагностика проблемы

Выполните на сервере следующие команды для диагностики:

### 1. Проверьте статус systemd сервиса (если он установлен):

```bash
sudo systemctl status hp-life-tracker-bot
```

### 2. Проверьте логи бота:

```bash
# Если systemd сервис установлен:
sudo journalctl -u hp-life-tracker-bot -n 50 --no-pager

# Или проверьте логи в контейнере (если бот запущен в Docker):
docker compose logs app | grep -i telegram
```

### 3. Проверьте переменную окружения TELEGRAM_BOT_TOKEN:

```bash
# В контейнере приложения:
docker compose exec app env | grep TELEGRAM_BOT_TOKEN

# Или проверьте .env файл:
cat .env | grep TELEGRAM_BOT_TOKEN
```

### 4. Проверьте, запущен ли процесс бота:

```bash
# На хосте (если запущен как systemd сервис):
ps aux | grep telegram_bot

# В контейнере:
docker compose exec app ps aux | grep telegram_bot
```

## Решения проблем

### Проблема 1: Бот не запущен

Если бот не запущен, запустите его одним из способов:

#### Вариант A: Через Docker Compose (в контейнере приложения)

```bash
# Войдите в контейнер
docker compose exec app bash

# Запустите бота вручную для тестирования
export TELEGRAM_BOT_TOKEN="ваш_токен_здесь"
python run_telegram_bot.py
```

#### Вариант B: Через systemd сервис (рекомендуется)

1. Убедитесь, что файл сервиса существует:

```bash
cat /etc/systemd/system/hp-life-tracker-bot.service
```

2. Если файла нет, создайте его:

```bash
sudo nano /etc/systemd/system/hp-life-tracker-bot.service
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
Environment="DATABASE_URL=postgresql://hp_life_tracker_user:ваш_пароль@db:5432/hp_life_tracker_db"
ExecStart=/usr/bin/docker compose exec -T app python run_telegram_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

3. Перезагрузите systemd и запустите сервис:

```bash
sudo systemctl daemon-reload
sudo systemctl enable hp-life-tracker-bot
sudo systemctl start hp-life-tracker-bot
sudo systemctl status hp-life-tracker-bot
```

### Проблема 2: TELEGRAM_BOT_TOKEN не установлен

1. Получите токен от @BotFather в Telegram
2. Добавьте токен в `.env` файл:

```bash
echo "TELEGRAM_BOT_TOKEN=ваш_токен_здесь" >> .env
```

3. Перезапустите контейнеры:

```bash
docker compose down
docker compose up -d
```

### Проблема 3: Бот падает с ошибками

Проверьте логи для выявления ошибок:

```bash
# Логи systemd сервиса:
sudo journalctl -u hp-life-tracker-bot -f

# Логи Docker контейнера:
docker compose logs -f app
```

Частые ошибки:

- **"TELEGRAM_BOT_TOKEN не установлен"** → Установите токен в `.env` файл
- **"Connection to database failed"** → Проверьте настройки базы данных в `.env`
- **"Module not found"** → Убедитесь, что все зависимости установлены в контейнере

### Проблема 4: Бот запущен, но не отвечает

1. Проверьте, что токен правильный:

```bash
# Попробуйте запустить бота вручную для тестирования
docker compose exec app python run_telegram_bot.py
```

2. Проверьте, что бот добавлен в Telegram и отправьте ему `/start`

3. Проверьте логи на наличие ошибок обработки сообщений

## Быстрая проверка работоспособности

```bash
# 1. Проверьте токен
docker compose exec app env | grep TELEGRAM_BOT_TOKEN

# 2. Проверьте, что бот может подключиться к Telegram API
docker compose exec app python -c "import os; from telegram import Bot; bot = Bot(os.getenv('TELEGRAM_BOT_TOKEN')); print(bot.get_me())"

# 3. Если всё хорошо, запустите бота
docker compose exec app python run_telegram_bot.py
```

Если команда из пункта 2 работает (выводит информацию о боте), значит проблема не в токене.

## Альтернативный способ запуска (в фоне)

Если systemd не подходит, можно запустить бота в screen/tmux:

```bash
# Установите screen (если нет)
sudo apt-get install screen -y

# Создайте сессию screen
screen -S telegram_bot

# Запустите бота
cd /opt/hp-life-tracker
docker compose exec app python run_telegram_bot.py

# Нажмите Ctrl+A затем D для отсоединения от сессии
# Для возврата: screen -r telegram_bot
```
