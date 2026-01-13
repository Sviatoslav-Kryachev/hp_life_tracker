# Проверка обновления на сервере

## Проблема
Браузер использует кешированные версии файлов, даже после обновления на сервере.

## Решение

### 1. Проверьте, что файлы обновились в контейнере

```bash
cd /opt/hp-life-tracker

# Проверьте структуру social блока в HTML
docker exec hp-life-tracker_app grep -A 15 "id=\"social\"" /app/Frontend/static/index.html

# Проверьте версии кеша
docker exec hp-life-tracker_app grep -E "app\.js\?v=|style\.css\?v=" /app/Frontend/static/index.html
```

Ожидаемый результат:
- `style.css?v=57`
- `app.js?v=52`
- Структура social блока должна быть:
  ```html
  <div id="social" class="grid lg:grid-cols-3 ...">
    <div class="lg:col-span-2 space-y-4 md:space-y-6">
      <div id="section-groups-container"></div>
      <div id="section-challenges-container"></div>
    </div>
    <div class="space-y-4 md:space-y-6">
      <div id="section-leaderboard-container"></div>
      <div id="section-achievements-container"></div>
    </div>
  </div>
  ```

### 2. Если файлы не обновились

```bash
# Остановите контейнеры
docker compose down

# Удалите старый образ (опционально, для полной пересборки)
docker rmi hp-life-tracker-app

# Пересоберите БЕЗ кеша
docker compose build --no-cache app

# Запустите
docker compose up -d

# Проверьте снова
docker exec hp-life-tracker_app grep -A 15 "id=\"social\"" /app/Frontend/static/index.html
```

### 3. Очистите кеш браузера

**В Chrome/Edge:**
- `Ctrl + Shift + Delete` → Выберите "Изображения и файлы в кеше" → Очистить
- Или: `Ctrl + Shift + R` (жесткая перезагрузка)

**В режиме инкогнито:**
- Закройте все окна инкогнито
- Откройте новое окно инкогнито
- Или используйте `Ctrl + Shift + R`

### 4. Проверьте в браузере

Откройте DevTools (F12) → Network tab:
- Убедитесь, что `index.html` загружается (не 304)
- Убедитесь, что `style.css?v=57` загружается
- Убедитесь, что `app.js?v=52` загружается

### 5. Если все еще не работает

Добавьте параметр времени к URL:
```
https://hp-life-tracker.app-toolbox.space/?t=1234567890
```

Или проверьте, что Nginx не кеширует статические файлы.
