# Исправление проблемы с git pull на сервере

## Проблема
```
error: Your local changes to the following files would be overwritten by merge:
        static/index.html
Please commit your changes or stash them before you merge.
```

## Решение

### Вариант 1: Сохранить локальные изменения (stash)
```bash
cd /opt/hp-life-tracker
git stash
git pull origin master
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### Вариант 2: Отбросить локальные изменения (если они не нужны)
```bash
cd /opt/hp-life-tracker
git reset --hard HEAD
git pull origin master
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### Вариант 3: Посмотреть, что изменилось, и решить
```bash
cd /opt/hp-life-tracker
git status
git diff static/index.html
# Если изменения не нужны:
git checkout -- static/index.html
git pull origin master
docker compose down
docker compose build --no-cache app
docker compose up -d
```

## Рекомендация
Используйте **Вариант 2** (reset --hard), так как все нужные изменения уже в Git репозитории.
