# Инструкция по исправлению деплоя после реорганизации

## Проблема
После перемещения файлов в директории `Frontend/` и `Backend/` на сервере данные не загружаются.

## Решение

### 1. Проверьте структуру на сервере

```bash
cd /opt/hp-life-tracker
ls -la
```

Должны быть директории:
- `Frontend/`
- `Backend/`
- `Dockerfile`
- `docker-compose.yml`

### 2. Убедитесь, что все файлы закоммичены и запушены

```bash
# Локально
git status
git add .
git commit -m "Fix: обновлена структура Frontend/Backend"
git push
```

### 3. На сервере обновите код

```bash
cd /opt/hp-life-tracker
git pull
```

### 4. Проверьте структуру после git pull

```bash
ls -la Frontend/static/js/app.js
ls -la Backend/app/main.py
```

### 5. Пересоберите Docker образ БЕЗ кэша

```bash
cd /opt/hp-life-tracker
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### 6. Проверьте логи

```bash
docker compose logs -f app
```

Ищите ошибки, связанные с путями к файлам.

### 7. Проверьте, что статические файлы доступны

```bash
# Внутри контейнера
docker exec -it hp-life-tracker_app ls -la /app/Frontend/static/js/app.js

# Должен быть файл с версией v=50 в index.html
docker exec -it hp-life-tracker_app grep "app.js?v=" /app/Frontend/static/index.html
```

### 8. Если volume mount не работает правильно

Если статические файлы не обновляются через volume mount, можно:

**Вариант 1:** Убрать volume mount и использовать файлы из образа:
```yaml
# В docker-compose.yml закомментируйте:
# volumes:
#   - ./Frontend/static:/app/Frontend/static:ro
```

**Вариант 2:** Убедиться, что путь правильный:
```bash
# Проверьте абсолютный путь
cd /opt/hp-life-tracker
pwd
ls -la Frontend/static/js/app.js
```

### 9. Перезапустите контейнер

```bash
docker compose restart app
```

### 10. Очистите кэш браузера

В браузере:
- Откройте DevTools (F12)
- Вкладка Network → включите "Disable cache"
- Или используйте Ctrl+Shift+R для жесткой перезагрузки

## Проверка

После выполнения всех шагов:

1. Откройте https://hp-life-tracker.app-toolbox.space
2. Откройте DevTools (F12) → Console
3. Проверьте версию файла:
   ```javascript
   // Должно быть v=50, а не v=47
   document.querySelector('script[src*="app.js"]').src
   ```
4. Проверьте функции:
   ```javascript
   console.log('loadGoals:', typeof loadGoals);
   console.log('loadCategoryStats:', typeof loadCategoryStats);
   ```

## Если проблема сохраняется

Проверьте логи контейнера:
```bash
docker compose logs app | tail -50
```

И проверьте, что файлы правильно скопированы:
```bash
docker exec -it hp-life-tracker_app find /app -name "app.js" -type f
```
