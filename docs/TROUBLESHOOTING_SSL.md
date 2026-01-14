# Исправление ошибки SSL сертификата

## Проблема: NET::ERR_CERT_COMMON_NAME_INVALID

### Симптомы:
- Браузер показывает ошибку "Ваше соединение не защищено"
- Ошибка `NET::ERR_CERT_COMMON_NAME_INVALID`
- Красный зачеркнутый замок в адресной строке
- Домен: `hp-life-tracker.app-toolbox.space`

### Причины:
1. SSL сертификат не был установлен
2. Сертификат был выдан для другого домена
3. Сертификат истек
4. Сертификат не был правильно обновлен после изменения домена

---

## Решение

### Шаг 1: Проверьте текущий SSL сертификат

На сервере (VPS):
```bash
# Проверьте, какой сертификат используется
sudo certbot certificates

# Проверьте конфигурацию Nginx
sudo cat /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space | grep -A 5 "ssl_certificate"
```

### Шаг 2: Проверьте DNS записи

Убедитесь, что DNS A-запись для домена указывает на правильный IP сервера:
```bash
# Проверьте DNS запись
dig hp-life-tracker.app-toolbox.space +short
# Или
nslookup hp-life-tracker.app-toolbox.space

# Должен вернуться IP адрес вашего VPS сервера
```

### Шаг 3: Удалите старый сертификат (если есть)

```bash
# Удалите сертификат для домена
sudo certbot delete --cert-name hp-life-tracker.app-toolbox.space

# Или удалите вручную (если certbot delete не работает)
sudo rm -rf /etc/letsencrypt/live/hp-life-tracker.app-toolbox.space
sudo rm -rf /etc/letsencrypt/archive/hp-life-tracker.app-toolbox.space
sudo rm -rf /etc/letsencrypt/renewal/hp-life-tracker.app-toolbox.space
```

### Шаг 4: Получите новый SSL сертификат

```bash
# Убедитесь, что Nginx не запущен (для standalone режима)
sudo systemctl stop nginx

# Получите сертификат в standalone режиме
sudo certbot certonly --standalone -d hp-life-tracker.app-toolbox.space

# Или используйте webroot режим (если Nginx должен быть запущен)
sudo certbot certonly --webroot -w /var/www/html -d hp-life-tracker.app-toolbox.space

# Или используйте автоматическую настройку Nginx (рекомендуется)
sudo certbot --nginx -d hp-life-tracker.app-toolbox.space
```

**Важно:** Certbot может попросить:
- Email адрес (для уведомлений об истечении)
- Согласие с условиями использования
- Согласие на подписку на новости (можно отказаться)

### Шаг 5: Проверьте конфигурацию Nginx

После получения сертификата, Certbot должен автоматически обновить конфигурацию Nginx. Проверьте:

```bash
# Проверьте конфигурацию
sudo cat /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space

# Должны быть строки:
# listen 443 ssl http2;
# ssl_certificate /etc/letsencrypt/live/hp-life-tracker.app-toolbox.space/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/hp-life-tracker.app-toolbox.space/privkey.pem;
```

Если Certbot не обновил конфигурацию автоматически, обновите вручную:

```bash
sudo nano /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space
```

Добавьте SSL конфигурацию в блок `server` для порта 443:

```nginx
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
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;

    # Остальная конфигурация...
    # (proxy_pass, location и т.д.)
}
```

И добавьте редирект с HTTP на HTTPS:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name hp-life-tracker.app-toolbox.space;

    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}
```

### Шаг 6: Проверьте синтаксис и перезагрузите Nginx

```bash
# Проверьте синтаксис конфигурации
sudo nginx -t

# Если синтаксис правильный, перезагрузите Nginx
sudo systemctl reload nginx

# Или перезапустите
sudo systemctl restart nginx
```

### Шаг 7: Проверьте сертификат

```bash
# Проверьте сертификат через openssl
openssl s_client -connect hp-life-tracker.app-toolbox.space:443 -servername hp-life-tracker.app-toolbox.space < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Или используйте curl
curl -vI https://hp-life-tracker.app-toolbox.space 2>&1 | grep -i "certificate"

# Или проверьте через браузер
# Откройте https://hp-life-tracker.app-toolbox.space
# Нажмите на замок в адресной строке
# Проверьте информацию о сертификате
```

### Шаг 8: Настройте автоматическое обновление сертификата

Let's Encrypt сертификаты действительны 90 дней. Настройте автоматическое обновление:

```bash
# Проверьте, что автоматическое обновление включено
sudo systemctl status certbot.timer

# Если не включено, включите
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Проверьте, что обновление работает
sudo certbot renew --dry-run
```

---

## Альтернативные решения

### Если Certbot не работает

1. **Проверьте, что порты 80 и 443 открыты:**
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

2. **Проверьте, что домен правильно настроен:**
```bash
# Проверьте, что домен резолвится на правильный IP
host hp-life-tracker.app-toolbox.space
```

3. **Проверьте логи Certbot:**
```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### Если используется другой домен

Если сертификат был выдан для другого домена (например, `app-toolbox.space` вместо `hp-life-tracker.app-toolbox.space`):

1. Удалите старый сертификат
2. Получите новый сертификат для правильного домена
3. Обновите конфигурацию Nginx

### Если сертификат истек

```bash
# Обновите сертификат вручную
sudo certbot renew

# Или обновите конкретный сертификат
sudo certbot renew --cert-name hp-life-tracker.app-toolbox.space

# Перезагрузите Nginx после обновления
sudo systemctl reload nginx
```

---

## Быстрая проверка

Выполните все команды по порядку:

```bash
# 1. Проверка DNS
dig hp-life-tracker.app-toolbox.space +short

# 2. Проверка текущих сертификатов
sudo certbot certificates

# 3. Проверка конфигурации Nginx
sudo nginx -t
sudo cat /etc/nginx/sites-available/hp-life-tracker.app-toolbox.space | grep ssl

# 4. Получение/обновление сертификата
sudo certbot --nginx -d hp-life-tracker.app-toolbox.space

# 5. Перезагрузка Nginx
sudo systemctl reload nginx

# 6. Проверка сертификата
curl -vI https://hp-life-tracker.app-toolbox.space 2>&1 | head -20
```

---

## Проверка в браузере

После исправления:

1. Откройте `https://hp-life-tracker.app-toolbox.space` в браузере
2. Должен быть зеленый замок в адресной строке
3. Нажмите на замок → "Сертификат" → проверьте:
   - Выдан для: `hp-life-tracker.app-toolbox.space`
   - Действителен до: дата в будущем
   - Издатель: Let's Encrypt

Если ошибка все еще появляется:
- Очистите кеш браузера
- Попробуйте в режиме инкогнито
- Попробуйте другой браузер
- Подождите несколько минут (DNS может кешироваться)
