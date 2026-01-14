#!/bin/bash
# Скрипт для исправления SSL и запуска сайта

set -e

echo "=========================================="
echo "Исправление SSL и запуск сайта"
echo "=========================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Проверка и запуск Docker контейнеров
echo -e "${YELLOW}1. Проверка Docker контейнеров...${NC}"
cd /opt/hp-life-tracker 2>/dev/null || cd /opt/hp_life_tracker 2>/dev/null || {
    echo -e "${RED}❌ Директория проекта не найдена!${NC}"
    exit 1
}

if ! docker compose ps | grep -q "Up"; then
    echo -e "${YELLOW}Запуск Docker контейнеров...${NC}"
    docker compose up -d
    echo "Ожидание запуска контейнеров (10 секунд)..."
    sleep 10
fi

if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker контейнеры запущены${NC}"
else
    echo -e "${RED}❌ Ошибка запуска Docker контейнеров${NC}"
    docker compose logs --tail=20 app
    exit 1
fi

# 2. Проверка локального доступа к приложению
echo ""
echo -e "${YELLOW}2. Проверка приложения на порту 8001...${NC}"
if curl -s http://127.0.0.1:8001/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Приложение отвечает на порту 8001${NC}"
else
    echo -e "${RED}❌ Приложение не отвечает на порту 8001${NC}"
    echo "Логи приложения:"
    docker compose logs --tail=30 app
    exit 1
fi

# 3. Проверка SSL сертификата
echo ""
echo -e "${YELLOW}3. Проверка SSL сертификата...${NC}"
if [ -f /etc/letsencrypt/live/hp-life-tracker.app-toolbox.space/fullchain.pem ]; then
    echo -e "${GREEN}✅ SSL сертификат существует${NC}"
    certbot certificates | grep "hp-life-tracker.app-toolbox.space" || true
else
    echo -e "${YELLOW}⚠️  SSL сертификат не найден, получаем новый...${NC}"
    
    # Останавливаем Nginx для получения сертификата
    sudo systemctl stop nginx 2>/dev/null || true
    
    # Получаем сертификат
    if sudo certbot certonly --standalone -d hp-life-tracker.app-toolbox.space --non-interactive --agree-tos --email admin@hp-life-tracker.app-toolbox.space 2>/dev/null; then
        echo -e "${GREEN}✅ SSL сертификат получен${NC}"
    else
        echo -e "${RED}❌ Ошибка получения SSL сертификата${NC}"
        echo "Убедитесь, что:"
        echo "  - Домен hp-life-tracker.app-toolbox.space указывает на этот сервер"
        echo "  - Порты 80 и 443 открыты в firewall"
        exit 1
    fi
fi

# 4. Настройка Nginx с SSL
echo ""
echo -e "${YELLOW}4. Настройка Nginx с SSL...${NC}"

NGINX_CONFIG="/etc/nginx/sites-available/hp-life-tracker.app-toolbox.space"

# Создаем резервную копию
if [ -f "$NGINX_CONFIG" ]; then
    sudo cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Создаем конфигурацию с SSL
sudo tee "$NGINX_CONFIG" > /dev/null << 'EOF'
# Редирект с HTTP на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name hp-life-tracker.app-toolbox.space;
    return 301 https://$server_name$request_uri;
}

# HTTPS сервер
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hp-life-tracker.app-toolbox.space;

    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/hp-life-tracker.app-toolbox.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hp-life-tracker.app-toolbox.space/privkey.pem;

    # SSL настройки безопасности
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Логи
    access_log /var/log/nginx/hp-life-tracker_access.log;
    error_log /var/log/nginx/hp-life-tracker_error.log;

    # HTML файлы - без кеша
    location ~* \.(html)$ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering off;
        proxy_request_buffering off;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Статические файлы - с кешем
    location /static/ {
        proxy_pass http://127.0.0.1:8001/static/;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Проксирование на FastAPI
    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
EOF

# Проверяем, что симлинк существует
if [ ! -L /etc/nginx/sites-enabled/hp-life-tracker.app-toolbox.space ]; then
    sudo ln -s /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space /etc/nginx/sites-enabled/
fi

# 5. Проверка конфигурации Nginx
echo ""
echo -e "${YELLOW}5. Проверка конфигурации Nginx...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Конфигурация Nginx корректна${NC}"
else
    echo -e "${RED}❌ Ошибка в конфигурации Nginx${NC}"
    exit 1
fi

# 6. Запуск/перезагрузка Nginx
echo ""
echo -e "${YELLOW}6. Запуск Nginx...${NC}"
sudo systemctl start nginx 2>/dev/null || sudo systemctl reload nginx
sleep 2

if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx запущен${NC}"
else
    echo -e "${RED}❌ Ошибка запуска Nginx${NC}"
    sudo systemctl status nginx --no-pager -l
    exit 1
fi

# 7. Финальная проверка
echo ""
echo -e "${YELLOW}7. Финальная проверка...${NC}"

# Проверка HTTP редиректа
if curl -sI http://hp-life-tracker.app-toolbox.space 2>&1 | grep -q "301\|Location.*https"; then
    echo -e "${GREEN}✅ HTTP редирект на HTTPS работает${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP редирект не работает (может быть нормально, если DNS еще не обновился)${NC}"
fi

# Проверка HTTPS
if curl -sI https://hp-life-tracker.app-toolbox.space 2>&1 | grep -q "200\|HTTP"; then
    echo -e "${GREEN}✅ HTTPS работает${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS может быть недоступен (проверьте DNS и firewall)${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Настройка завершена!${NC}"
echo "=========================================="
echo ""
echo "Проверьте сайт:"
echo "  https://hp-life-tracker.app-toolbox.space"
echo ""
echo "Если сайт не открывается:"
echo "  1. Проверьте DNS: dig hp-life-tracker.app-toolbox.space"
echo "  2. Проверьте firewall: sudo ufw status"
echo "  3. Проверьте логи: sudo tail -f /var/log/nginx/hp-life-tracker_error.log"
