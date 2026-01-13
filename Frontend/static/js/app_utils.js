// ============= UTILITIES MODULE =============
// Общие утилиты, переводы, форматирование

// Автоматически определяем базовый URL API из текущего домена
const API_BASE = window.location.origin;

// ============= I18N (INTERNATIONALIZATION) =============
// Переводы загружаются из JSON файла
// ВАЖНО: Этот объект должен быть загружен до использования функции t()

// Инициализируем пустой объект переводов
let translations = {
    ru: {},
    uk: {},
    de: {},
    en: {}
};

// Загружаем переводы из JSON файла синхронно (для совместимости)
// В продакшене можно использовать асинхронную загрузку
function loadTranslations() {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/static/js/translations.json', false); // false = синхронный запрос
        xhr.send();
        
        if (xhr.status === 200) {
            const loadedTranslations = JSON.parse(xhr.responseText);
            // Объединяем загруженные переводы с существующими (на случай, если есть дефолтные)
            for (const lang in loadedTranslations) {
                if (loadedTranslations.hasOwnProperty(lang)) {
                    translations[lang] = Object.assign({}, translations[lang] || {}, loadedTranslations[lang]);
                }
            }
        } else {
            console.warn('Не удалось загрузить translations.json, используются пустые переводы');
        }
    } catch (error) {
        console.error('Ошибка загрузки translations.json:', error);
    }
}

// Загружаем переводы сразу при загрузке модуля
loadTranslations();

let currentLanguage = localStorage.getItem('language') || 'ru';

// Функция перевода
function t(key) {
    return translations[currentLanguage][key] || translations['ru'][key] || key;
}

// Функция для правильного склонения "активностей" на разных языках
function formatActivitiesCount(count) {
    if (currentLanguage === 'uk') {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${count} активностів`;
        } else if (lastDigit === 1) {
            return `${count} активність`;
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return `${count} активності`;
        } else {
            return `${count} активностів`;
        }
    } else if (currentLanguage === 'ru') {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${count} активностей`;
        } else if (lastDigit === 1) {
            return `${count} активность`;
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return `${count} активности`;
        } else {
            return `${count} активностей`;
        }
    } else if (currentLanguage === 'de') {
        return count === 1 ? `${count} Aktivität` : `${count} Aktivitäten`;
    } else {
        return count === 1 ? `${count} activity` : `${count} activities`;
    }
}

// Функция смены языка
function changeLanguage(lang) {
    currentLanguage = lang;
    if (typeof window !== 'undefined') {
        window.currentLanguage = lang;
    }
    localStorage.setItem('language', lang);
    applyTranslations();
    // Передаем lang явно в updateLanguageMenu для обновления флага
    if (typeof updateLanguageMenu === 'function') {
        updateLanguageMenu(lang);
    } else if (typeof window !== 'undefined' && typeof window.updateLanguageMenu === 'function') {
        window.updateLanguageMenu(lang);
    }
    updateDateInputLang();
    // Перезагружаем данные, которые зависят от языка
    if (document.getElementById('app-section') && !document.getElementById('app-section').classList.contains('hidden')) {
        if (typeof loadCategoryStats === 'function') loadCategoryStats();
        if (typeof loadCalendar === 'function') loadCalendar(currentCalendarPeriod);
        if (typeof loadActivities === 'function') loadActivities();
        if (typeof loadRewards === 'function') loadRewards();
        if (typeof loadRecommendations === 'function') loadRecommendations();
        if (typeof loadGoals === 'function') loadGoals();
        if (typeof loadStreak === 'function') loadStreak();
        if (typeof loadHistory === 'function') loadHistory();
        if (typeof setHistoryPeriod === 'function' && document.getElementById('history-period-today')) {
            setHistoryPeriod(historyPeriod);
        }
        if (typeof updateCategoryDropdown === 'function') {
            updateCategoryDropdown('activity-category');
            updateCategoryDropdown('edit-activity-category');
        }
        if (typeof updateAdminCategoryFilter === 'function') updateAdminCategoryFilter();
    }
    closeLanguageMenu();
}

// Применение переводов
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        option.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
}

// Управление языковым меню
function toggleLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function closeLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
        menu.classList.add('hidden');
    }
}

function updateLanguageMenu(langParam) {
    // Получаем текущий язык - сначала из параметра, потом из переменных
    let lang = langParam;
    if (!lang) {
        lang = (typeof window !== 'undefined' && window.currentLanguage) 
            ? window.currentLanguage 
            : (typeof currentLanguage !== 'undefined' ? currentLanguage : localStorage.getItem('language') || 'ru');
    }
    
    // Убеждаемся, что window.currentLanguage тоже обновлен
    if (typeof window !== 'undefined') {
        window.currentLanguage = lang;
    }
    if (typeof currentLanguage !== 'undefined') {
        currentLanguage = lang;
    }
    
    document.querySelectorAll('[data-check]').forEach(check => {
        check.classList.add('hidden');
    });
    document.querySelectorAll('[data-check-footer]').forEach(check => {
        check.classList.add('hidden');
    });
    const activeCheck = document.querySelector(`[data-check="${lang}"]`);
    if (activeCheck) {
        activeCheck.classList.remove('hidden');
    }
    const activeCheckFooter = document.querySelector(`[data-check-footer="${lang}"]`);
    if (activeCheckFooter) {
        activeCheckFooter.classList.remove('hidden');
    }
    
    // Обновляем флажок в кнопке хедера
    const flagMap = {
        'ru': '🇷🇺',
        'uk': '🇺🇦',
        'de': '🇩🇪',
        'en': '🇬🇧'
    };
    const flagEl = document.getElementById('current-language-flag');
    if (flagEl) {
        const flag = flagMap[lang] || flagMap['ru'] || '🇷🇺';
        flagEl.textContent = flag;
        console.log('[updateLanguageMenu app_utils] Updated header flag to:', flag, 'for language:', lang);
    }
    const flagFooterEl = document.getElementById('footer-language-flag');
    if (flagFooterEl) {
        const flag = flagMap[lang] || flagMap['ru'] || '🇷🇺';
        flagFooterEl.textContent = flag;
        console.log('[updateLanguageMenu app_utils] Updated footer flag to:', flag, 'for language:', lang);
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.style.maxWidth = '400px';
    notification.style.zIndex = '9999';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function updateDateInputLang() {
    const dateInput = document.getElementById('goal-target-date');
    const langMap = {
        'ru': 'ru-RU',
        'uk': 'uk-UA',
        'de': 'de-DE',
        'en': 'en-US'
    };
    const locale = langMap[currentLanguage] || 'ru-RU';
    const shortLang = currentLanguage || 'ru';

    if (document.documentElement) {
        document.documentElement.setAttribute('lang', shortLang);
    }
}

// Экспортируем функции в глобальную область видимости
if (typeof window !== 'undefined') {
    window.API_BASE = API_BASE;
    window.translations = translations;
    window.currentLanguage = currentLanguage;
    window.t = t;
    window.formatActivitiesCount = formatActivitiesCount;
    window.changeLanguage = changeLanguage;
    window.applyTranslations = applyTranslations;
    window.toggleLanguageMenu = toggleLanguageMenu;
    window.closeLanguageMenu = closeLanguageMenu;
    window.updateLanguageMenu = updateLanguageMenu;
    window.showNotification = showNotification;
    window.escapeHtml = escapeHtml;
    window.formatNumber = formatNumber;
    window.formatDate = formatDate;
    window.updateDateInputLang = updateDateInputLang;
}
