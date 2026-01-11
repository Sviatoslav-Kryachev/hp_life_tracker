# Инструкция по развертыванию проекта на VPS

## Требования
- VPS с Ubuntu 22.04
- Docker и Docker Compose установлены
- Nginx установлен и работает
- Certbot установлен
- Доступ по SSH (из PowerShell)

## Структура проекта на сервере
```
/opt/hp-life-tracker/
├── docker-compose.yml
├── Dockerfile
├── .env
├── deploy/nginx-hp-life-tracker.conf (конфиг для Nginx)
└── [весь код приложения]
```

---

## ШАГ 1: Подключение к серверу

### PowerShell (локально)
```powershell
ssh root@SERVER_IP
```
**Замените `SERVER_IP` на IP-адрес вашего VPS**

---

## ШАГ 2: Создание рабочей директории на сервере

### VPS (root)
```bash
# Создаем директорию для проекта
mkdir -p /opt/hp-life-tracker
cd /opt/hp-life-tracker
```

---

## ШАГ 3: Копирование файлов на сервер

### Вариант A: Через SCP из PowerShell

**В PowerShell (в отдельном окне, не в SSH сессии):**

```powershell
# Перейдите в директорию с вашим проектом локально
cd C:\Users\same9\PycharmProjects\hp_life_tracker

# Копируйте все файлы проекта на сервер
scp -r * root@SERVER_IP:/opt/hp-life-tracker/

# Если нужно скопировать скрытые файлы (например, .env):
# scp -r .* root@SERVER_IP:/opt/hp-life-tracker/ 2>$null
```

### Вариант B: Через Git (рекомендуется)

**На сервере (VPS):**

```bash
# Установите Git, если не установлен
apt-get update && apt-get install -y git

# Клонируйте репозиторий (замените URL на ваш)
cd /opt
git clone YOUR_REPO_URL hp-life-tracker
cd hp-life-tracker

# Или создайте проект вручную
```

---

## ШАГ 4: Настройка переменных окружения

### VPS (root)
```bash
cd /opt/hp-life-tracker

# Создаем .env файл из примера
cp env.example .env

# Редактируем .env файл
nano .env
```

**Настройте в `.env` файле:**
```env
POSTGRES_USER=hp_life_tracker_user
POSTGRES_PASSWORD=ваш_надежный_пароль_здесь
POSTGRES_DB=hp_life_tracker_db
TELEGRAM_BOT_TOKEN=ваш_токен_если_нужен
```

**Сохраните файл:**
- `Ctrl + O` → `Enter` → `Ctrl + X` (в nano)

---

## ШАГ 5: Настройка Nginx

### VPS (root)
```bash
# Копируем конфиг Nginx
cp /opt/hp-life-tracker/deploy/nginx-hp-life-tracker.conf /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space

# Создаем симлинк (активируем сайт)
ln -s /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space /etc/nginx/sites-enabled/

# Проверяем конфигурацию Nginx
nginx -t

# Если тест прошел успешно, перезагружаем Nginx
systemctl reload nginx
```

---

## ШАГ 6: Получение SSL сертификата через Certbot

### VPS (root)
```bash
# Убедитесь, что домен hp-life-tracker.app-toolbox.space указывает на IP вашего сервера
# (настройте DNS A-запись у вашего регистратора домена)

# Получаем SSL сертификат
certbot --nginx -d hp-life-tracker.app-toolbox.space

# Certbot автоматически:
# 1. Получит сертификат
# 2. Обновит конфиг Nginx
# 3. Настроит редирект с HTTP на HTTPS
```

**Важно:** Certbot может попросить ваш email и согласие на условия. Ответьте на вопросы.

---

## ШАГ 7: Первый запуск Docker Compose

### VPS (root)
```bash
cd /opt/hp-life-tracker

# Собираем и запускаем контейнеры
docker compose up -d --build

# Проверяем статус контейнеров
docker compose ps

# Смотрим логи приложения
docker compose logs -f app

# Смотрим логи базы данных
docker compose logs -f db
```

**Если все работает, вы увидите:**
- Контейнеры в статусе `Up`
- В логах приложения: `Application startup complete`
- В логах БД: `database system is ready to accept connections`

---

## ШАГ 8: Проверка работоспособности

### VPS (root)
```bash
# Проверяем, что контейнеры запущены
docker compose ps

# Проверяем, что приложение отвечает локально
curl http://127.0.0.1:8001/

# Проверяем подключение к PostgreSQL
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT version();"
```

### В браузере
Откройте в браузере:
```
https://hp-life-tracker.app-toolbox.space/
```

Вы должны увидеть:
```json
{"message": "XP Tracker API работает!"}
```

---

## ПЕРЕЗАПУСК БЕЗ ПОТЕРИ ДАННЫХ

### VPS (root)
```bash
cd /opt/hp-life-tracker

# Останавливаем контейнеры (данные сохраняются в volume)
docker compose down

# Запускаем заново
docker compose up -d

# Данные PostgreSQL останутся в volume pgdata_hp_life_tracker
```

---

## REDEPLOY (обновление кода)

### Вариант A: Полный пересборка

**В PowerShell (локально):**
```powershell
# Скопируйте обновленные файлы на сервер
cd C:\Users\same9\PycharmProjects\hp_life_tracker
scp -r * root@SERVER_IP:/opt/hp-life-tracker/
```

**На сервере (VPS):**
```bash
cd /opt/hp-life-tracker

# Пересобираем и перезапускаем
docker compose up -d --build

# Данные БД сохраняются, так как они в volume
```

### Вариант B: Без пересборки (только код Python)

**На сервере (VPS):**
```bash
cd /opt/project2

# Копируете только код приложения, затем:
docker compose restart app

# Или пересоздаете только контейнер app:
docker compose up -d --no-deps --build app
```

---

## ПРОВЕРКА СОХРАНЕНИЯ ДАННЫХ БД

### Создание тестовых данных

**VPS (root):**
```bash
cd /opt/hp-life-tracker

# Подключаемся к PostgreSQL
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db

# В PostgreSQL консоли:
CREATE TABLE test_persistence (id SERIAL PRIMARY KEY, data TEXT);
INSERT INTO test_persistence (data) VALUES ('Тест сохранения данных');
SELECT * FROM test_persistence;
\q
```

### Проверка после перезапуска

**VPS (root):**
```bash
# Останавливаем контейнеры
docker compose down

# Проверяем, что volume существует
docker volume ls | grep pgdata_hp_life_tracker

# Запускаем заново
docker compose up -d

# Ждем запуска БД
sleep 10

# Проверяем данные
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT * FROM test_persistence;"

# Если видите запись "Тест сохранения данных" - всё работает! ✅
```

---

## ПОЛЕЗНЫЕ КОМАНДЫ

### Просмотр логов
```bash
# Все логи
docker compose logs -f

# Только приложение
docker compose logs -f app

# Только база данных
docker compose logs -f db

# Последние 100 строк
docker compose logs --tail=100 app
```

### Работа с базой данных
```bash
# Подключение к PostgreSQL
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db

# Выполнение SQL команды
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT COUNT(*) FROM users;"

# Резервная копия
docker compose exec db pg_dump -U hp_life_tracker_user hp_life_tracker_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
docker compose exec -T db psql -U hp_life_tracker_user hp_life_tracker_db < backup_file.sql
```

### Работа с контейнерами
```bash
# Статус контейнеров
docker compose ps

# Остановка
docker compose stop

# Запуск
docker compose start

# Перезапуск
docker compose restart

# Удаление контейнеров (данные сохраняются в volume)
docker compose down

# Удаление контейнеров + volumes (⚠️ УДАЛИТ ДАННЫЕ!)
docker compose down -v
```

### Работа с volumes
```bash
# Список volumes
docker volume ls

# Информация о volume
docker volume inspect pgdata_hp_life_tracker

# Удаление volume (⚠️ УДАЛИТ ДАННЫЕ!)
docker volume rm pgdata_hp_life_tracker
```

---

## УСТРАНЕНИЕ НЕПОЛАДОК

### Проблема: Контейнеры не запускаются
```bash
# Проверяем логи
docker compose logs

# Проверяем конфигурацию
docker compose config
```

### Проблема: База данных не подключается
```bash
# Проверяем, запущена ли БД
docker compose ps db

# Проверяем логи БД
docker compose logs db

# Проверяем переменные окружения
docker compose exec app env | grep DATABASE_URL
```

### Проблема: Nginx не проксирует запросы
```bash
# Проверяем конфиг Nginx
nginx -t

# Проверяем логи Nginx
tail -f /var/log/nginx/hp-life-tracker_error.log

# Проверяем, что приложение отвечает локально
curl http://127.0.0.1:8001/
```

### Проблема: SSL сертификат не работает
```bash
# Проверяем статус Certbot
certbot certificates

# Обновляем сертификат вручную
certbot renew --dry-run
```

---

## БЕЗОПАСНОСТЬ

### Рекомендации:
1. **Используйте надежные пароли** в `.env` файле
2. **Не коммитьте `.env`** в Git (уже должен быть в `.gitignore`)
3. **Регулярно обновляйте** зависимости и образы Docker
4. **Делайте резервные копии** базы данных
5. **Мониторьте логи** на предмет ошибок

### Резервное копирование БД:
```bash
# Создайте скрипт для автоматического бэкапа
cat > /opt/hp-life-tracker/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/hp-life-tracker/backups"
mkdir -p "$BACKUP_DIR"
cd /opt/hp-life-tracker
docker compose exec -T db pg_dump -U hp_life_tracker_user hp_life_tracker_db | gzip > "$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
# Удаляем бэкапы старше 7 дней
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /opt/hp-life-tracker/backup.sh

# Добавьте в crontab для ежедневного бэкапа в 2:00 ночи
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/hp-life-tracker/backup.sh") | crontab -
```

---

## ВАЖНЫЕ ЗАМЕЧАНИЯ

✅ **Данные PostgreSQL сохраняются** в Docker volume `pgdata_hp_life_tracker`
✅ **Проект полностью изолирован** от первого проекта на app-toolbox.space
✅ **Уникальные имена** контейнеров и volumes (`hp-life-tracker_*`, `hp_life_tracker_*`)
✅ **Отдельная сеть Docker** (`hp_life_tracker_network`)
✅ **Локальный порт** 127.0.0.1:8001 (доступен только с сервера)
✅ **Домен:** `hp-life-tracker.app-toolbox.space`

---

## БЫСТРЫЙ СТАРТ (копипаст)

После копирования всех файлов на сервер:

```bash
# На сервере
cd /opt/hp-life-tracker
cp env.example .env
nano .env  # Настройте пароли
cp deploy/nginx-hp-life-tracker.conf /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space
ln -s /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d hp-life-tracker.app-toolbox.space
docker compose up -d --build
docker compose logs -f app
```

---

## БЫСТРЫЙ REDEPLOY (Git Pull + Rebuild)

Если всё уже настроено, просто обновите код и пересоберите:

### Вариант 1: Использовать скрипт deploy.sh

**На сервере (VPS):**
```bash
cd /opt/hp-life-tracker
chmod +x deploy.sh
./deploy.sh
```

### Вариант 2: Вручную (2 команды)

**На сервере (VPS):**
```bash
cd /opt/hp-life-tracker
git pull
docker compose up -d --build
```

**Всё!** Приложение пересобрано и запущено. Данные БД сохраняются (они в volume).