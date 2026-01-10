# Инструкция по деплою на хостинг ukraine.com.ua

## 📋 Рекомендуемый тариф

Для вашего проекта (FastAPI + PostgreSQL + Telegram бот) рекомендуется **VPS**.

### Почему VPS:
- ✅ Полный контроль над сервером
- ✅ Возможность установить Python и все зависимости
- ✅ Поддержка долгоживущих процессов (Telegram бот)
- ✅ Можно установить PostgreSQL или использовать отдельную услугу
- ✅ Гибкость в настройке

### Минимальные требования:
- **CPU**: 1-2 ядра
- **RAM**: 1-2 GB
- **Диск**: 20-40 GB SSD
- **PostgreSQL**: отдельная услуга или установка на VPS

## 🔧 Подготовка к деплою

### 1. Настройка PostgreSQL

#### Вариант A: Отдельная услуга PostgreSQL (рекомендуется)
1. Закажите услугу PostgreSQL на хостинге
2. Получите данные подключения:
   - Хост
   - Порт (обычно 5432)
   - Имя базы данных
   - Пользователь
   - Пароль

#### Вариант B: Установка PostgreSQL на VPS
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Создание базы данных
sudo -u postgres psql
CREATE DATABASE hp_tracker;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE hp_tracker TO myuser;
\q
```

### 2. Настройка переменных окружения

Создайте файл `.env` на сервере:

```bash
# База данных
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/hp_tracker

# Telegram бот
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# JWT секрет (сгенерируйте случайную строку)
SECRET_KEY=your_secret_key_here

# Дополнительные настройки
ENVIRONMENT=production
```

### 3. Установка зависимостей на сервере

```bash
# Обновление системы
sudo apt update
sudo apt upgrade -y

# Установка Python и pip
sudo apt install python3 python3-pip python3-venv -y

# Установка PostgreSQL клиента (если нужно)
sudo apt install libpq-dev python3-dev -y

# Клонирование проекта
git clone <your-repo-url>
cd hp_life_tracker

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Применение миграций

```bash
# Активируйте виртуальное окружение
source venv/bin/activate

# Установите переменную окружения
export DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/hp_tracker

# Примените миграции
alembic upgrade head
```

## 🚀 Запуск приложения

### 1. Запуск FastAPI через systemd

Создайте файл `/etc/systemd/system/hp-tracker.service`:

```ini
[Unit]
Description=HP Life Tracker FastAPI
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/hp_life_tracker
Environment="PATH=/path/to/hp_life_tracker/venv/bin"
Environment="DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/hp_tracker"
Environment="TELEGRAM_BOT_TOKEN=your_token"
Environment="SECRET_KEY=your_secret_key"
ExecStart=/path/to/hp_life_tracker/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Активация сервиса:
```bash
sudo systemctl daemon-reload
sudo systemctl enable hp-tracker
sudo systemctl start hp-tracker
sudo systemctl status hp-tracker
```

### 2. Запуск Telegram бота через systemd

Создайте файл `/etc/systemd/system/hp-tracker-bot.service`:

```ini
[Unit]
Description=HP Life Tracker Telegram Bot
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/hp_life_tracker
Environment="PATH=/path/to/hp_life_tracker/venv/bin"
Environment="DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/hp_tracker"
Environment="TELEGRAM_BOT_TOKEN=your_token"
ExecStart=/path/to/hp_life_tracker/venv/bin/python run_telegram_bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Активация сервиса:
```bash
sudo systemctl daemon-reload
sudo systemctl enable hp-tracker-bot
sudo systemctl start hp-tracker-bot
sudo systemctl status hp-tracker-bot
```

### 3. Настройка Nginx (опционально, для веб-интерфейса)

Установите Nginx:
```bash
sudo apt install nginx -y
```

Создайте конфигурацию `/etc/nginx/sites-available/hp-tracker`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /path/to/hp_life_tracker/static;
    }
}
```

Активация:
```bash
sudo ln -s /etc/nginx/sites-available/hp-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Настройка SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 📊 Мониторинг и логи

### Просмотр логов приложения:
```bash
# FastAPI
sudo journalctl -u hp-tracker -f

# Telegram бот
sudo journalctl -u hp-tracker-bot -f
```

### Проверка статуса:
```bash
sudo systemctl status hp-tracker
sudo systemctl status hp-tracker-bot
```

## 🔄 Обновление приложения

```bash
cd /path/to/hp_life_tracker
source venv/bin/activate
git pull
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart hp-tracker
sudo systemctl restart hp-tracker-bot
```

## 🔒 Безопасность

1. **Firewall**: Настройте UFW или iptables
   ```bash
   sudo ufw allow 22/tcp  # SSH
   sudo ufw allow 80/tcp  # HTTP
   sudo ufw allow 443/tcp # HTTPS
   sudo ufw enable
   ```

2. **База данных**: Используйте сильные пароли
3. **Переменные окружения**: Не коммитьте `.env` в Git
4. **SSL**: Обязательно используйте HTTPS в продакшене

## 📝 Чек-лист перед запуском

- [ ] PostgreSQL установлен и настроен
- [ ] База данных создана
- [ ] Переменные окружения настроены
- [ ] Зависимости установлены
- [ ] Миграции применены
- [ ] Systemd сервисы созданы и запущены
- [ ] Nginx настроен (если используется)
- [ ] SSL сертификат установлен
- [ ] Firewall настроен
- [ ] Логи проверяются
- [ ] Telegram бот работает
- [ ] Веб-интерфейс доступен

## 🆘 Решение проблем

### Проблема: Приложение не запускается
- Проверьте логи: `sudo journalctl -u hp-tracker -n 50`
- Проверьте переменные окружения
- Убедитесь, что порт не занят: `sudo netstat -tulpn | grep 8000`

### Проблема: Ошибка подключения к PostgreSQL
- Проверьте, что PostgreSQL запущен: `sudo systemctl status postgresql`
- Проверьте данные подключения в `DATABASE_URL`
- Проверьте права доступа пользователя БД

### Проблема: Telegram бот не отвечает
- Проверьте токен бота
- Проверьте логи: `sudo journalctl -u hp-tracker-bot -f`
- Убедитесь, что бот запущен: `sudo systemctl status hp-tracker-bot`

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи сервисов
2. Обратитесь в техподдержку хостинга: https://www.ukraine.com.ua/ru/
3. Проверьте документацию FastAPI и PostgreSQL




