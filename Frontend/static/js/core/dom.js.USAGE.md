# Использование core/dom.js

## 📖 Описание

Модуль `core/dom.js` предоставляет универсальные функции для работы с DOM элементами, устраняя дублирование кода и улучшая производительность через кэширование.

## 🚀 Основные функции

### Получение элементов

#### `getElement(id, useCache = true)`
Получает элемент по ID с автоматическим fallback на `querySelector` и кэшированием.

```javascript
// Простое использование
const element = getElement('my-element');

// Без кэширования (для динамически изменяющихся элементов)
const element = getElement('my-element', false);

// Поддерживает селекторы
const element = getElement('#my-element');
```

#### `getElements(ids, useCache = true)`
Получает несколько элементов по массиву ID.

```javascript
const { element1, element2, element3 } = getElements(['element1', 'element2', 'element3']);
```

#### `waitForElement(id, timeout, interval)`
Ожидает появления элемента в DOM (полезно для динамически загружаемых компонентов).

```javascript
// Ожидание с таймаутом 5 секунд (по умолчанию)
const element = await waitForElement('dynamic-element');

// С кастомным таймаутом
const element = await waitForElement('dynamic-element', 10000);

// С кастомным интервалом проверки
const element = await waitForElement('dynamic-element', 5000, 50);
```

#### `getElementInApp(id, checkAppSection, useCache)`
Получает элемент с проверкой на существование и видимость `app-section`.

```javascript
// Автоматически проверяет app-section
const element = getElementInApp('my-element');

// Без проверки app-section
const element = getElementInApp('my-element', false);
```

### Управление видимостью

#### `showElement(idOrElement, hiddenClass = 'hidden')`
Показывает элемент (удаляет класс 'hidden').

```javascript
// По ID
showElement('my-element');

// По элементу
const element = getElement('my-element');
showElement(element);

// С кастомным классом
showElement('my-element', 'invisible');
```

#### `hideElement(idOrElement, hiddenClass = 'hidden')`
Скрывает элемент (добавляет класс 'hidden').

```javascript
hideElement('my-element');
```

#### `toggleElement(idOrElement, hiddenClass = 'hidden')`
Переключает видимость элемента.

```javascript
const isVisible = toggleElement('my-element'); // true если показан, false если скрыт
```

#### `isElementVisible(idOrElement, hiddenClass = 'hidden')`
Проверяет, видим ли элемент.

```javascript
if (isElementVisible('my-element')) {
    console.log('Элемент видим');
}
```

### Работа с классами

#### `addClass(idOrElement, classes)`
Добавляет класс(ы) элементу.

```javascript
// Один класс
addClass('my-element', 'active');

// Несколько классов
addClass('my-element', ['active', 'highlighted']);
```

#### `removeClass(idOrElement, classes)`
Удаляет класс(ы) у элемента.

```javascript
removeClass('my-element', 'active');
removeClass('my-element', ['active', 'highlighted']);
```

#### `hasClass(idOrElement, className)`
Проверяет наличие класса.

```javascript
if (hasClass('my-element', 'active')) {
    console.log('Элемент активен');
}
```

### Работа с текстом

#### `setText(idOrElement, text)`
Устанавливает текстовое содержимое.

```javascript
setText('my-element', 'Новый текст');
```

#### `getText(idOrElement)`
Получает текстовое содержимое.

```javascript
const text = getText('my-element');
```

### Управление кэшем

#### `clearCache(id)`
Очищает кэш элементов.

```javascript
// Очистить кэш конкретного элемента
clearCache('my-element');

// Очистить весь кэш
clearCache();
```

#### `setCacheEnabled(enabled)`
Включает/отключает кэширование.

```javascript
// Отключить кэширование
setCacheEnabled(false);

// Включить кэширование
setCacheEnabled(true);
```

## 📝 Примеры миграции

### До (дублирование кода):
```javascript
function getActivitiesElements() {
    if (!activitiesListVisible) {
        activitiesListVisible = document.getElementById("activities-list-visible");
    }
    if (!activitiesListVisible) {
        activitiesListVisible = document.querySelector("#activities-list-visible");
    }
    // ... и так далее
}
```

### После (используя dom.js):
```javascript
function getActivitiesElements() {
    activitiesListVisible = getElement("activities-list-visible");
    activitiesListHidden = getElement("activities-list-hidden");
    activitiesAccordionBtn = getElement("activities-accordion-btn");
}
```

### До (показ/скрытие):
```javascript
const msgEl = document.getElementById("activity-message");
if (msgEl) {
    msgEl.classList.remove("hidden");
    msgEl.classList.add("text-green-600");
}
```

### После (используя dom.js):
```javascript
const msgEl = getElement("activity-message");
if (msgEl) {
    showElement(msgEl);
    addClass(msgEl, "text-green-600");
}
```

## ⚡ Преимущества

1. **Кэширование**: Элементы кэшируются после первого обращения, что улучшает производительность
2. **Автоматический fallback**: Автоматически пробует `getElementById`, затем `querySelector`
3. **Единый API**: Все функции работают одинаково, принимая как ID, так и сам элемент
4. **Меньше дублирования**: Один модуль вместо повторяющегося кода в каждом файле
5. **Удобство**: Простые и понятные функции для частых операций

## 🔄 Следующие шаги

После создания `core/dom.js` рекомендуется:
1. Постепенно мигрировать существующий код на использование этих функций
2. Начать с модулей с наибольшим дублированием (activities, rewards, history)
3. Создать `core/notifications.js` для унификации сообщений
