# Быстрое обновление на сервере

## Если изменения не применяются на сервере:

### 1. Подключитесь к серверу
```bash
ssh root@YOUR_SERVER_IP
```

### 2. Перейдите в директорию проекта
```bash
cd /opt/hp-life-tracker
```

### 3. Обновите код из Git
```bash
git pull origin master
```

### 4. Пересоберите и перезапустите Docker контейнер
```bash
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### 5. Проверьте логи (если нужно)
```bash
docker compose logs -f app
```

### 6. Очистите кеш браузера
- В режиме инкогнито: `Ctrl + Shift + Delete` → Очистить кеш
- Или: `Ctrl + F5` для жесткой перезагрузки страницы

---

## Альтернатива: Использовать deploy.sh скрипт

```bash
cd /opt/hp-life-tracker
bash deploy.sh
```

Этот скрипт автоматически:
- Обновит код из Git
- Остановит контейнеры
- Пересоберет Docker образ
- Запустит контейнеры
