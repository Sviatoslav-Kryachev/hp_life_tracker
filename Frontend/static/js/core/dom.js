// ============= DOM UTILITIES MODULE =============
// Универсальные функции для работы с DOM элементами
// Устраняет дублирование кода и улучшает производительность через кэширование

// ============= CACHE =============
// Кэш для хранения найденных элементов
const elementCache = new Map();

// Флаг для очистки кэша при необходимости
let cacheEnabled = true;

/**
 * Очищает кэш элементов
 * @param {string|null} id - ID элемента для очистки (если null, очищает весь кэш)
 */
function clearCache(id = null) {
    if (id) {
        elementCache.delete(id);
    } else {
        elementCache.clear();
    }
}

/**
 * Отключает/включает кэширование
 * @param {boolean} enabled - Включить кэширование
 */
function setCacheEnabled(enabled) {
    cacheEnabled = enabled;
    if (!enabled) {
        clearCache();
    }
}

// ============= ELEMENT GETTERS =============

/**
 * Получает элемент по ID с fallback на querySelector
 * @param {string} id - ID или селектор элемента
 * @param {boolean} useCache - Использовать кэш (по умолчанию true)
 * @returns {HTMLElement|null} Найденный элемент или null
 */
function getElement(id, useCache = true) {
    if (!id) {
        console.warn('[getElement] ID is empty');
        return null;
    }

    // Проверяем кэш
    if (useCache && cacheEnabled && elementCache.has(id)) {
        const cached = elementCache.get(id);
        // Проверяем, что элемент все еще в DOM
        if (cached && document.contains(cached)) {
            return cached;
        } else {
            // Элемент удален из DOM, удаляем из кэша
            elementCache.delete(id);
        }
    }

    // Пробуем getElementById (быстрее)
    let element = document.getElementById(id);
    
    // Если не найден, пробуем querySelector (для селекторов типа #id)
    if (!element) {
        // Если id уже начинается с #, используем как есть, иначе добавляем #
        const selector = id.startsWith('#') ? id : `#${id}`;
        element = document.querySelector(selector);
    }

    // Если элемент найден, кэшируем его
    if (element && useCache && cacheEnabled) {
        elementCache.set(id, element);
    }

    return element || null;
}

/**
 * Получает несколько элементов по массиву ID
 * @param {string[]} ids - Массив ID элементов
 * @param {boolean} useCache - Использовать кэш (по умолчанию true)
 * @returns {Object} Объект с элементами { id1: element1, id2: element2, ... }
 */
function getElements(ids, useCache = true) {
    if (!Array.isArray(ids) || ids.length === 0) {
        return {};
    }

    const elements = {};
    for (const id of ids) {
        elements[id] = getElement(id, useCache);
    }
    return elements;
}

/**
 * Ожидает появления элемента в DOM
 * @param {string} id - ID элемента
 * @param {number} timeout - Таймаут в миллисекундах (по умолчанию 5000)
 * @param {number} interval - Интервал проверки в миллисекундах (по умолчанию 100)
 * @returns {Promise<HTMLElement>} Promise, который разрешается когда элемент найден
 */
function waitForElement(id, timeout = 5000, interval = 100) {
    return new Promise((resolve, reject) => {
        // Сначала проверяем, может элемент уже есть
        const element = getElement(id, false);
        if (element) {
            resolve(element);
            return;
        }

        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const element = getElement(id, false);
            if (element) {
                clearInterval(checkInterval);
                resolve(element);
            } else if (Date.now() - startTime >= timeout) {
                clearInterval(checkInterval);
                reject(new Error(`Element with id "${id}" not found within ${timeout}ms`));
            }
        }, interval);
    });
}

/**
 * Получает элемент с проверкой на существование app-section
 * @param {string} id - ID элемента
 * @param {boolean} checkAppSection - Проверять ли наличие и видимость app-section
 * @param {boolean} useCache - Использовать кэш
 * @returns {HTMLElement|null} Найденный элемент или null
 */
function getElementInApp(id, checkAppSection = true, useCache = true) {
    if (checkAppSection) {
        const appSection = getElement('app-section', useCache);
        if (!appSection || appSection.classList.contains('hidden')) {
            return null;
        }
    }
    return getElement(id, useCache);
}

// ============= VISIBILITY UTILITIES =============

/**
 * Показывает элемент (удаляет класс 'hidden')
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string} hiddenClass - Класс для скрытия (по умолчанию 'hidden')
 * @returns {boolean} true если элемент найден и показан, false иначе
 */
function showElement(idOrElement, hiddenClass = 'hidden') {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return false;
    }
    element.classList.remove(hiddenClass);
    return true;
}

/**
 * Скрывает элемент (добавляет класс 'hidden')
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string} hiddenClass - Класс для скрытия (по умолчанию 'hidden')
 * @returns {boolean} true если элемент найден и скрыт, false иначе
 */
function hideElement(idOrElement, hiddenClass = 'hidden') {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return false;
    }
    element.classList.add(hiddenClass);
    return true;
}

/**
 * Переключает видимость элемента
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string} hiddenClass - Класс для скрытия (по умолчанию 'hidden')
 * @returns {boolean|null} true если элемент показан, false если скрыт, null если не найден
 */
function toggleElement(idOrElement, hiddenClass = 'hidden') {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return null;
    }
    const isHidden = element.classList.contains(hiddenClass);
    if (isHidden) {
        element.classList.remove(hiddenClass);
        return true;
    } else {
        element.classList.add(hiddenClass);
        return false;
    }
}

/**
 * Проверяет, видим ли элемент (не имеет класса 'hidden')
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string} hiddenClass - Класс для скрытия (по умолчанию 'hidden')
 * @returns {boolean} true если элемент видим, false если скрыт или не найден
 */
function isElementVisible(idOrElement, hiddenClass = 'hidden') {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return false;
    }
    return !element.classList.contains(hiddenClass);
}

// ============= CLASS UTILITIES =============

/**
 * Добавляет класс элементу
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string|string[]} classes - Класс или массив классов
 * @returns {boolean} true если элемент найден, false иначе
 */
function addClass(idOrElement, classes) {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return false;
    }
    const classArray = Array.isArray(classes) ? classes : [classes];
    element.classList.add(...classArray);
    return true;
}

/**
 * Удаляет класс у элемента
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string|string[]} classes - Класс или массив классов
 * @returns {boolean} true если элемент найден, false иначе
 */
function removeClass(idOrElement, classes) {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return false;
    }
    const classArray = Array.isArray(classes) ? classes : [classes];
    element.classList.remove(...classArray);
    return true;
}

/**
 * Проверяет, имеет ли элемент класс
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string} className - Класс для проверки
 * @returns {boolean} true если элемент имеет класс, false иначе
 */
function hasClass(idOrElement, className) {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return false;
    }
    return element.classList.contains(className);
}

// ============= TEXT CONTENT UTILITIES =============

/**
 * Устанавливает текстовое содержимое элемента
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @param {string} text - Текст для установки
 * @returns {boolean} true если элемент найден, false иначе
 */
function setText(idOrElement, text) {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return false;
    }
    element.textContent = text;
    return true;
}

/**
 * Получает текстовое содержимое элемента
 * @param {string|HTMLElement} idOrElement - ID элемента или сам элемент
 * @returns {string|null} Текстовое содержимое или null если элемент не найден
 */
function getText(idOrElement) {
    const element = typeof idOrElement === 'string' ? getElement(idOrElement) : idOrElement;
    if (!element) {
        return null;
    }
    return element.textContent;
}

// ============= EXPORTS =============
// Экспортируем функции в глобальную область видимости для обратной совместимости
if (typeof window !== 'undefined') {
    window.getElement = getElement;
    window.getElements = getElements;
    window.waitForElement = waitForElement;
    window.getElementInApp = getElementInApp;
    window.showElement = showElement;
    window.hideElement = hideElement;
    window.toggleElement = toggleElement;
    window.isElementVisible = isElementVisible;
    window.addClass = addClass;
    window.removeClass = removeClass;
    window.hasClass = hasClass;
    window.setText = setText;
    window.getText = getText;
    window.clearCache = clearCache;
    window.setCacheEnabled = setCacheEnabled;
}
