# Компонентная система

Простая система компонентов без фреймворков для проекта HP Life Tracker.

## Структура

```
static/
├── components/
│   ├── header/
│   │   ├── header.html    # HTML шаблон header
│   │   └── header.css     # Стили header
│   ├── footer/
│   │   ├── footer.html    # HTML шаблон footer
│   │   └── footer.css     # Стили footer
│   ├── auth/
│   │   ├── auth.html      # HTML шаблон auth (форма входа/регистрации)
│   │   └── auth.css       # Стили auth
│   ├── modals/
│   │   ├── modal-base.css # Базовые стили для всех модальных окон
│   │   ├── modal-edit-activity/
│   │   ├── modal-edit-reward/
│   │   ├── modal-create-goal/
│   │   ├── modal-manual-time/
│   │   ├── modal-day-details/
│   │   ├── modal-category/
│   │   ├── modal-telegram-link/
│   │   ├── modal-create-group/
│   │   ├── modal-join-group/
│   │   └── modal-create-challenge/
│   ├── widgets/
│   │   ├── widget-today/      # Виджет "Сегодня"
│   │   ├── widget-calendar/   # Календарь активности
│   │   ├── widget-progress/   # Прогресс до следующего уровня
│   │   └── widget-streak/     # Серия дней
│   ├── sections/
│   │   ├── section-activities/  # Секция активностей
│   │   ├── section-rewards/     # Секция наград
│   │   ├── section-history/     # Секция истории
│   │   └── section-admin/       # Админ-панель
│   └── README.md          # Эта документация
├── components.js          # Загрузчик компонентов
├── index.html             # Точка входа
├── style.css              # Глобальные стили
└── app.js                 # Основной скрипт приложения
```

## Использование

### 1. Создание компонента

Создайте папку для компонента:
```
components/my-component/
├── my-component.html
└── my-component.css
```

### 2. Загрузка компонента

В `index.html` добавьте контейнер:
```html
<div id="my-component-container"></div>
```

Загрузите компонент:
```javascript
await loadComponent('my-component', '#my-component-container');
```

Или загрузите несколько компонентов:
```javascript
await loadComponents([
    { name: 'header', selector: '#header-container' },
    { name: 'footer', selector: '#footer-container' }
]);
```

### 3. Порядок загрузки

Компоненты загружаются автоматически при загрузке DOM:
```html
<script src="components.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', async () => {
        await loadComponents([
            { name: 'header', selector: '#header-container' },
            { name: 'footer', selector: '#footer-container' }
        ]);
    });
</script>
```

## Правила

1. **Имя компонента** = имя папки = имя файлов (header → header.html, header.css)
2. **HTML** содержит только разметку компонента (без `<html>`, `<head>`, `<body>`)
3. **CSS** содержит только стили компонента
4. **Контейнер** должен существовать в DOM до загрузки компонента

## Примеры

### Header
```html
<!-- В index.html -->
<div id="header-container"></div>
```

```javascript
await loadComponent('header', '#header-container');
```

### Footer
```html
<!-- В index.html -->
<div id="footer-container"></div>
```

```javascript
await loadComponent('footer', '#footer-container');
```

### Auth (форма входа/регистрации)
```html
<!-- В index.html -->
<div id="auth-section"></div>
```

```javascript
await loadComponent('auth', '#auth-section');
```

### Модальные окна
Модальные окна загружаются автоматически в `body` при загрузке страницы. Они доступны по своим ID:
- `edit-activity-modal` - редактирование активности
- `edit-reward-modal` - редактирование награды
- `create-goal-modal` - создание цели
- `manual-time-modal` - ручной ввод времени
- `day-details-modal` - детали дня
- `category-modal` - управление категориями
- `telegram-link-modal` - привязка Telegram
- `create-group-modal` - создание группы
- `join-group-modal` - присоединение к группе
- `create-challenge-modal` - создание челленджа

Все модальные окна используют базовые стили из `modals/modal-base.css`.

### Виджеты
Виджеты загружаются автоматически в соответствующие контейнеры при загрузке страницы:
- `widget-today` - виджет "Сегодня" (заработанные/потраченные XP, сессии, время)
- `widget-calendar` - календарь активности (неделя/месяц/год)
- `widget-progress` - прогресс до следующего уровня
- `widget-streak` - серия дней (текущая серия и рекорд)

Контейнеры для виджетов:
- `#widget-today-container` - виджет "Сегодня"
- `#widget-calendar-container` - календарь активности
- `#widget-progress-container` - прогресс до следующего уровня
- `#widget-streak-container` - серия дней

### Основные секции
Основные секции загружаются автоматически в соответствующие контейнеры при загрузке страницы:
- `section-activities` - секция активностей (список активностей, фильтры, форма создания)
- `section-rewards` - секция наград (список наград, быстрый выбор, форма создания)
- `section-history` - секция истории (история транзакций с фильтрами по периодам)
- `section-admin` - админ-панель (управление подопечными, ссылки для приглашения)

Контейнеры для секций:
- `#section-activities-container` - секция активностей
- `#section-rewards-container` - секция наград
- `#section-history-container` - секция истории
- `#section-admin-container` - админ-панель
