#!/bin/bash
# Скрипт диагностики проблем

echo "🔍 Диагностика HP Life Tracker..."
echo "=================================="
echo ""

cd /opt/hp-life-tracker || exit 1

echo "1️⃣  Проверка статуса контейнеров:"
docker compose ps
echo ""

echo "2️⃣  Проверка последних логов приложения (последние 30 строк):"
docker compose logs app --tail=30
echo ""

echo "3️⃣  Проверка миграций Alembic:"
docker compose exec app alembic current 2>/dev/null || echo "❌ Не удалось выполнить миграции"
echo ""

echo "4️⃣  Проверка структуры таблицы users:"
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "\d users" 2>/dev/null || echo "❌ Не удалось подключиться к базе данных"
echo ""

echo "5️⃣  Проверка колонок в таблице users:"
docker compose exec db psql -U hp_life_tracker_user -d hp_life_tracker_db -c "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position;" 2>/dev/null || echo "❌ Не удалось получить информацию о колонках"
echo ""

echo "6️⃣  Проверка токена Telegram бота:"
if grep -q "TELEGRAM_BOT_TOKEN=" .env 2>/dev/null; then
    token=$(grep "TELEGRAM_BOT_TOKEN=" .env | cut -d'=' -f2)
    if [ -z "$token" ] || [ "$token" = "" ]; then
        echo "❌ TELEGRAM_BOT_TOKEN пустой в .env файле"
    else
        echo "✅ TELEGRAM_BOT_TOKEN установлен (первые 10 символов: ${token:0:10}...)"
    fi
else
    echo "❌ TELEGRAM_BOT_TOKEN не найден в .env файле"
fi
echo ""

echo "7️⃣  Проверка статуса Telegram бота (systemd):"
if systemctl is-active --quiet hp-life-tracker-bot 2>/dev/null; then
    echo "✅ Telegram бот запущен"
    systemctl status hp-life-tracker-bot --no-pager -l | head -10
else
    echo "❌ Telegram бот не запущен (systemd service)"
fi
echo ""

echo "8️⃣  Проверка подключения к базе данных:"
docker compose exec db pg_isready -U hp_life_tracker_user 2>/dev/null && echo "✅ База данных доступна" || echo "❌ База данных недоступна"
echo ""

echo "=================================="
echo "✅ Диагностика завершена!"
echo ""
echo "💡 Рекомендации:"
echo "   - Если миграции не применены: docker compose exec app alembic upgrade head"
echo "   - Если бот не запущен: см. TROUBLESHOOTING.md"
echo "   - Для просмотра логов: docker compose logs -f app"
