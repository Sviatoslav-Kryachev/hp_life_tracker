#!/bin/bash
# Скрипт диагностики проблем с сайтом

echo "=========================================="
echo "Диагностика HP Life Tracker"
echo "=========================================="
echo ""

# 1. Проверка Docker контейнеров
echo "1. Статус Docker контейнеров:"
echo "----------------------------------------"
cd /opt/hp-life-tracker 2>/dev/null || cd /opt/hp_life_tracker 2>/dev/null || echo "⚠️  Не найдена директория проекта"
docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null
echo ""

# 2. Проверка логов приложения
echo "2. Последние 20 строк логов приложения:"
echo "----------------------------------------"
docker compose logs --tail=20 app 2>/dev/null || docker-compose logs --tail=20 app 2>/dev/null
echo ""

# 3. Проверка подключения к базе данных
echo "3. Проверка подключения к БД:"
echo "----------------------------------------"
docker compose exec -T db pg_isready -U hp_life_tracker_user 2>/dev/null || docker-compose exec -T db pg_isready -U hp_life_tracker_user 2>/dev/null || echo "⚠️  Не удалось проверить БД"
echo ""

# 4. Проверка порта 8001
echo "4. Проверка порта 8001 (приложение):"
echo "----------------------------------------"
curl -s http://127.0.0.1:8001/ | head -5 || echo "⚠️  Приложение не отвечает на порту 8001"
echo ""

# 5. Проверка Nginx
echo "5. Статус Nginx:"
echo "----------------------------------------"
systemctl status nginx --no-pager -l 2>/dev/null | head -10 || service nginx status 2>/dev/null | head -10
echo ""

# 6. Проверка конфигурации Nginx
echo "6. Проверка конфигурации Nginx:"
echo "----------------------------------------"
nginx -t 2>&1
echo ""

# 7. Проверка SSL сертификата
echo "7. Проверка SSL сертификата:"
echo "----------------------------------------"
curl -vI https://hp-life-tracker.app-toolbox.space 2>&1 | grep -i "certificate\|SSL\|TLS\|error" | head -5 || echo "⚠️  Не удалось проверить SSL"
echo ""

# 8. Проверка портов
echo "8. Проверка открытых портов:"
echo "----------------------------------------"
netstat -tlnp 2>/dev/null | grep -E ":(80|443|8001)" || ss -tlnp 2>/dev/null | grep -E ":(80|443|8001)" || echo "⚠️  Не удалось проверить порты"
echo ""

# 9. Проверка переменных окружения
echo "9. Проверка .env файла:"
echo "----------------------------------------"
if [ -f /opt/hp-life-tracker/.env ]; then
    echo "✅ .env файл существует"
    grep -E "TELEGRAM_BOT_TOKEN|DATABASE_URL|POSTGRES" /opt/hp-life-tracker/.env | sed 's/=.*/=***/' || echo "⚠️  Не найдены переменные"
elif [ -f /opt/hp_life_tracker/.env ]; then
    echo "✅ .env файл существует"
    grep -E "TELEGRAM_BOT_TOKEN|DATABASE_URL|POSTGRES" /opt/hp_life_tracker/.env | sed 's/=.*/=***/' || echo "⚠️  Не найдены переменные"
else
    echo "⚠️  .env файл не найден"
fi
echo ""

echo "=========================================="
echo "Диагностика завершена"
echo "=========================================="
