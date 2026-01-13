# Быстрое исправление на сервере

## Проблема
На сервере загружается старая версия файла (`app.js?v=47` вместо `v=50`), данные не загружаются.

## Решение (выполните на сервере)

```bash
cd /opt/hp-life-tracker

# 1. Обновите код
git pull

# 2. Проверьте структуру
ls -la Frontend/static/js/app.js
ls -la Backend/app/main.py

# 3. Остановите контейнеры
docker compose down

# 4. Пересоберите БЕЗ кэша
docker compose build --no-cache app

# 5. Запустите
docker compose up -d

# 6. Проверьте логи
docker compose logs -f app
```

## Альтернатива: используйте обновленный скрипт

```bash
cd /opt/hp-life-tracker
git pull
chmod +x deploy.sh
./deploy.sh
```

## Проверка после деплоя

1. Откройте https://hp-life-tracker.app-toolbox.space
2. Откройте DevTools (F12) → Console
3. Выполните:
   ```javascript
   // Проверка версии файла
   document.querySelector('script[src*="app.js"]').src
   // Должно быть v=50
   
   // Проверка функций
   console.log('loadGoals:', typeof loadGoals);
   console.log('loadCategoryStats:', typeof loadCategoryStats);
   ```

## Если volume mount мешает

Если статические файлы все еще старые, временно закомментируйте volume mount в `docker-compose.yml`:

```yaml
volumes:
  # - ./Frontend/static:/app/Frontend/static:ro  # Закомментируйте эту строку
```

Затем пересоберите:
```bash
docker compose down
docker compose build --no-cache app
docker compose up -d
```
