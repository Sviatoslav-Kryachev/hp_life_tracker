// ============= I18N (INTERNATIONALIZATION) =============
// ВАЖНО: API_BASE, translations, currentLanguage и функция t() определены в app_utils.js
// НЕ объявляем их здесь - используем существующие из app_utils.js

// Примечание: translations, currentLanguage и t() уже определены в app_utils.js
// Переводы загружаются из translations.json через app_utils.js
// Если они недоступны, используем window.translations, window.currentLanguage и window.t

// Переопределяем changeLanguage для добавления дополнительной логики
function changeLanguage(lang) {
    // Обновляем currentLanguage везде, где он может быть
    if (typeof window !== 'undefined') {
        window.currentLanguage = lang;
    }
    // Также обновляем локальную переменную, если она существует
    if (typeof currentLanguage !== 'undefined') {
        currentLanguage = lang;
    }
    localStorage.setItem('language', lang);
    
    // Применяем переводы и обновляем меню (включая флаг) - передаем lang явно
    applyTranslations();
    updateLanguageMenu(lang);
    // Обновляем lang атрибут для календаря
    updateDateInputLang();
    // Обновляем тексты аккордеонов
    updateHistoryAccordionButton();
    updateRewardsAccordionButton();
    // Перезагружаем данные, которые зависят от языка
    if (document.getElementById('app-section') && !document.getElementById('app-section').classList.contains('hidden')) {
        loadCategoryStats();
        loadCalendar(currentCalendarPeriod).then(() => {
            // Синхронизируем высоту виджетов после загрузки календаря
            if (typeof window.syncWidgetsHeight === 'function') {
                setTimeout(() => window.syncWidgetsHeight(), 100);
            }
        }).catch(() => {
            // Если loadCalendar не вернул promise, просто вызываем syncWidgetsHeight
            if (typeof window.syncWidgetsHeight === 'function') {
                setTimeout(() => window.syncWidgetsHeight(), 200);
            }
        });
        loadActivities();
        loadRewards(); // Перезагружаем награды для обновления кнопки "Купить"
        loadRecommendations();
        loadGoals(); // Перезагружаем цели для обновления дней до цели
        loadStreak(); // Перезагружаем streak для обновления "дней"
        loadHistory(); // Перезагружаем историю для обновления формата даты/времени
        // Инициализируем кнопки фильтра периода
        if (document.getElementById('history-period-today')) {
            setHistoryPeriod(historyPeriod);
        }
        updateCategoryDropdown('activity-category'); // Обновляем дропдаун категорий для новой активности
        updateCategoryDropdown('edit-activity-category'); // Обновляем дропдаун категорий для редактирования активности
        updateAdminCategoryFilter();

        // Если модальное окно статистики открыто, обновляем его
        const childStatsModal = document.getElementById("child-stats-modal");
        if (childStatsModal && !childStatsModal.classList.contains("hidden")) {
            const childId = childStatsModal.getAttribute("data-child-id");
            const translate = (typeof window !== 'undefined' && window.t) ? window.t : (typeof t !== 'undefined' ? t : (key) => key);
            const childName = document.getElementById("child-stats-name")?.textContent.replace(`${translate('stats_for')} `, "") || "";
            if (childId) {
                showChildStats(parseInt(childId), childName);
            }
        }
    }
    closeLanguageMenu();
}

function applyTranslations() {
    // Получаем функцию перевода
    const translate = (typeof window !== 'undefined' && window.t) ? window.t : (typeof t !== 'undefined' ? t : (key) => key);
    
    // Применяем переводы ко всем элементам с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translate(key);
    });

    // Применяем переводы к опциям в select (включая опции внутри select)
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        option.textContent = translate(key);
    });

    // Применяем переводы к placeholder'ам
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = translate(key);
    });

    // Применяем переводы к title атрибутам
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = translate(key);
    });
}

function toggleLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
        const isHidden = menu.classList.contains('hidden');
        // Закрываем все другие открытые меню
        document.querySelectorAll('#language-menu:not(.hidden)').forEach(m => {
            if (m !== menu) m.classList.add('hidden');
        });
        // Переключаем текущее меню
        menu.classList.toggle('hidden');
        // Для мобильных устройств убеждаемся, что меню видимо
        if (!isHidden === false) {
            // Меню открывается - убеждаемся, что оно на переднем плане
            menu.style.zIndex = '10002';
        }
    }
}

function closeLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
        menu.classList.add('hidden');
    }
}

function updateLanguageMenu(langParam) {
    // Получаем текущий язык - сначала из параметра, потом из window, потом из localStorage
    let lang = langParam;
    if (!lang) {
        if (typeof window !== 'undefined' && window.currentLanguage) {
            lang = window.currentLanguage;
        } else if (typeof currentLanguage !== 'undefined') {
            lang = currentLanguage;
        } else {
            lang = localStorage.getItem('language') || 'ru';
        }
    }
    
    // Убеждаемся, что window.currentLanguage тоже обновлен
    if (typeof window !== 'undefined') {
        window.currentLanguage = lang;
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
        console.log('[updateLanguageMenu] Updated header flag to:', flag, 'for language:', lang);
    } else {
        console.warn('[updateLanguageMenu] Element current-language-flag not found');
    }
    const flagFooterEl = document.getElementById('footer-language-flag');
    if (flagFooterEl) {
        const flag = flagMap[lang] || flagMap['ru'] || '🇷🇺';
        flagFooterEl.textContent = flag;
        console.log('[updateLanguageMenu] Updated footer flag to:', flag, 'for language:', lang);
    }
}

// Закрываем меню при клике вне его
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('language-switcher-wrapper');
    const menu = document.getElementById('language-menu');
    const btn = document.getElementById('language-switcher-btn');
    // Не закрываем, если клик был по кнопке или внутри меню
    if (wrapper && menu && !wrapper.contains(e.target) && e.target !== btn) {
        closeLanguageMenu();
    }

    // Закрываем меню языка в футере
    const footerMenu = document.getElementById('footer-language-menu');
    if (footerMenu && !footerMenu.contains(e.target) && !e.target.closest('button[onclick*="toggleLanguageMenu"]')) {
        footerMenu.classList.add('hidden');
    }
});

// Функция для переключения меню языка в футере
function toggleFooterLanguageMenu() {
    const menu = document.getElementById('footer-language-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Экспортируем функции для использования в HTML
window.toggleFooterLanguageMenu = toggleFooterLanguageMenu;

// Применяем переводы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    // Получаем язык из localStorage или используем 'ru' по умолчанию
    const savedLang = localStorage.getItem('language') || 'ru';
    updateLanguageMenu(savedLang);
    updateDateInputLang(); // Обновляем lang атрибут календаря при загрузке
});

// Экспортируем функции для использования в HTML
window.changeLanguage = changeLanguage;
window.toggleLanguageMenu = toggleLanguageMenu;
// t() уже экспортирована в app_utils.js, не переопределяем здесь
if (typeof window.t === 'undefined' && typeof t !== 'undefined') {
    window.t = t;
}

// ============= MOBILE MENU =============
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        menu.classList.add('hidden');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;

    menu.classList.add('hidden');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// ============= BOTTOM NAVIGATION (Mobile) =============

// Флаг для отслеживания программной прокрутки
let isScrolling = false;

function navigateToSection(section) {
    // Проверяем авторизацию перед навигацией
    const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
    if (!token) {
        console.warn('[navigateToSection] No token, redirecting to auth');
        // Очищаем hash и показываем форму авторизации
        window.location.hash = '';
        if (typeof window.showAuth === 'function') {
            window.showAuth();
        }
        return;
    }
    
    // Проверяем, мобильное ли устройство (до 1024px)
    const isMobile = window.innerWidth <= 1024;
    
    // Удаляем активный класс у всех кнопок
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
    });
    
    // Добавляем активный класс к выбранной кнопке
    const activeBtn = document.querySelector(`.mobile-nav-btn[data-section="${section}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active-nav');
    }
    
    // Закрываем мобильное меню если открыто
    closeMobileMenu();
    
    if (isMobile) {
        // На мобильных: показываем/скрываем секции вместо скролла
        showMobileSection(section);
        
        // Обновляем URL через History API
        const url = `#${section}`;
        if (window.location.hash !== url) {
            window.history.pushState({ section: section }, '', url);
        }
    } else {
        // На десктопе: используем старую логику со скроллом
        isScrolling = true;
        
        let targetElement = null;
        
        switch(section) {
            case 'activities':
                targetElement = document.getElementById('activities');
                break;
            case 'rewards':
                targetElement = document.getElementById('rewards');
                break;
            case 'history':
                targetElement = document.getElementById('history');
                break;
            case 'goals':
                targetElement = document.getElementById('goals-list');
                if (!targetElement) {
                    const sidebar = document.querySelector('.grid.lg\\:grid-cols-3 > .lg\\:col-span-1');
                    if (sidebar) targetElement = sidebar;
                }
                break;
        }
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            setTimeout(() => {
                const headerHeight = document.querySelector('.fixed.top-0')?.offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - 10;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    isScrolling = false;
                    updateActiveNavButton();
                }, 600);
            }, 100);
        } else {
            isScrolling = false;
        }
    }
}

// Функция для показа/скрытия секций на мобильных
function showMobileSection(section) {
    console.log('[showMobileSection] Showing section:', section);
    
    // Находим все grid контейнеры с классом lg:grid-cols-3
    // Их два: один для activities+sidebar, другой для rewards+history
    const allGrids = document.querySelectorAll('.grid.lg\\:grid-cols-3');
    
    // Первый grid содержит activities (lg:col-span-2) и sidebar (lg:col-span-1)
    const activitiesGrid = allGrids[0] || null;
    
    // Второй grid содержит rewards (lg:col-span-2) и history
    const rewardsHistoryGrid = allGrids[1] || null;
    
    // Ищем sidebar (виджеты: goals, streak, category-stats, recommendations)
    // Он находится в первом grid контейнере
    const sidebar = activitiesGrid ? activitiesGrid.querySelector('.lg\\:col-span-1') : null;
    
    console.log('[showMobileSection] Found elements:', {
        activitiesGrid: !!activitiesGrid,
        rewardsHistoryGrid: !!rewardsHistoryGrid,
        sidebar: !!sidebar,
        totalGrids: allGrids.length
    });
    
    // Скрываем все grid контейнеры
    allGrids.forEach(grid => {
        if (grid) {
            grid.classList.remove('mobile-section-visible');
            grid.classList.add('mobile-section-hidden');
        }
    });
    
    // Скрываем sidebar отдельно
    if (sidebar) {
        sidebar.classList.remove('mobile-section-visible');
        sidebar.classList.add('mobile-section-hidden');
    }
    
    // Показываем выбранную секцию
    switch(section) {
        case 'activities':
            if (activitiesGrid) {
                activitiesGrid.classList.remove('mobile-section-hidden');
                activitiesGrid.classList.add('mobile-section-visible');
                console.log('[showMobileSection] Activities section shown');
            } else {
                console.warn('[showMobileSection] Activities grid not found!');
            }
            break;
        case 'rewards':
            if (rewardsHistoryGrid) {
                rewardsHistoryGrid.classList.remove('mobile-section-hidden');
                rewardsHistoryGrid.classList.add('mobile-section-visible');
                console.log('[showMobileSection] Rewards section shown');
            } else {
                console.warn('[showMobileSection] Rewards grid not found!');
            }
            break;
        case 'history':
            if (rewardsHistoryGrid) {
                rewardsHistoryGrid.classList.remove('mobile-section-hidden');
                rewardsHistoryGrid.classList.add('mobile-section-visible');
                console.log('[showMobileSection] History section shown');
            } else {
                console.warn('[showMobileSection] History grid not found!');
            }
            break;
        case 'goals':
            if (sidebar) {
                sidebar.classList.remove('mobile-section-hidden');
                sidebar.classList.add('mobile-section-visible');
                console.log('[showMobileSection] Goals sidebar shown');
            } else {
                console.warn('[showMobileSection] Sidebar not found!');
            }
            break;
    }
    
    // Блоки Today, Calendar, Progress всегда остаются видимыми
    // (они находятся в .grid.grid-cols-1.md:grid-cols-3 и не обрабатываются здесь)
    
    // Скроллим вверх страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Экспортируем функции навигации для использования в HTML
window.navigateToSection = navigateToSection;
window.showMobileSection = showMobileSection;

// Инициализируем обработчики событий для bottom navigation после загрузки DOM
function initBottomNavigation() {
    const bottomNav = document.getElementById('bottom-navigation');
    if (bottomNav) {
        // Удаляем старые обработчики, если они есть (через проверку атрибута)
        if (bottomNav.hasAttribute('data-handler-attached')) {
            return; // Обработчик уже прикреплен
        }
        
        // Используем делегирование событий для кнопок навигации
        bottomNav.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.mobile-nav-btn');
            if (button && button.dataset.section) {
                const section = button.dataset.section;
                console.log('[initBottomNavigation] Button clicked, section:', section);
                
                if (typeof window.navigateToSection === 'function') {
                    window.navigateToSection(section);
                } else if (typeof navigateToSection === 'function') {
                    navigateToSection(section);
                } else {
                    console.error('navigateToSection is not defined!');
                }
            }
        }, true); // Используем capture phase для надежности
        
        bottomNav.setAttribute('data-handler-attached', 'true');
        console.log('[initBottomNavigation] Bottom navigation initialized');
    } else {
        console.warn('[initBottomNavigation] Bottom navigation element not found');
    }
}

// Инициализируем при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBottomNavigation);
} else {
    initBottomNavigation();
}

// Также инициализируем после загрузки компонентов (на случай динамической загрузки)
if (typeof window !== 'undefined') {
    window.initBottomNavigation = initBottomNavigation;
}

// Устанавливаем активную кнопку при скролле (опционально)
// Флаг для отслеживания программной прокрутки (объявлен выше, в функции navigateToSection)

// Функция для обновления активной кнопки на основе позиции скролла
function updateActiveNavButton() {
    const scrollPosition = window.pageYOffset + 150; // С учетом хедера
    const viewportHeight = window.innerHeight;
    
    const activitiesEl = document.getElementById('activities');
    const rewardsEl = document.getElementById('rewards');
    const historyEl = document.getElementById('history');
    const goalsEl = document.getElementById('goals-list');
    
    const sections = [
        { id: 'activities', el: activitiesEl },
        { id: 'rewards', el: rewardsEl },
        { id: 'history', el: historyEl },
        { id: 'goals', el: goalsEl }
    ].filter(s => s.el);
    
    // Находим текущую секцию на основе позиции скролла
    // Используем более точную логику: секция считается активной, если она видна на экране
    let currentSection = 'activities';
    let bestMatch = null;
    let bestScore = -Infinity;
    
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.el.getBoundingClientRect();
        
        // Проверяем, видна ли секция на экране
        const isVisible = rect.top < viewportHeight && rect.bottom > 0;
        
        if (isVisible) {
            // Вычисляем "оценку" видимости секции
            // Чем больше секция видна в верхней части экрана, тем выше оценка
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleHeight = visibleBottom - visibleTop;
            const score = visibleHeight - Math.abs(rect.top - 100); // Предпочитаем секции ближе к верху экрана
            
            // Для goals-list используем более строгую проверку - он должен быть явно виден
            if (section.id === 'goals') {
                // Goals активен только если он явно в видимой области и не слишком далеко сверху
                if (rect.top >= 100 && rect.top < viewportHeight - 200) {
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = section.id;
                    }
                }
            } else {
                // Для основных секций (activities, rewards, history) используем стандартную логику
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = section.id;
                }
            }
        }
    }
    
    // Если нашли подходящую секцию, используем её, иначе используем старую логику
    if (bestMatch) {
        currentSection = bestMatch;
    } else {
        // Fallback: используем старую логику для секций, которые находятся ниже текущей позиции скролла
        for (let i = sections.length - 1; i >= 0; i--) {
            const rect = sections[i].el.getBoundingClientRect();
            // Пропускаем goals в fallback логике, так как он в sidebar
            if (sections[i].id === 'goals') continue;
            if (rect.top <= scrollPosition) {
                currentSection = sections[i].id;
                break;
            }
        }
    }
    
    // Обновляем активную кнопку
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
        if (btn.dataset.section === currentSection) {
            btn.classList.add('active-nav');
        }
    });
}

window.addEventListener('scroll', () => {
    if (isScrolling) return; // Игнорируем скролл во время программной прокрутки
    
    updateActiveNavButton();
}, { passive: true });

// Обработчик для кнопки "Назад" в браузере (History API)
window.addEventListener('popstate', (event) => {
    const isMobile = window.innerWidth <= 1024;
    if (isMobile && event.state && event.state.section) {
        // Восстанавливаем секцию из истории
        navigateToSection(event.state.section);
    } else if (isMobile) {
        // Если нет state, проверяем hash в URL
        // НО только если пользователь авторизован
        const token = typeof getAuthToken === 'function' ? getAuthToken() : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken() : localStorage.getItem('token') || '';
        if (token) {
            const hash = window.location.hash.replace('#', '');
            if (hash && ['activities', 'rewards', 'history', 'goals'].includes(hash)) {
                navigateToSection(hash);
            } else {
                // По умолчанию показываем activities
                // На мобильных показываем секцию activities по умолчанию
                if (window.innerWidth <= 1024) {
                    navigateToSection('activities');
                }
            }
        } else {
            // Если не авторизован, очищаем hash и показываем форму авторизации
            if (window.location.hash) {
                window.location.hash = '';
            }
            if (typeof window.showAuth === 'function') {
                window.showAuth();
            }
        }
    }
});

// Устанавливаем начальную активную кнопку (только для десктопа)
document.addEventListener('DOMContentLoaded', () => {
    // На десктопе: устанавливаем активную кнопку по умолчанию
    // На мобильных инициализация происходит в showApp()
    const isMobile = window.innerWidth <= 1024;
    if (!isMobile) {
        const activitiesBtn = document.querySelector('.mobile-nav-btn[data-section="activities"]');
        if (activitiesBtn) {
            activitiesBtn.classList.add('active-nav');
        }
    }
    
    // Закрываем языковое меню при клике вне его
    document.addEventListener('click', function(event) {
        const languageMenu = document.getElementById('language-menu');
        const languageWrapper = document.getElementById('language-switcher-wrapper');
        
        if (languageMenu && !languageMenu.classList.contains('hidden')) {
            // Если клик был вне языкового меню и не на кнопке переключения языка
            if (languageWrapper && !languageWrapper.contains(event.target)) {
                closeLanguageMenu();
            }
        }
    });
});

// ============= AUTH STATE =============
// authToken, currentUser и getAuthToken() определены в app_auth.js

// ============= APP STATE =============
// activeTimers, allActivities, activitiesFilterState определены в app_activities.js
// allRewards определен в app_rewards.js
let activitiesAccordionExpanded = false; // По умолчанию свернут - показываем только первые 5 активностей

// ============= DOM ELEMENTS =============
let authSection, appSection, activityNameInput, xpPerHourInput, newActivityForm, balanceSpan, levelSpan;

// Инициализация DOM элементов после загрузки страницы
function initDOMElements() {
    authSection = document.getElementById("auth-section");
    appSection = document.getElementById("app-section");
    activityNameInput = document.getElementById("activity-name");
    xpPerHourInput = document.getElementById("xp-per-hour");
    newActivityForm = document.getElementById("new-activity-form");
    balanceSpan = document.getElementById("balance");
    levelSpan = document.getElementById("level");
}
// Элементы будут инициализированы при первом использовании
let rewardsListVisible, rewardsListHidden, rewardsAccordionBtn;
let historyListVisible, historyListHidden, historyAccordionBtn;
let activitiesListVisible, activitiesListHidden, activitiesAccordionBtn;

function getRewardsElements() {
    // Всегда переинициализируем, чтобы убедиться, что элементы найдены
    const appSection = document.getElementById("app-section");
    if (!appSection || appSection.classList.contains("hidden")) {
        // Секция скрыта, элементы недоступны
        rewardsListVisible = null;
        rewardsListHidden = null;
        rewardsAccordionBtn = null;
        return;
    }

    rewardsListVisible = document.getElementById("rewards-list-visible");
    rewardsListHidden = document.getElementById("rewards-list-hidden");
    rewardsAccordionBtn = document.getElementById("rewards-accordion-btn");

    // Дополнительная проверка через querySelector
    if (!rewardsListVisible) {
        rewardsListVisible = document.querySelector("#rewards-list-visible");
    }
    if (!rewardsListHidden) {
        rewardsListHidden = document.querySelector("#rewards-list-hidden");
    }
    if (!rewardsAccordionBtn) {
        rewardsAccordionBtn = document.querySelector("#rewards-accordion-btn");
    }
}

function getHistoryElements() {
    // Всегда переинициализируем, чтобы убедиться, что элементы найдены
    const appSection = document.getElementById("app-section");
    if (!appSection || appSection.classList.contains("hidden")) {
        // Секция скрыта, элементы недоступны
        historyListVisible = null;
        historyListHidden = null;
        historyAccordionBtn = null;
        return;
    }

    historyListVisible = document.getElementById("history-list-visible");
    historyListHidden = document.getElementById("history-list-hidden");
    historyAccordionBtn = document.getElementById("history-accordion-btn");

    // Дополнительная проверка через querySelector
    if (!historyListVisible) {
        historyListVisible = document.querySelector("#history-list-visible");
    }
    if (!historyListHidden) {
        historyListHidden = document.querySelector("#history-list-hidden");
    }
    if (!historyAccordionBtn) {
        historyAccordionBtn = document.querySelector("#history-accordion-btn");
    }
}
const rewardMessage = document.getElementById("reward-message");
const newRewardForm = document.getElementById("new-reward-form");
const rewardNameInput = document.getElementById("reward-name");
const rewardCostInput = document.getElementById("reward-cost");


// ============= AUTH FUNCTIONS =============
// Функция инициализации обработчиков форм авторизации
function initAuthForms() {
    // Используем делегирование событий на auth-section для надежности
    const authSection = document.getElementById('auth-section');
    if (!authSection) {
        // Если auth-section еще не загружен, попробуем позже
        setTimeout(initAuthForms, 100);
        return;
    }
    
    // Удаляем старые обработчики, если они есть (через клонирование)
    const existingHandler = authSection.getAttribute('data-auth-handler');
    if (existingHandler === 'true') {
        return; // Обработчики уже установлены
    }
    
    // Обработчик для формы логина и регистрации через делегирование
    authSection.addEventListener('submit', async function(e) {
        if (e.target.id === 'login-form') {
            e.preventDefault();
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");
            const submitBtn = e.target.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput) {
                console.error("Login form inputs not found");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            // Отключаем кнопку во время загрузки
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Вход...';

                try {
                    await login(email, password);
                } finally {
                    // Включаем кнопку обратно
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } else {
                await login(email, password);
            }
        }
        
        // Обработчик для формы регистрации
        if (e.target.id === 'register-form') {
            e.preventDefault();
            const email = document.getElementById("register-email").value;
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;
            const passwordConfirm = document.getElementById("register-password-confirm").value;

            if (password !== passwordConfirm) {
                const errorEl = document.getElementById("register-error");
                if (errorEl) {
                    errorEl.textContent = "Пароли не совпадают";
                    errorEl.classList.remove("hidden");
                }
                return;
            }

            register(email, username, password);
        }
    }, true); // Используем capture phase для надежности
    
    authSection.setAttribute('data-auth-handler', 'true');
}

// Экспортируем функцию для использования в index.html
if (typeof window !== 'undefined') {
    window.initAuthForms = initAuthForms;
}

function showLoginForm() {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-tab").classList.add("bg-white", "shadow", "text-indigo-600");
    document.getElementById("login-tab").classList.remove("text-gray-500");
    document.getElementById("register-tab").classList.remove("bg-white", "shadow", "text-indigo-600");
    document.getElementById("register-tab").classList.add("text-gray-500");
}

function showRegisterForm() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("register-tab").classList.add("bg-white", "shadow", "text-indigo-600");
    document.getElementById("register-tab").classList.remove("text-gray-500");
    document.getElementById("login-tab").classList.remove("bg-white", "shadow", "text-indigo-600");
    document.getElementById("login-tab").classList.add("text-gray-500");
}

// Функция login определена в app_auth.js

// Функция register определена в app_auth.js

// Функция loadCurrentUser определена в app_auth.js

async function checkAdminStatus() {
    try {
        const token = getAuthToken();
        if (!token) return;
        // Пытаемся получить invite код - если успешно, значит админ
        try {
            await apiGet('/admin/invite-code');
            const adminBtn = document.getElementById("admin-btn");
            const footerAdminBtn = document.getElementById("footer-admin-btn");
            if (adminBtn) adminBtn.classList.remove("hidden");
            if (footerAdminBtn) footerAdminBtn.classList.remove("hidden");
            loadInviteCode();
        } catch (e) {
            // Не админ или ошибка
        }
    } catch (e) {
        // Ошибка при проверке статуса админа
        console.error('Error checking admin status:', e);
    }
}

// Функция logout определена в app_auth.js

// Telegram linking functions
function openTelegramLinkModal() {
    const modal = document.getElementById('telegram-link-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Проверяем текущий статус привязки
        checkTelegramStatus();
    }
}

function closeTelegramLinkModal() {
    const modal = document.getElementById('telegram-link-modal');
    if (modal) {
        modal.classList.add('hidden');
        const input = document.getElementById('telegram-id-input');
        if (input) input.value = '';
        const status = document.getElementById('telegram-link-status');
        if (status) {
            status.classList.add('hidden');
            status.textContent = '';
        }
    }
}

async function checkTelegramStatus() {
    try {
        const data = await apiGet('/telegram/status');
        const statusDiv = document.getElementById('telegram-link-status');
        const input = document.getElementById('telegram-id-input');
        
        if (data.linked) {
            if (statusDiv) {
                statusDiv.className = 'p-3 rounded-xl bg-green-50 border border-green-200';
                statusDiv.innerHTML = `<p class="text-sm text-green-800">✅ ${t('telegram_linked')}: ${data.telegram_id}</p>`;
                statusDiv.classList.remove('hidden');
            }
                if (input) {
                    input.value = data.telegram_id;
                    input.disabled = true;
                }
            } else {
                if (statusDiv) {
                    statusDiv.classList.add('hidden');
                }
                if (input) {
                    input.disabled = false;
                }
            }
        }
    } catch (e) {
        console.error('Error checking telegram status:', e);
    }
}

async function linkTelegramAccount() {
    const input = document.getElementById('telegram-id-input');
    const statusDiv = document.getElementById('telegram-link-status');
    
    if (!input || !input.value) {
        if (statusDiv) {
            statusDiv.className = 'p-3 rounded-xl bg-red-50 border border-red-200';
            statusDiv.innerHTML = `<p class="text-sm text-red-800">❌ ${t('enter_telegram_id')}</p>`;
            statusDiv.classList.remove('hidden');
        }
        return;
    }
    
    const telegramId = parseInt(input.value);
    if (isNaN(telegramId) || telegramId <= 0) {
        if (statusDiv) {
            statusDiv.className = 'p-3 rounded-xl bg-red-50 border border-red-200';
            statusDiv.innerHTML = `<p class="text-sm text-red-800">❌ ${t('invalid_telegram_id')}</p>`;
            statusDiv.classList.remove('hidden');
        }
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/telegram/link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                telegram_id: telegramId
            })
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || t('error_linking'));
        }
        
        const data = await res.json();
        if (statusDiv) {
            statusDiv.className = 'p-3 rounded-xl bg-green-50 border border-green-200';
            statusDiv.innerHTML = `<p class="text-sm text-green-800">✅ ${data.message || t('telegram_linked_success')}</p>`;
            statusDiv.classList.remove('hidden');
        }
        
        // Обновляем статус
        setTimeout(() => {
            checkTelegramStatus();
        }, 1000);
        
        showNotification(`✅ ${t('telegram_linked_success')}`, 'success');
        
    } catch (e) {
        if (statusDiv) {
            statusDiv.className = 'p-3 rounded-xl bg-red-50 border border-red-200';
            statusDiv.innerHTML = `<p class="text-sm text-red-800">❌ ${e.message || t('error_linking')}</p>`;
            statusDiv.classList.remove('hidden');
        }
    }
}

// Функция showAuth определена в app_auth.js

// Функция showApp определена в app_auth.js

async function checkAuth() {
    // Убеждаемся, что элементы инициализированы
    if (!authSection || !appSection) {
        initDOMElements();
    }

    // Предотвращаем скролл вниз при загрузке
    if (window.scrollY > 0 || document.documentElement.scrollTop > 0) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    // Сразу скрываем auth-section если есть токен, чтобы избежать мигания
    const token = getAuthToken();
    if (token && authSection && appSection) {
        authSection.classList.add("hidden");
        appSection.classList.remove("hidden");
    } else {
        if (authSection && appSection) {
            showAuth();
        }
        return;
    }

    try {
        await loadCurrentUser();
        showApp();
        
        // После загрузки приложения убеждаемся, что страница вверху
        setTimeout(() => {
            if (window.scrollY > 0 || document.documentElement.scrollTop > 0) {
                window.scrollTo(0, 0);
            }
        }, 100);
    } catch (e) {
        showAuth();
    }
}


// ============= WALLET =============
// Функции перенесены в app_wallet.js
// Удалено: loadWallet, loadTodayStats, loadCategoryStats, loadCalendar, loadWeekCalendar, changeCalendarPeriod, showDayDetails, closeDayDetailsModal, showMonthDetails, loadStreak, loadRecommendations

// ============= HISTORY =============
// Функции перенесены в app_history.js

// ============= ACTIVITIES =============
// Функции перенесены в app_activities.js

// ============= REWARDS =============
// Функции перенесены в app_rewards.js

// ============= HISTORY =============
// Функции перенесены в app_history.js

// ============= ACTIVITIES =============
// Функции перенесены в app_activities.js

// ============= REWARDS =============
// Функции перенесены в app_rewards.js

// ============= STREAK =============
// Функции перенесены в app_wallet.js

// ============= RECOMMENDATIONS =============
// Функции перенесены в app_wallet.js

// ============= CATEGORIES =============
// Функции перенесены в app_categories.js

// ============= GOALS =============
// Функции перенесены в app_goals.js

// ============= ACTIVITIES =============
// Функции перенесены в app_activities.js

// ============= ACTIVITIES =============
// Функции loadActivities, createActivity, updateActivity, deleteActivity, toggleTimer, startTimer, stopTimer определены в app_activities.js

// ============= REWARDS =============
// Функции перенесены в app_rewards.js

// ============= STREAK =============
// Функции перенесены в app_wallet.js

// ============= RECOMMENDATIONS =============
// Функции перенесены в app_wallet.js

// ============= CATEGORIES =============
// Функции перенесены в app_categories.js

// ============= GOALS =============
// Функции перенесены в app_goals.js

// ============= ACTIVITIES =============
// Функции перенесены в app_activities.js

// ============= ACTIVITIES =============
// Функция loadActivities определена в app_activities.js

// ============= ACTIVITIES =============
// Функции loadActivities, createActivity, updateActivity, deleteActivity, toggleTimer, startTimer, stopTimer определены в app_activities.js

// Функция фильтрации истории по периоду (не путать с loadActivities)
function filterHistoryByPeriod(data, period) {
    // Получаем сегодняшнюю дату в Берлинском времени
    // Используем Intl.DateTimeFormat для надежного получения даты в нужном timezone
    const berlinFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const now = new Date();
    const todayBerlinStr = berlinFormatter.format(now); // Формат YYYY-MM-DD

    // Для периода "today" просто сравниваем строки дат
    if (period === 'today') {
        const filtered = data.filter(item => {
            if (!item.date) return false;
            try {
                // Парсим дату из ISO строки
                const itemDate = new Date(item.date);
                // Проверяем, что дата валидна
                if (isNaN(itemDate.getTime())) {
                    console.warn('Invalid date:', item.date);
                    return false;
                }
                // Получаем дату в Берлинском времени
                const itemBerlinStr = berlinFormatter.format(itemDate);
                // Сравниваем строки дат напрямую
                const matches = itemBerlinStr === todayBerlinStr;
                return matches;
            } catch (e) {
                console.warn('Invalid date in history item:', item.date, e);
                return false;
            }
        });
        console.log('Today filter:', {
            period,
            todayBerlinStr,
            totalItems: data.length,
            filteredCount: filtered.length,
            sampleDates: data.slice(0, 3).map(item => ({
                date: item.date,
                formatted: item.date ? berlinFormatter.format(new Date(item.date)) : 'N/A'
            }))
        });
        return filtered;
    }

    // Для других периодов используем сравнение дат
    const [todayYear, todayMonth, todayDay] = todayBerlinStr.split('-').map(Number);

    // Создаем начало сегодняшнего дня в локальном времени для сравнения
    const todayStart = new Date(todayYear, todayMonth - 1, todayDay, 0, 0, 0, 0);

    let startDate;

    switch (period) {
        case 'week':
            startDate = new Date(todayStart);
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(todayStart);
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case 'year':
            startDate = new Date(todayStart);
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        case 'all':
        default:
            return data; // Возвращаем все данные без фильтрации
    }

    return data.filter(item => {
        if (!item.date) return false;
        try {
            const itemDate = new Date(item.date);
            return itemDate >= startDate;
        } catch (e) {
            console.warn('Invalid date in history item:', item.date, e);
            return false;
        }
    });
}

// Функция для установки периода фильтра
// Функция setHistoryPeriod определена в app_history.js

// Функция loadHistory определена в app_history.js

// ============= ACCORDION FUNCTIONS =============
function toggleRewardsAccordion() {
    getRewardsElements();
    const rewardsContainer = document.getElementById('rewards-list-container');
    if (!rewardsListHidden || !rewardsAccordionBtn || !rewardsContainer) {
        console.error("Rewards accordion elements not found");
        return;
    }

    const isExpanded = rewardsContainer.classList.contains('rewards-expanded');
    const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
    const text = rewardsAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    if (!isExpanded) {
        // Открываем аккордеон - перемещаем все награды в hidden и делаем контейнер скроллируемым
        // Сначала перемещаем все награды из visible в hidden
        while (rewardsListVisible && rewardsListVisible.firstChild) {
            rewardsListHidden.appendChild(rewardsListVisible.firstChild);
        }

        // Показываем hidden и применяем стили для скролла
        rewardsListHidden.classList.remove('hidden');
        rewardsContainer.classList.add('rewards-expanded');

        // Динамически рассчитываем высоту для ровно 4 наград
        requestAnimationFrame(() => {
            if (rewardsContainer && rewardsListHidden.children.length > 0) {
                // Получаем высоту первой награды
                const firstCard = rewardsListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 8; // space-y-2 = 0.5rem = 8px
                    // Высота для 4 наград: 4 карточки + 3 промежутка
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    rewardsContainer.style.maxHeight = calculatedHeight + 'px';
                    rewardsContainer.style.transition = 'max-height 300ms ease';
                }
                // Убеждаемся, что скролл начинается с начала
                rewardsContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_rewards');
        localStorage.setItem('rewardsAccordionExpanded', 'true');
    } else {
        // Закрываем аккордеон - возвращаем первые 4-5 в visible, остальные в hidden
        const allCards = Array.from(rewardsListHidden.children);

        // Очищаем оба списка
        if (rewardsListVisible) rewardsListVisible.innerHTML = "";
        rewardsListHidden.innerHTML = "";

        // Распределяем: первые 4-5 в visible, остальные в hidden
        allCards.forEach((card, index) => {
            if (index < 4 && rewardsListVisible) {
                rewardsListVisible.appendChild(card);
            } else {
                rewardsListHidden.appendChild(card);
            }
        });

        // Убираем класс expanded и скрываем hidden
        rewardsContainer.classList.remove('rewards-expanded');
        rewardsContainer.style.maxHeight = ''; // Сбрасываем динамическую высоту
        rewardsListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_rewards');
        localStorage.setItem('rewardsAccordionExpanded', 'false');
    }
}

function updateRewardsAccordionButton() {
    getRewardsElements();
    const rewardsContainer = document.getElementById('rewards-list-container');
    if (!rewardsListHidden || !rewardsAccordionBtn || !rewardsContainer) return;

    const isExpanded = localStorage.getItem('rewardsAccordionExpanded') === 'true';
    const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
    const text = rewardsAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    if (isExpanded) {
        // Открываем аккордеон - перемещаем все награды в hidden и делаем контейнер скроллируемым
        while (rewardsListVisible && rewardsListVisible.firstChild) {
            rewardsListHidden.appendChild(rewardsListVisible.firstChild);
        }

        rewardsListHidden.classList.remove('hidden');
        rewardsContainer.classList.add('rewards-expanded');

        // Динамически рассчитываем высоту для ровно 4-5 наград
        requestAnimationFrame(() => {
            if (rewardsContainer && rewardsListHidden.children.length > 0) {
                const firstCard = rewardsListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 8; // space-y-2 = 0.5rem = 8px
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    rewardsContainer.style.maxHeight = calculatedHeight + 'px';
                }
                rewardsContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_rewards');
    } else {
        // Закрываем аккордеон - возвращаем первые 4-5 в visible, остальные в hidden
        const allCards = Array.from(rewardsListHidden.children);
        if (rewardsListVisible) rewardsListVisible.innerHTML = "";
        rewardsListHidden.innerHTML = "";

        allCards.forEach((card, index) => {
            if (index < 4 && rewardsListVisible) {
                rewardsListVisible.appendChild(card);
            } else {
                rewardsListHidden.appendChild(card);
            }
        });

        rewardsContainer.classList.remove('rewards-expanded');
        rewardsContainer.style.maxHeight = '';
        rewardsListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_rewards');
    }
}

function toggleHistoryAccordion() {
    getHistoryElements();
    const historyContainer = document.getElementById('history-list-container');
    if (!historyListHidden || !historyAccordionBtn || !historyContainer) {
        console.error("History accordion elements not found");
        return;
    }

    const isExpanded = historyContainer.classList.contains('history-expanded');
    const icon = historyAccordionBtn.querySelector('.accordion-icon');
    const text = historyAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    if (!isExpanded) {
        // Открываем аккордеон - перемещаем все транзакции в hidden и делаем контейнер скроллируемым
        while (historyListVisible && historyListVisible.firstChild) {
            historyListHidden.appendChild(historyListVisible.firstChild);
        }

        // Показываем hidden и применяем стили для скролла
        historyListHidden.classList.remove('hidden');
        historyContainer.classList.add('history-expanded');

        // Убираем fixed позиционирование (больше не используется)
        if (historyListVisible) {
            historyListVisible.classList.remove('history-fixed');
        }

        // Применяем класс expanded к блоку history для правильного скролла
        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.add('history-expanded');
        }

        // Контейнер будет скроллируемым автоматически через CSS
        // Не скроллим наверх, сохраняем текущую позицию

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_history');
        localStorage.setItem('historyAccordionExpanded', 'true');
    } else {
        // Закрываем аккордеон - возвращаем первые 4 в visible, остальные в hidden
        const allItems = Array.from(historyListHidden.children);

        if (historyListVisible) historyListVisible.innerHTML = "";
        historyListHidden.innerHTML = "";

        // Распределяем: первые 4 в visible, остальные в hidden
        allItems.forEach((item, index) => {
            if (index < 4 && historyListVisible) {
                historyListVisible.appendChild(item);
            } else {
                historyListHidden.appendChild(item);
            }
        });

        // Убираем класс expanded и скрываем hidden
        historyContainer.classList.remove('history-expanded');
        historyContainer.style.maxHeight = '';
        historyListHidden.classList.add('hidden');

        // Убираем класс expanded с блока history
        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.remove('history-expanded');
        }

        // Больше не используем fixed позиционирование
        // Все элементы обычные

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_history');
        localStorage.setItem('historyAccordionExpanded', 'false');
    }
}

function updateHistoryAccordionButton() {
    getHistoryElements();
    const historyContainer = document.getElementById('history-list-container');
    if (!historyListHidden || !historyAccordionBtn || !historyContainer) return;

    const isExpanded = localStorage.getItem('historyAccordionExpanded') === 'true';
    const icon = historyAccordionBtn.querySelector('.accordion-icon');
    const text = historyAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    if (isExpanded) {
        // Открываем аккордеон - перемещаем все транзакции в hidden и делаем контейнер скроллируемым
        while (historyListVisible && historyListVisible.firstChild) {
            historyListHidden.appendChild(historyListVisible.firstChild);
        }

        historyListHidden.classList.remove('hidden');
        historyContainer.classList.add('history-expanded');

        // Убираем fixed позиционирование
        if (historyListVisible) {
            historyListVisible.classList.remove('history-fixed');
        }

        // Применяем класс expanded к блоку history для правильного скролла
        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.add('history-expanded');
        }

        // Убираем scrollTop = 0 чтобы не скроллить наверх
        // Контейнер будет скроллируемым автоматически через CSS

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_history');
    } else {
        // Закрываем аккордеон - возвращаем первые 4 в visible, остальные в hidden
        const allItems = Array.from(historyListHidden.children);
        if (historyListVisible) historyListVisible.innerHTML = "";
        historyListHidden.innerHTML = "";

        allItems.forEach((item, index) => {
            if (index < 4 && historyListVisible) {
                historyListVisible.appendChild(item);
            } else {
                historyListHidden.appendChild(item);
            }
        });

        historyContainer.classList.remove('history-expanded');
        historyContainer.style.maxHeight = '';
        historyListHidden.classList.add('hidden');

        // Убираем класс expanded с блока history
        const historyBlock = document.getElementById('history');
        if (historyBlock) {
            historyBlock.classList.remove('history-expanded');
        }

        // Больше не используем fixed позиционирование
        // Все элементы обычные

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_history');
    }
}

// ============= ACTIVITIES =============
// Функция loadActivities определена в app_activities.js

// Обновление фильтра категорий
function updateActivitiesCategoryFilter() {
    const categoryFilter = document.getElementById('activities-category-filter');
    if (!categoryFilter) return;

    // Сохраняем текущее значение
    const currentValue = categoryFilter.value;

    // Очищаем опции (кроме "Все категории")
    categoryFilter.innerHTML = `<option value="all">📂 ${t('all_categories')}</option>`;

    // Получаем уникальные категории из активностей
    const categories = new Set();
    allActivities.forEach(activity => {
        const category = activity.category || 'general';
        categories.add(category);
    });

    // Создаем объект с названиями категорий
    const categoryNames = {
        "general": t('category_general'),
        "study": t('category_study'),
        "sport": t('category_sport'),
        "hobby": t('category_hobby'),
        "work": t('category_work'),
        "health": t('category_health')
    };

    // Добавляем пользовательские категории
    if (allCategories.custom) {
        allCategories.custom.forEach(customCat => {
            categoryNames[customCat.id] = customCat.name;
        });
    }

    // Сортируем категории по названию
    const sortedCategories = Array.from(categories).sort((a, b) => {
        const nameA = categoryNames[a] || a;
        const nameB = categoryNames[b] || b;
        return nameA.localeCompare(nameB);
    });

    // Добавляем опции
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = categoryNames[category] || category;
        categoryFilter.appendChild(option);
    });


    // Восстанавливаем значение, если оно все еще существует
    if (currentValue && Array.from(categoryFilter.options).some(opt => opt.value === currentValue)) {
        categoryFilter.value = currentValue;
    }
}

// Получение элементов аккордеона активностей
function getActivitiesElements() {
    if (!activitiesListVisible) {
        activitiesListVisible = document.getElementById("activities-list-visible");
    }
    if (!activitiesListHidden) {
        activitiesListHidden = document.getElementById("activities-list-hidden");
    }
    if (!activitiesAccordionBtn) {
        activitiesAccordionBtn = document.getElementById("activities-accordion-btn");
    }

    // Если элементы не найдены, пробуем через querySelector
    if (!activitiesListVisible) {
        activitiesListVisible = document.querySelector("#activities-list-visible");
    }
    if (!activitiesListHidden) {
        activitiesListHidden = document.querySelector("#activities-list-hidden");
    }
    if (!activitiesAccordionBtn) {
        activitiesAccordionBtn = document.querySelector("#activities-accordion-btn");
    }
}

// Применение фильтров и сортировки
function applyActivitiesFilters() {
    getActivitiesElements();

    const activitiesContainer = document.getElementById('activities-list-container');
    if (!activitiesListVisible || !activitiesListHidden || !activitiesContainer) return;

    // Очищаем списки
    activitiesListVisible.innerHTML = "";
    activitiesListHidden.innerHTML = "";

    if (allActivities.length === 0) {
        activitiesListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Нет активностей. Создайте первую активность!</div>';
        if (activitiesAccordionBtn) activitiesAccordionBtn.classList.add('hidden');
            return;
        }

    // Фильтруем по категории
    let filtered = allActivities;
    if (activitiesFilterState.category !== 'all') {
        filtered = allActivities.filter(activity => {
            const category = activity.category || 'general';
            return category === activitiesFilterState.category;
        });
    }

    // Сортируем
    filtered = [...filtered]; // Копируем массив
    switch (activitiesFilterState.sort) {
        case 'newest':
            filtered.sort((a, b) => {
                // Сначала пытаемся сортировать по created_at, если оно есть
                if (a.created_at && b.created_at) {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                        const diff = dateB.getTime() - dateA.getTime();
                        if (diff !== 0) return diff;
                    }
                } else if (a.created_at && !b.created_at) {
                    // Если только A имеет дату, A идет первым (новее)
                    return -1;
                } else if (!a.created_at && b.created_at) {
                    // Если только B имеет дату, B идет первым (новее)
                    return 1;
                }
                
                // Если даты нет или равны, сортируем по ID (больший ID = новее)
                const idA = a.id || 0;
                const idB = b.id || 0;
                return idB - idA; // Новые (с большим ID) сначала
            });
            break;
        case 'oldest':
            filtered.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
                const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
                return dateA - dateB; // Старые сначала
            });
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // По умолчанию: старые сверху (по возрастанию ID), новые внизу
            filtered.sort((a, b) => {
                const idA = a.id || 0;
                const idB = b.id || 0;
                return idA - idB; // Сортировка по возрастанию ID (старые сверху)
            });
            break;
    }

    // Проверяем, открыт ли аккордеон (из localStorage или класса контейнера)
    const isAccordionExpanded = localStorage.getItem('activitiesAccordionExpanded') === 'true' ||
                                 (activitiesContainer && activitiesContainer.classList.contains('activities-expanded'));

    // Отрисовываем отфильтрованные активности
    filtered.forEach((activity, index) => {
        const card = renderActivityCard(activity);
        if (isAccordionExpanded) {
            // Если аккордеон открыт - все активности в hidden контейнер
            activitiesListHidden.appendChild(card);
        } else {
            // Если аккордеон закрыт - первые 5 в visible, остальные в hidden
            if (index < 5) {
                activitiesListVisible.appendChild(card);
            } else {
                activitiesListHidden.appendChild(card);
            }
        }
    });

    // Показываем/скрываем кнопку аккордеона
    if (activitiesAccordionBtn) {
        if (filtered.length > 5) {
            activitiesAccordionBtn.classList.remove('hidden');
            updateActivitiesAccordionButton();
        } else {
            activitiesAccordionBtn.classList.add('hidden');
        }
    }

    // Загружаем активные таймеры
    loadActiveTimers();
    // Drag and drop отключен - используем только сортировку через фильтры
}

// Функции аккордеона для активностей
function toggleActivitiesAccordion() {
    getActivitiesElements();
    const activitiesContainer = document.getElementById('activities-list-container');
    if (!activitiesListHidden || !activitiesAccordionBtn || !activitiesContainer) {
        console.error("Activities accordion elements not found");
        return;
    }

    const isExpanded = activitiesContainer.classList.contains('activities-expanded');
    const icon = activitiesAccordionBtn.querySelector('.accordion-icon');
    const text = activitiesAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    if (!isExpanded) {
        // Открываем аккордеон - перемещаем все активности в hidden и делаем контейнер скроллируемым
        // Сначала перемещаем все активности из visible в hidden (включая первые 5)
        while (activitiesListVisible.firstChild) {
            activitiesListHidden.appendChild(activitiesListVisible.firstChild);
        }

        // Показываем hidden и применяем стили для скролла
        activitiesListHidden.classList.remove('hidden');
        activitiesContainer.classList.add('activities-expanded');

        // Динамически рассчитываем высоту для ровно 4 активностей
        requestAnimationFrame(() => {
            if (activitiesContainer && activitiesListHidden.children.length > 0) {
                // Получаем высоту первой активности
                const firstCard = activitiesListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 16; // space-y-4 = 1rem = 16px
                    // Высота для 4 активностей: 4 карточки + 3 промежутка
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    activitiesContainer.style.maxHeight = calculatedHeight + 'px';
                }
                // Убеждаемся, что скролл начинается с начала (первые 4 видны сразу)
                activitiesContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_activities');
        localStorage.setItem('activitiesAccordionExpanded', 'true');

        // Загружаем активные таймеры
        setTimeout(() => {
            loadActiveTimers();
        }, 100);
    } else {
        // Закрываем аккордеон - возвращаем первые 5 в visible, остальные в hidden
        const allCards = Array.from(activitiesListHidden.children);

        // Очищаем оба списка
        activitiesListVisible.innerHTML = "";
        activitiesListHidden.innerHTML = "";

        // Распределяем: первые 5 в visible, остальные в hidden
        allCards.forEach((card, index) => {
            if (index < 5) {
                activitiesListVisible.appendChild(card);
            } else {
                activitiesListHidden.appendChild(card);
            }
        });

        // Убираем класс expanded и скрываем hidden
        activitiesContainer.classList.remove('activities-expanded');
        activitiesContainer.style.maxHeight = ''; // Сбрасываем динамическую высоту
        activitiesListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_activities');
        localStorage.setItem('activitiesAccordionExpanded', 'false');

        // Загружаем активные таймеры
        setTimeout(() => {
            loadActiveTimers();
        }, 100);
    }
}

function updateActivitiesAccordionButton() {
    getActivitiesElements();
    const activitiesContainer = document.getElementById('activities-list-container');
    if (!activitiesListHidden || !activitiesAccordionBtn || !activitiesContainer) return;

    const isExpanded = localStorage.getItem('activitiesAccordionExpanded') === 'true';
    const icon = activitiesAccordionBtn.querySelector('.accordion-icon');
    const text = activitiesAccordionBtn.querySelector('.accordion-text');

    if (!icon || !text) return;

    if (isExpanded) {
        // Открываем аккордеон - перемещаем все активности в hidden и делаем контейнер скроллируемым
        // Сначала перемещаем все активности из visible в hidden (включая первые 5)
        while (activitiesListVisible.firstChild) {
            activitiesListHidden.appendChild(activitiesListVisible.firstChild);
        }

        // Показываем hidden и применяем стили для скролла
        activitiesListHidden.classList.remove('hidden');
        activitiesContainer.classList.add('activities-expanded');

        // Динамически рассчитываем высоту для ровно 4 активностей
        requestAnimationFrame(() => {
            if (activitiesContainer && activitiesListHidden.children.length > 0) {
                // Получаем высоту первой активности
                const firstCard = activitiesListHidden.children[0];
                if (firstCard) {
                    const cardHeight = firstCard.offsetHeight;
                    const gap = 16; // space-y-4 = 1rem = 16px
                    // Высота для 4 активностей: 4 карточки + 3 промежутка
                    const calculatedHeight = (cardHeight * 4) + (gap * 3);
                    activitiesContainer.style.maxHeight = calculatedHeight + 'px';
                }
                // Убеждаемся, что скролл начинается с начала (первые 4 видны сразу)
                activitiesContainer.scrollTop = 0;
            }
        });

        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_activities');

        // Загружаем активные таймеры
        setTimeout(() => {
            loadActiveTimers();
        }, 100);
    } else {
        // Закрываем аккордеон - возвращаем первые 5 в visible, остальные в hidden
        const allCards = Array.from(activitiesListHidden.children);

        // Очищаем оба списка
        activitiesListVisible.innerHTML = "";
        activitiesListHidden.innerHTML = "";

        // Распределяем: первые 5 в visible, остальные в hidden
        allCards.forEach((card, index) => {
            if (index < 5) {
                activitiesListVisible.appendChild(card);
            } else {
                activitiesListHidden.appendChild(card);
            }
        });

        // Убираем класс expanded и скрываем hidden
        activitiesContainer.classList.remove('activities-expanded');
        activitiesContainer.style.maxHeight = ''; // Сбрасываем динамическую высоту
        activitiesListHidden.classList.add('hidden');

        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_activities');
    }
}

// Инициализация фильтров и аккордеона для активностей
function initActivitiesFilters() {
    // Аккордеон будет инициализирован динамически в applyActivitiesFilters

    // Сортировка
    const sortSelect = document.getElementById('activities-sort');
    if (sortSelect) {

        sortSelect.value = activitiesFilterState.sort;
        sortSelect.addEventListener('change', (e) => {
            activitiesFilterState.sort = e.target.value;
            applyActivitiesFilters();
        });
    }

    // Фильтр по категории
    const categoryFilter = document.getElementById('activities-category-filter');
    if (categoryFilter) {
        categoryFilter.value = activitiesFilterState.category;
        categoryFilter.addEventListener('change', (e) => {
            activitiesFilterState.category = e.target.value;
            applyActivitiesFilters();
        });
    }

    // Кнопка сброса фильтров
    const resetBtn = document.getElementById('activities-reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activitiesFilterState.sort = 'newest';
            activitiesFilterState.category = 'all';

            if (sortSelect) sortSelect.value = 'newest';
            if (categoryFilter) categoryFilter.value = 'all';

            applyActivitiesFilters();
        });
    }
}

// Загружает активные таймеры с сервера и восстанавливает их состояние
async function loadActiveTimers() {
    try {
        const token = getAuthToken();
        if (!token) return;

        // Сохраняем текущие активные таймеры перед загрузкой с сервера
        // Это нужно, чтобы не потерять локальное состояние при смене языка
        const existingTimers = new Map();
        activeTimers.forEach((timerInfo, activityId) => {
            existingTimers.set(activityId, {
                logId: timerInfo.logId,
                startTime: timerInfo.startTime,
                intervalId: timerInfo.intervalId,
                activity: timerInfo.activity
            });
        });

        const activeTimersData = await apiGet('/timer/active');

        // Очищаем старые интервалы перед восстановлением
        activeTimers.forEach((timerInfo) => {
            if (timerInfo.intervalId) {
                clearInterval(timerInfo.intervalId);
            }
        });
        activeTimers.clear();

        // Восстанавливаем активные таймеры
        activeTimersData.forEach(timerData => {
            const activity = allActivities.find(a => a.id === timerData.activity_id);
            if (!activity) return;

            // Проверяем, есть ли уже активный таймер для этой активности
            const existingTimer = existingTimers.get(timerData.activity_id);

            let startTime;
            if (existingTimer && existingTimer.logId === timerData.log_id) {
                // Используем сохраненное локальное время, если это тот же таймер
                startTime = existingTimer.startTime;
            } else {
                // Парсим время начала с сервера (ISO формат в UTC)
                // Важно: сервер возвращает время в UTC, нужно правильно его парсить
                const serverStartTime = new Date(timerData.start_time);
                startTime = serverStartTime.getTime();

                // Проверяем, что время валидное
                if (isNaN(startTime)) {
                    console.error("Invalid start_time from server:", timerData.start_time);
                    return;
                }
            }

            const timerInfo = {
                logId: timerData.log_id,
                startTime: startTime,
                intervalId: null,
                activity: activity
            };

            activeTimers.set(timerData.activity_id, timerInfo);

            // Запускаем обновление отображения таймера с правильным startTime
            const intervalId = setInterval(() => {
                const timerInfo = activeTimers.get(timerData.activity_id);
                if (timerInfo) {
                    updateTimerDisplay(timerData.activity_id, timerInfo.startTime, activity);
                }
            }, 1000);
            timerInfo.intervalId = intervalId;
        });
    } catch (e) {
        console.error("Error loading active timers:", e);
    }
}

function renderActivityCard(activity) {
    const div = document.createElement("div");
    div.className = "activity-card p-4 rounded-xl bg-white/80 border border-blue-100 shadow-sm hover:shadow-lg flex items-center justify-between gap-3";
    div.setAttribute("data-activity-id", activity.id);

    // Создаем объект с названиями категорий
    const categoryNames = {
        "general": t('category_general'),
        "study": t('category_study'),
        "sport": t('category_sport'),
        "hobby": t('category_hobby'),
        "work": t('category_work'),
        "health": t('category_health')
    };

    // Добавляем пользовательские категории
    if (allCategories.custom) {
        allCategories.custom.forEach(customCat => {
            categoryNames[customCat.id] = customCat.name;
        });
    }

    const category = activity.category || "general";
    const categoryName = categoryNames[category] || category;

    // Определяем тип единицы измерения
    const unitType = activity.unit_type || 'time';

    const left = document.createElement("div");
    left.className = "flex-grow min-w-0";
    left.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
            <div class="text-base sm:text-lg font-semibold text-gray-800 truncate">${activity.name}</div>
            <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center justify-center whitespace-nowrap flex-shrink-0">${categoryName}</span>
        </div>
        <div class="text-xs sm:text-sm text-gray-500">${unitType === 'quantity' ? (activity.xp_per_unit || 1) + ' ' + t('xp_per_unit') : (activity.xp_per_hour || 60) + ' ' + t('xp_per_hour')}</div>
    `;

    // Timer button - показываем только для активностей типа "time"
    const timerBtn = document.createElement("button");
    timerBtn.draggable = false;

    // Для активностей типа "quantity" не показываем таймер
    if (unitType === 'quantity') {
        timerBtn.style.display = 'none';
    } else {
        const isActive = activeTimers.has(activity.id);

        if (isActive) {
            // Если таймер активен, отображаем его в активном состоянии
            const timerInfo = activeTimers.get(activity.id);
            const elapsedMs = Date.now() - timerInfo.startTime;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);
            const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
            const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
            const xpPerSecond = (activity.xp_per_hour || 60) / 3600;
            const earnedXP = Math.round(elapsedSeconds * xpPerSecond);

            timerBtn.className = "timer-btn px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-1 sm:gap-2 transition-all duration-300 flex-shrink-0";
            timerBtn.innerHTML = `<i class="fas fa-stop text-red-500 text-xs sm:text-sm"></i> <span id="timer-${activity.id}" class="whitespace-nowrap">${minutes}:${seconds} (+${earnedXP} XP)</span>`;
        } else {
            timerBtn.className = "timer-btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-1 sm:gap-2 flex-shrink-0";
            timerBtn.innerHTML = `<i class="fas fa-play text-green-500 text-xs sm:text-sm"></i> <span class="hidden sm:inline">${t('start')}</span>`;
        }

        timerBtn.dataset.activityId = activity.id;
        timerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleTimer(activity.id, e.currentTarget, activity);
        });
        timerBtn.addEventListener("mousedown", (e) => e.stopPropagation());
    }

    // Manual time/quantity button
    const manualTimeBtn = document.createElement("button");
    manualTimeBtn.className = "manual-time-btn p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shadow-sm hover:shadow-md flex-shrink-0";
    manualTimeBtn.innerHTML = '<i class="fas fa-clock text-sm sm:text-base"></i>';
    manualTimeBtn.draggable = false;
    // Устанавливаем подсказку в зависимости от типа активности
    manualTimeBtn.title = unitType === 'quantity' ? t('manual_quantity') : t('manual_time');
    manualTimeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Открываем модальное окно из блока активностей - показываем все активности
        openManualTimeModal(activity.id, false); // false = показывать все активности
    });
    manualTimeBtn.addEventListener("mousedown", (e) => e.stopPropagation());

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = t('edit');
    editBtn.draggable = false;
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditModal(activity);
    });
    editBtn.addEventListener("mousedown", (e) => e.stopPropagation());

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shadow-sm hover:shadow-md flex-shrink-0";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt text-sm sm:text-base"></i>';
    deleteBtn.title = t('delete');
    deleteBtn.draggable = false;
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteActivity(activity.id, div);
    });
    deleteBtn.addEventListener("mousedown", (e) => e.stopPropagation());

    // Контейнер для кнопок действий
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex items-center gap-1 sm:gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap";
    
    // Иконка перетаскивания удалена - используем только сортировку через фильтры
    div.appendChild(left);
    
    // Добавляем кнопки в контейнер
    if (unitType !== 'quantity') {
        buttonsContainer.appendChild(timerBtn);
    }
    buttonsContainer.appendChild(manualTimeBtn);
    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);
    
    div.appendChild(buttonsContainer);
    // Возвращаем элемент вместо добавления напрямую
    return div;
}

// ============= DRAG AND DROP FOR ACTIVITIES (SortableJS) =============
let activitiesSortable = null;

function initActivitiesSortable() {
    getActivitiesElements();
    
    // Проверяем наличие обоих списков
    if (!activitiesListVisible || !activitiesListHidden) {
        console.warn('Activities list elements not found');
        return;
    }

    if (typeof Sortable === 'undefined') {
        console.error('SortableJS library not loaded! Check if script is included in HTML.');
        return;
    }

    // Уничтожаем предыдущие экземпляры если есть
    if (activitiesSortable) {
        if (Array.isArray(activitiesSortable)) {
            activitiesSortable.forEach(sortable => sortable.destroy());
        } else {
            activitiesSortable.destroy();
        }
        activitiesSortable = null;
    }

    // Инициализируем SortableJS на обоих списках с общей группой для перетаскивания между ними
    try {
        const commonGroup = 'activities-group';
        
        // Инициализируем на видимом списке
        const sortableVisible = new Sortable(activitiesListVisible, {
            group: commonGroup,
            animation: 200,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            fallbackOnBody: true,
            swapThreshold: 0.65,
            forceFallback: true,
            filter: 'button, .timer-btn, .edit-btn, .delete-btn, .manual-time-btn, i.fa-play, i.fa-stop, i.fa-edit, i.fa-trash, i.fa-clock',
            preventOnFilter: true,
            draggable: '.activity-card',
            onEnd: function(evt) {
                if (evt.oldIndex !== evt.newIndex && evt.newIndex !== undefined) {
                    updateActivitiesOrder();
                }
            }
        });
        
        // Инициализируем на скрытом списке
        const sortableHidden = new Sortable(activitiesListHidden, {
            group: commonGroup,
            animation: 200,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            fallbackOnBody: true,
            swapThreshold: 0.65,
            forceFallback: true,
            filter: 'button, .timer-btn, .edit-btn, .delete-btn, .manual-time-btn, i.fa-play, i.fa-stop, i.fa-edit, i.fa-trash, i.fa-clock',
            preventOnFilter: true,
            draggable: '.activity-card',
            onEnd: function(evt) {
                if (evt.oldIndex !== evt.newIndex && evt.newIndex !== undefined) {
                    updateActivitiesOrder();
                }
            }
        });
        
        // Сохраняем оба экземпляра
        activitiesSortable = [sortableVisible, sortableHidden];
        console.log('SortableJS initialized successfully on both lists');
    } catch (e) {
        console.error('Error initializing SortableJS:', e);
    }
}

async function updateActivitiesOrder() {
    // Получаем все карточки из обоих списков (visible и hidden)
    getActivitiesElements();
    const allCards = [];
    if (activitiesListVisible) {
        allCards.push(...Array.from(activitiesListVisible.querySelectorAll('.activity-card')));
    }
    if (activitiesListHidden) {
        allCards.push(...Array.from(activitiesListHidden.querySelectorAll('.activity-card')));
    }
    const activityIds = allCards.map(card => parseInt(card.getAttribute('data-activity-id')));

    try {
        const res = await fetch(`${API_BASE}/activities/reorder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ activity_ids: activityIds })
        });

        if (!res.ok) {
            console.error("Failed to update activities order");
            // Восстанавливаем порядок из сервера при ошибке
            loadActivities();
        }
    } catch (e) {
        console.error("Error updating activities order:", e);
        // Восстанавливаем порядок из сервера при ошибке
        loadActivities();
    }
}

// Функция createActivity определена в app_activities.js

function openEditModal(activity) {
    // Обновляем dropdown категорий перед открытием модального окна
    updateCategoryDropdown('edit-activity-category');

    document.getElementById("edit-activity-id").value = activity.id;
    document.getElementById("edit-activity-name").value = activity.name;

    // Устанавливаем тип единицы измерения
    const unitType = activity.unit_type || 'time';
    const unitTypeEl = document.getElementById("edit-activity-unit-type");
    if (unitTypeEl) {
        unitTypeEl.value = unitType;
        updateEditActivityXPInputs(); // Обновляем поля XP
    }

    // Устанавливаем значения XP в зависимости от типа
    if (unitType === 'quantity') {
        const xpPerUnitEl = document.getElementById("edit-xp-per-unit");
        if (xpPerUnitEl) {
            xpPerUnitEl.value = activity.xp_per_unit || 1;
        }
    } else {
        const xpPerHourEl = document.getElementById("edit-xp-per-hour");
        if (xpPerHourEl) {
            xpPerHourEl.value = activity.xp_per_hour || 60;
        }
    }

    const categoryEl = document.getElementById("edit-activity-category");
    const categoryText = document.getElementById("edit-activity-category-text");
    if (categoryEl && categoryText) {
        // Устанавливаем значение после небольшой задержки, чтобы dropdown успел обновиться
        setTimeout(() => {
            const categoryValue = activity.category || "general";
            categoryEl.value = categoryValue;
            // Находим название категории
            const allCats = [...(allCategories.standard || []), ...(allCategories.custom || [])];
            const selectedCat = allCats.find(c => c.id === categoryValue);
            if (selectedCat) {
                categoryText.textContent = selectedCat.name;
            } else {
                categoryText.textContent = "Общее";
            }
        }, 100);
    }

    // Применяем переводы
    applyTranslations();

    // Обновляем поля XP при открытии
    updateEditActivityXPInputs();

    document.getElementById("edit-activity-modal").classList.remove("hidden");
}

// Функция для переключения полей XP в модальном окне редактирования
function updateEditActivityXPInputs() {
    const unitTypeEl = document.getElementById("edit-activity-unit-type");
    const xpTimeContainer = document.getElementById("edit-activity-xp-time");
    const xpQuantityContainer = document.getElementById("edit-activity-xp-quantity");
    const xpLabel = document.getElementById("edit-activity-xp-label");
    const xpPerHourInput = document.getElementById("edit-xp-per-hour");
    const xpPerUnitInput = document.getElementById("edit-xp-per-unit");

    if (!unitTypeEl) return;

    const unitType = unitTypeEl.value;
    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (unitType === "quantity") {
        // Показываем поле для количества
        xpTimeContainer.classList.add("hidden");
        xpQuantityContainer.classList.remove("hidden");
        
        // Обновляем label
        if (xpLabel) {
            xpLabel.textContent = t('unit_quantity') || 'Количество (штуки)';
            xpLabel.setAttribute('data-i18n', 'unit_quantity');
        }
        
        // Обновляем placeholder для поля количества
        if (xpPerUnitInput) {
            xpPerUnitInput.placeholder = t('xp_per_unit') || 'XP/штука';
            xpPerUnitInput.setAttribute('data-i18n-placeholder', 'xp_per_unit');
        }
    } else {
        // Показываем поле для времени
        xpTimeContainer.classList.remove("hidden");
        xpQuantityContainer.classList.add("hidden");
        
        // Обновляем label
        if (xpLabel) {
            xpLabel.textContent = t('unit_time') || 'Время (минуты)';
            xpLabel.setAttribute('data-i18n', 'unit_time');
        }
        
        // Обновляем placeholder для поля времени
        if (xpPerHourInput) {
            xpPerHourInput.placeholder = t('xp_per_hour') || 'XP/час';
            xpPerHourInput.setAttribute('data-i18n-placeholder', 'xp_per_hour');
        }
    }
}

function closeEditModal() {
    document.getElementById("edit-activity-modal").classList.add("hidden");
    document.getElementById("edit-activity-form").reset();
}

// Функция updateActivity определена в app_activities.js

// Функция deleteActivity определена в app_activities.js

function showActivityMessage(text, type) {
    const msgEl = document.getElementById("activity-message");
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.remove("hidden", "text-red-500", "text-green-600");
    if (type === "error") msgEl.classList.add("text-red-500");
    else if (type === "success") msgEl.classList.add("text-green-600");
    setTimeout(() => msgEl.classList.add("hidden"), 4000);
}


// ============= TIMER FUNCTIONS =============
// Функции toggleTimer, startTimer, stopTimer, updateTimerDisplay определены в app_activities.js


// ============= MANUAL TIME/QUANTITY =============
async function openManualTimeModal(activityId, filterByTime = true) {
    // Сначала открываем модальное окно, чтобы элементы были доступны
    const modal = document.getElementById("manual-time-modal");
    if (modal) {
        modal.classList.remove("hidden");
    }
    
    const select = document.getElementById("manual-activity-select");
    if (!select) {
        console.error("manual-activity-select not found");
        return;
    }
    
    // Если активности не загружены, загружаем их
    if (!allActivities || allActivities.length === 0) {
        console.log("Activities not loaded, loading...");
        try {
            await loadActivities();
            // Дополнительная проверка после загрузки
            if (!allActivities || allActivities.length === 0) {
                console.warn("Activities still empty after load, retrying...");
                await new Promise(resolve => setTimeout(resolve, 200));
                await loadActivities();
            }
        } catch (e) {
            console.error("Error loading activities:", e);
        }
    }
    
    console.log("All activities for dropdown:", allActivities?.length || 0, allActivities);
    
    // Сохраняем опцию "Выберите активность" из HTML, если она есть, иначе создаем новую
    const existingDefaultOption = select.querySelector('option[value=""]');
    if (existingDefaultOption) {
        // Очищаем все опции кроме дефолтной
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        // Обновляем текст дефолтной опции
        existingDefaultOption.textContent = t('select_activity_label');
    } else {
        // Если дефолтной опции нет, создаем её
        select.innerHTML = `<option value="">${t('select_activity_label')}</option>`;
    }
    
    if (allActivities && allActivities.length > 0) {
        let activitiesToShow;
        
        if (filterByTime) {
            // Фильтруем активности: показываем только те, у которых тип единицы измерения - "time" (время)
            // Это для футера "Ручной ввод времени"
            activitiesToShow = allActivities.filter(activity => {
                if (!activity || !activity.name) {
                    return false;
                }
                const unitType = activity.unit_type || 'time';
                // Показываем только активности с типом "time" (время), исключаем "quantity" (количество)
                return unitType === 'time';
            });
            
            console.log(`Adding ${activitiesToShow.length} time-based activities to dropdown (filtered from ${allActivities.length} total)`);
        } else {
            // Показываем все активности - это для блока активностей
            activitiesToShow = allActivities.filter(activity => {
                return activity && activity.name;
            });
            
            console.log(`Adding ${activitiesToShow.length} all activities to dropdown (from ${allActivities.length} total)`);
        }
        
        if (activitiesToShow.length === 0) {
            // Если нет активностей, показываем сообщение
            const option = document.createElement("option");
            option.value = "";
            option.textContent = filterByTime 
                ? "Нет активностей с типом 'Время'. Создайте активность с типом 'Время (минуты)'."
                : "Нет активностей. Создайте активность сначала.";
            option.disabled = true;
            select.appendChild(option);
        } else {
            activitiesToShow.forEach(activity => {
                const option = document.createElement("option");
                option.value = activity.id;
                const unitType = activity.unit_type || 'time';
                if (unitType === 'quantity') {
                    option.textContent = `${activity.name} (${activity.xp_per_unit || 1} ${t('xp_per_unit')})`;
                } else {
                    option.textContent = `${activity.name} (${activity.xp_per_hour || 60} ${t('xp_per_hour')})`;
                }
                select.appendChild(option);
            });
        }
    } else {
        console.warn("No activities found");
        // Если активностей нет, показываем сообщение
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Нет активностей. Создайте активность сначала.";
        option.disabled = true;
        select.appendChild(option);
    }
    
    // Устанавливаем выбранную активность, если она передана
    if (activityId) {
        // Преобразуем activityId в строку для сравнения с value опций
        const activityIdStr = String(activityId);
        
        // Используем requestAnimationFrame для гарантии обновления UI после добавления опций
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Проверяем, что опция с таким value существует
                const optionExists = Array.from(select.options).some(opt => opt.value === activityIdStr);
                
                if (optionExists) {
                    // Находим опцию и устанавливаем её как выбранную
                    const selectedOption = Array.from(select.options).find(opt => opt.value === activityIdStr);
                    if (selectedOption) {
                        // Снимаем выделение со всех опций
                        Array.from(select.options).forEach(opt => opt.selected = false);
                        
                        // Устанавливаем выбранную опцию
                        selectedOption.selected = true;
                        select.selectedIndex = Array.from(select.options).indexOf(selectedOption);
                        select.value = activityIdStr;
                        
                        // Триггерим события для обновления UI
                        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                        select.dispatchEvent(changeEvent);
                        
                        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                        select.dispatchEvent(inputEvent);
                        
                        // Принудительно обновляем визуальное отображение через небольшой таймаут
                        setTimeout(() => {
                            // Проверяем, что значение действительно установлено
                            if (select.value !== activityIdStr) {
                                select.value = activityIdStr;
                                selectedOption.selected = true;
                                select.selectedIndex = Array.from(select.options).indexOf(selectedOption);
                            }
                        }, 10);
                        
                        // Обновляем интерфейс в зависимости от типа активности
                        updateManualModalUI(activityId);
                    }
                } else {
                    console.warn("[openManualTimeModal] Option with value", activityIdStr, "not found in select! Retrying...");
                    // Если опция не найдена, пробуем еще раз через небольшую задержку
                    setTimeout(() => {
                        const optionExistsRetry = Array.from(select.options).some(opt => opt.value === activityIdStr);
                        if (optionExistsRetry) {
                            const selectedOption = Array.from(select.options).find(opt => opt.value === activityIdStr);
                            if (selectedOption) {
                                Array.from(select.options).forEach(opt => opt.selected = false);
                                selectedOption.selected = true;
                                select.selectedIndex = Array.from(select.options).indexOf(selectedOption);
                                select.value = activityIdStr;
                                
                                const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                                select.dispatchEvent(changeEvent);
                                const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                                select.dispatchEvent(inputEvent);
                                
                                setTimeout(() => {
                                    if (select.value !== activityIdStr) {
                                        select.value = activityIdStr;
                                        selectedOption.selected = true;
                                        select.selectedIndex = Array.from(select.options).indexOf(selectedOption);
                                    }
                                }, 10);
                                
                                // Обновляем интерфейс в зависимости от типа активности
                                updateManualModalUI(activityId);
                            }
                        } else {
                            console.error("[openManualTimeModal] Option still not found after retry!");
                        }
                    }, 150);
                }
            });
        });
    } else {
        // Если активность не передана, устанавливаем заголовок в зависимости от источника
        const titleEl = document.getElementById("manual-modal-title");
        if (filterByTime) {
            // Из футера - "Ручной ввод времени"
            titleEl.textContent = `⏱️ ${t('manual_time')}`;
            titleEl.setAttribute('data-i18n', 'manual_time');
            // Показываем поле времени, скрываем количество
            const timeContainer = document.getElementById("manual-time-input-container");
            const quantityContainer = document.getElementById("manual-quantity-input-container");
            if (timeContainer) timeContainer.classList.remove('hidden');
            if (quantityContainer) quantityContainer.classList.add('hidden');
            // Обновляем плейсхолдер для времени
            const timeInput = document.getElementById("manual-minutes");
            if (timeInput) {
                timeInput.placeholder = "Введите к-во времени";
                timeInput.setAttribute('required', 'required');
            }
            const quantityInput = document.getElementById("manual-quantity");
            if (quantityInput) quantityInput.removeAttribute('required');
        } else {
            // Из блока активностей - заголовок будет установлен при выборе активности
            titleEl.textContent = `📊 ${t('manual_quantity')}`;
            titleEl.setAttribute('data-i18n', 'manual_quantity');
        }
        applyTranslations();
    }

    const minutesInput = document.getElementById("manual-minutes");
    const quantityInput = document.getElementById("manual-quantity");
    const previewEl = document.getElementById("manual-time-preview");
    
    if (minutesInput) minutesInput.value = "";
    if (quantityInput) quantityInput.value = "";
    if (previewEl) previewEl.classList.add("hidden");
    
    // Прикрепляем обработчик формы, если он еще не прикреплен
    const manualForm = document.getElementById("manual-time-form");
    if (manualForm && !manualForm.hasAttribute('data-submit-handler-attached')) {
        manualForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Вызываем функцию из app_activities.js если доступна, иначе из app.js
            if (typeof window.addManualTime === 'function') {
                await window.addManualTime();
            } else if (typeof addManualTime === 'function') {
                await addManualTime();
            } else {
                console.error("addManualTime function not found!");
                alert("Ошибка: функция добавления времени не найдена");
            }
            return false;
        }, true); // Используем capture phase для надежности
        manualForm.setAttribute('data-submit-handler-attached', 'true');
    }
}

function updateManualModalUI(activityId) {
    const activity = allActivities.find(a => a.id == activityId || a.id == Number(activityId));
    const unitType = activity ? (activity.unit_type || 'time') : 'time';
    const titleEl = document.getElementById("manual-modal-title");
    const timeContainer = document.getElementById("manual-time-input-container");
    const quantityContainer = document.getElementById("manual-quantity-input-container");
    const timeInput = document.getElementById("manual-minutes");
    const quantityInput = document.getElementById("manual-quantity");
    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    if (unitType === 'quantity') {
        if (titleEl) {
            titleEl.textContent = `📊 ${t('manual_quantity')}`;
            titleEl.setAttribute('data-i18n', 'manual_quantity');
        }
        if (timeContainer) timeContainer.classList.add('hidden');
        if (quantityContainer) quantityContainer.classList.remove('hidden');
        if (timeInput) timeInput.removeAttribute('required');
        if (quantityInput) {
            quantityInput.setAttribute('required', 'required');
            // Обновляем плейсхолдер для количества
            quantityInput.placeholder = t('quantity_placeholder') || 'Введите к-во';
            quantityInput.setAttribute('data-i18n-placeholder', 'quantity_placeholder');
        }
    } else {
        if (titleEl) {
            titleEl.textContent = `⏱️ ${t('manual_time')}`;
            titleEl.setAttribute('data-i18n', 'manual_time');
        }
        if (timeContainer) timeContainer.classList.remove('hidden');
        if (quantityContainer) quantityContainer.classList.add('hidden');
        if (quantityInput) quantityInput.removeAttribute('required');
        if (timeInput) {
            timeInput.setAttribute('required', 'required');
            // Обновляем плейсхолдер для времени
            timeInput.placeholder = t('minutes_placeholder') || 'Минут';
            timeInput.setAttribute('data-i18n-placeholder', 'minutes_placeholder');
        }
    }
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    } else if (typeof applyTranslations === 'function') {
        applyTranslations();
    }
}

// Экспортируем функцию в window
if (typeof window !== 'undefined') {
    window.updateManualModalUI = updateManualModalUI;
}

function closeManualTimeModal() {
    document.getElementById("manual-time-modal").classList.add("hidden");
}

function updateManualPreview(activityId) {
    console.log("[updateManualPreview] Called with activityId:", activityId);
    // Получаем allActivities из window или локальной переменной
    const activities = typeof window !== 'undefined' && window.allActivities 
        ? window.allActivities 
        : (typeof allActivities !== 'undefined' ? allActivities : []);
    console.log("[updateManualPreview] Available activities:", activities?.length || 0);
    const activity = activities.find(a => a.id == activityId || a.id == Number(activityId));
    if (!activity) {
        console.warn("[updateManualPreview] Activity not found:", activityId, "Available IDs:", activities.map(a => a.id));
        return;
    }

    const unitType = activity.unit_type || 'time';
    const preview = document.getElementById("manual-time-preview");
    
    if (!preview) {
        console.error("[updateManualPreview] Preview element not found!");
        return;
    }

    console.log("[updateManualPreview] Activity found:", activity.name, "Unit type:", unitType);

    if (unitType === 'quantity') {
        const quantity = document.getElementById("manual-quantity").value;
        console.log("[updateManualPreview] Quantity value:", quantity);
        if (activityId && quantity) {
            const xp = Math.round(quantity * (activity.xp_per_unit || 1));
            preview.textContent = `+${xp} XP`;
            preview.classList.remove("hidden");
            console.log("[updateManualPreview] Showing preview:", `+${xp} XP`);
        } else {
            preview.classList.add("hidden");
            console.log("[updateManualPreview] Hiding preview (no quantity)");
        }
    } else {
        const minutes = document.getElementById("manual-minutes").value;
        console.log("[updateManualPreview] Minutes value:", minutes);
        if (activityId && minutes) {
            const xp = Math.round((minutes / 60) * activity.xp_per_hour);
            preview.textContent = `+${xp} XP`;
            preview.classList.remove("hidden");
            console.log("[updateManualPreview] Showing preview:", `+${xp} XP`);
        } else {
            preview.classList.add("hidden");
            console.log("[updateManualPreview] Hiding preview (no minutes)");
        }
    }
}

async function addManualTime() {
    const activityId = document.getElementById("manual-activity-select").value;
    const activity = allActivities.find(a => a.id == activityId);

    if (!activityId || !activity) {
        alert(t('select_activity_label'));
        return;
    }

    const unitType = activity.unit_type || 'time';
    let requestData = { activity_id: Number(activityId) };

    if (unitType === 'quantity') {
        const quantity = Number(document.getElementById("manual-quantity").value);
        if (!quantity || quantity < 1) {
            alert(t('enter_quantity'));
            return;
        }
        requestData.quantity = quantity;
    } else {
        const minutes = Number(document.getElementById("manual-minutes").value);
        if (!minutes || minutes < 1) {
            alert(t('enter_minutes'));
            return;
        }
        requestData.minutes = minutes;
    }

    try {
        const data = await apiPost('/timer/manual', requestData);
        closeManualTimeModal();
        
        // Обновляем все данные после добавления времени/количества
        await loadWallet();
        await loadTodayStats();
        await loadHistory();
        await loadGoals(); // Обновляем цели для проверки достижений
        await loadStreak();
        await loadCategoryStats();
        
        // Обновляем календарь текущего периода
        const currentPeriod = typeof currentCalendarPeriod !== 'undefined' ? currentCalendarPeriod : 'week';
        await loadCalendar(currentPeriod);
        
        if (unitType === 'quantity') {
            const quantity = Number(document.getElementById("manual-quantity").value);
            showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${quantity} ${t('units')}!`, "success");
        } else {
            const minutes = Number(document.getElementById("manual-minutes").value);
            showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${minutes} ${t('minutes_short')}!`, "success");
        }
    } catch (e) {
        console.error("Error adding manual time:", e);
        const errorMessage = e.message || e.detail || t('network_error');
        alert(errorMessage);
    }
}


// ============= REWARDS =============

// Preset награды с брендами
const REWARD_PRESETS = {
    mcdonalds: { name: "McDonald's", xp_cost: 100, icon: "M", iconType: "text", bgColor: "bg-red-500", textColor: "text-yellow-400", borderColor: "border-red-200" },
    youtube: { name: "YouTube 30 мин", xp_cost: 30, icon: "fab fa-youtube", iconType: "icon", bgColor: "bg-red-600", textColor: "text-white", borderColor: "border-red-200" },
    gaming: { name: "Игры 1 час", xp_cost: 60, icon: "fas fa-gamepad", iconType: "icon", bgColor: "bg-gradient-to-br from-purple-500 to-pink-500", textColor: "text-white", borderColor: "border-purple-200" },
    netflix: { name: "Netflix 1 серия", xp_cost: 50, icon: "N", iconType: "text", bgColor: "bg-black", textColor: "text-red-600", borderColor: "border-gray-300" },
    coffee: { name: "Кофе", xp_cost: 40, icon: "fas fa-coffee", iconType: "icon", bgColor: "bg-green-700", textColor: "text-white", borderColor: "border-green-200" },
    custom: { name: "", xp_cost: 10, icon: "fas fa-gift", iconType: "icon", bgColor: "bg-gradient-to-br from-amber-400 to-orange-500", textColor: "text-white", borderColor: "border-amber-200" }
};

function selectPreset(presetKey) {
    const preset = REWARD_PRESETS[presetKey];
    if (preset) {
        document.getElementById("reward-name").value = preset.name;
        document.getElementById("reward-cost").value = preset.xp_cost;
        document.getElementById("reward-name").focus();
    }
}

// Определяем бренд по названию награды
function detectBrand(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("mcdonald") || lowerName.includes("макдональдс") || lowerName.includes("мак")) {
        return { icon: "M", iconType: "text", bgColor: "bg-red-500", textColor: "text-yellow-400", borderColor: "border-red-200" };
    }
    if (lowerName.includes("youtube") || lowerName.includes("ютуб")) {
        return { icon: "fab fa-youtube", iconType: "icon", bgColor: "bg-red-600", textColor: "text-white", borderColor: "border-red-200" };
    }
    if (lowerName.includes("игр") || lowerName.includes("game") || lowerName.includes("gaming")) {
        return { icon: "fas fa-gamepad", iconType: "icon", bgColor: "bg-gradient-to-br from-purple-500 to-pink-500", textColor: "text-white", borderColor: "border-purple-200" };
    }
    if (lowerName.includes("netflix") || lowerName.includes("нетфликс")) {
        return { icon: "N", iconType: "text", bgColor: "bg-black", textColor: "text-red-600", borderColor: "border-gray-300" };
    }
    if (lowerName.includes("кофе") || lowerName.includes("coffee") || lowerName.includes("starbucks") || lowerName.includes("старбакс")) {
        return { icon: "fas fa-coffee", iconType: "icon", bgColor: "bg-green-700", textColor: "text-white", borderColor: "border-green-200" };
    }
    if (lowerName.includes("instagram") || lowerName.includes("инстаграм")) {
        return { icon: "fab fa-instagram", iconType: "icon", bgColor: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400", textColor: "text-white", borderColor: "border-pink-200" };
    }
    if (lowerName.includes("tiktok") || lowerName.includes("тикток")) {
        return { icon: "fab fa-tiktok", iconType: "icon", bgColor: "bg-black", textColor: "text-white", borderColor: "border-gray-300" };
    }
    if (lowerName.includes("spotify") || lowerName.includes("спотифай") || lowerName.includes("музык")) {
        return { icon: "fab fa-spotify", iconType: "icon", bgColor: "bg-green-500", textColor: "text-white", borderColor: "border-green-200" };
    }
    if (lowerName.includes("пицц") || lowerName.includes("pizza")) {
        return { icon: "fas fa-pizza-slice", iconType: "icon", bgColor: "bg-orange-500", textColor: "text-white", borderColor: "border-orange-200" };
    }
    if (lowerName.includes("кино") || lowerName.includes("фильм") || lowerName.includes("movie")) {
        return { icon: "fas fa-film", iconType: "icon", bgColor: "bg-indigo-600", textColor: "text-white", borderColor: "border-indigo-200" };
    }
    if (lowerName.includes("сон") || lowerName.includes("sleep") || lowerName.includes("отдых")) {
        return { icon: "fas fa-bed", iconType: "icon", bgColor: "bg-blue-500", textColor: "text-white", borderColor: "border-blue-200" };
    }
    // Дефолт
    return { icon: "fas fa-gift", iconType: "icon", bgColor: "bg-gradient-to-br from-amber-400 to-orange-500", textColor: "text-white", borderColor: "border-amber-200" };
}

// Функции loadRewards, createReward, updateReward, deleteReward, spendReward определены в app_rewards.js

function renderRewardCard(reward) {
    const brand = detectBrand(reward.name);

    const div = document.createElement("div");
    div.className = `reward-card group relative p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border-2 ${brand.borderColor} hover:shadow-md hover:border-opacity-80 transition-all duration-200 w-full max-w-full overflow-hidden`;
    div.setAttribute('data-reward-id', reward.id); // Добавляем ID для поиска

    // Основная структура: всё в одной строке, кнопки по центру по высоте
    const mainSection = document.createElement("div");
    mainSection.className = "flex items-center justify-between gap-4";

    // Левая часть: иконка и название со стоимостью
    const leftSection = document.createElement("div");
    leftSection.className = "flex items-center gap-3 flex-1 min-w-0";

    // Иконка бренда
    const icon = document.createElement("div");
    icon.className = `w-12 h-12 ${brand.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200`;

    if (brand.iconType === "text") {
        icon.innerHTML = `<span class="${brand.textColor} font-black text-lg">${brand.icon}</span>`;
    } else {
        icon.innerHTML = `<i class="${brand.icon} ${brand.textColor} text-lg"></i>`;
    }

    // Название и стоимость
    const nameDiv = document.createElement("div");
    nameDiv.className = "flex-1 min-w-0";
    nameDiv.innerHTML = `
        <div class="font-bold text-gray-800 text-base leading-tight break-words mb-1">${reward.name}</div>
        <div class="flex items-center gap-1.5">
            <div class="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <i class="fas fa-coins text-white text-[8px]"></i>
            </div>
            <span class="text-amber-700 text-xs font-bold">${reward.xp_cost} XP</span>
        </div>
    `;

    leftSection.appendChild(icon);
    leftSection.appendChild(nameDiv);

    // Правая часть: кнопки (выровнены по центру по высоте)
    const btnContainer = document.createElement("div");
    btnContainer.className = "flex items-center gap-2 flex-shrink-0";

    // Кнопки редактирования и удаления (только для своих наград, всегда видны)
    if (reward.user_id) {
        const editBtn = document.createElement("button");
        editBtn.className = "w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 flex-shrink-0";
        editBtn.innerHTML = '<i class="fas fa-pen text-xs"></i>';
        editBtn.title = "Редактировать";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openEditRewardModal(reward);
        });
        btnContainer.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "w-9 h-9 rounded-lg bg-gradient-to-br from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 flex-shrink-0";
        deleteBtn.innerHTML = '<i class="fas fa-trash text-xs"></i>';
        deleteBtn.title = "Удалить";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteReward(reward.id, div);
        });
        btnContainer.appendChild(deleteBtn);
    }

    // Кнопка покупки
    const spendBtn = document.createElement("button");
    spendBtn.className = "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 active:scale-95 flex-shrink-0 whitespace-nowrap h-9";
    spendBtn.innerHTML = `<i class="fas fa-shopping-bag text-xs"></i><span class="hidden sm:inline">${t('buy')}</span>`;
    spendBtn.addEventListener("click", () => spendReward(reward.id));
    btnContainer.appendChild(spendBtn);

    mainSection.appendChild(leftSection);
    mainSection.appendChild(btnContainer);

    div.appendChild(mainSection);
    return div;
}

// Функция createReward определена в app_rewards.js

function openEditRewardModal(reward) {
    document.getElementById("edit-reward-id").value = reward.id;
    document.getElementById("edit-reward-name").value = reward.name;
    document.getElementById("edit-reward-cost").value = reward.xp_cost;
    document.getElementById("edit-reward-modal").classList.remove("hidden");
    // Применяем переводы для всех элементов в модальном окне
    applyTranslations();
}

function closeEditRewardModal() {
    document.getElementById("edit-reward-modal").classList.add("hidden");
}

// Функция updateReward определена в app_rewards.js

// Функция deleteReward определена в app_rewards.js

// Функция spendReward определена в app_rewards.js

function showRewardMessage(text, type) {
    if (!rewardMessage) return;
    rewardMessage.textContent = text;
    rewardMessage.classList.remove("hidden", "text-red-500", "text-green-600", "text-gray-500");
    if (type === "error") {
        rewardMessage.classList.add("text-red-500");
    } else if (type === "success") {
        rewardMessage.classList.add("text-green-600");
    }
    setTimeout(() => rewardMessage.classList.add("hidden"), 4000);
}

// ============= GLOBAL FUNCTIONS FOR ONCLICK =============
// Делаем функции глобальными для использования в onclick
window.toggleRewardsAccordion = toggleRewardsAccordion;
window.toggleHistoryAccordion = toggleHistoryAccordion;
window.showForgotPassword = showForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.requestResetCode = requestResetCode;
window.resetPassword = resetPassword;
window.openManualTimeModal = openManualTimeModal;
window.closeManualTimeModal = closeManualTimeModal;
window.showAdminPanel = showAdminPanel;
window.updateManualPreview = updateManualPreview;
window.closeChildStats = closeChildStats;

// ============= INITIALIZATION =============
window.addEventListener("DOMContentLoaded", () => {
    try {
        // Инициализируем DOM элементы
        initDOMElements();

        // Убеждаемся, что элементы найдены
        if (!authSection || !appSection) {
            console.error("Critical: authSection or appSection not found!");
            // Показываем auth-section по умолчанию, если элементы не найдены
            const authEl = document.getElementById("auth-section");
            const appEl = document.getElementById("app-section");
            if (authEl) authEl.classList.remove("hidden");
            if (appEl) appEl.classList.add("hidden");
            return;
        }

        // Сразу проверяем токен и скрываем auth-section если он есть
        const token = getAuthToken();
        if (token) {
            authSection.classList.add("hidden");
            appSection.classList.remove("hidden");
        } else {
            // Если токена нет, показываем auth-section
            authSection.classList.remove("hidden");
            appSection.classList.add("hidden");
        }
        // Check auth on load
        checkAuth();
    } catch (error) {
        console.error("Error during page initialization:", error);
        // В случае ошибки показываем auth-section
        const authEl = document.getElementById("auth-section");
        const appEl = document.getElementById("app-section");
        if (authEl) authEl.classList.remove("hidden");
        if (appEl) appEl.classList.add("hidden");
    }

    // Инициализируем обработчики форм авторизации (если компонент уже загружен)
    initAuthForms();

    // Функция для прикрепления обработчиков форм через делегирование событий
    function attachFormHandlers() {
        const appSection = document.getElementById("app-section");
        if (!appSection) {
            console.warn("[attachFormHandlers] app-section not found, will retry form handler attachment");
            return false;
        }
        
        // Проверяем, не прикреплены ли уже обработчики
        if (appSection.hasAttribute('data-form-handlers-attached')) {
            console.log("[attachFormHandlers] Form handlers already attached, skipping");
            return true;
        }
        
        console.log("[attachFormHandlers] Attaching form handlers to app-section");
        
        // Обработчик для формы активности через делегирование
        appSection.addEventListener("submit", async function(e) {
            console.log("[Form Handler] Submit event caught, target:", e.target && e.target.id);
            if (e.target && e.target.id === "new-activity-form") {
                console.log("[Form Handler] Activity form submit intercepted");
            e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                try {
                    console.log("[Form Handler] Checking createActivity function...");
                    if (typeof createActivity === 'function') {
                        console.log("[Form Handler] Calling createActivity()");
                        await createActivity();
                    } else if (typeof window.createActivity === 'function') {
                        console.log("[Form Handler] Calling window.createActivity()");
                        await window.createActivity();
                    } else {
                        console.error("[Form Handler] createActivity function not found");
                        alert("Ошибка: функция createActivity не найдена. Проверьте консоль.");
                    }
                } catch (error) {
                    console.error("[Form Handler] Error creating activity:", error);
                    alert("Ошибка при создании активности: " + error.message);
                }
                return false;
            }
        }, true); // Используем capture phase для надежности

        // Обработчик для формы награды через делегирование
        appSection.addEventListener("submit", async function(e) {
            console.log("[Form Handler] Submit event caught, target:", e.target && e.target.id);
            if (e.target && e.target.id === "new-reward-form") {
                console.log("[Form Handler] Reward form submit intercepted");
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                try {
                    console.log("[Form Handler] Checking createReward function...");
                    if (typeof createReward === 'function') {
                        console.log("[Form Handler] Calling createReward()");
                        await createReward();
                    } else if (typeof window.createReward === 'function') {
                        console.log("[Form Handler] Calling window.createReward()");
                        await window.createReward();
                    } else {
                        console.error("[Form Handler] createReward function not found");
                        alert("Ошибка: функция createReward не найдена. Проверьте консоль.");
                    }
                } catch (error) {
                    console.error("[Form Handler] Error creating reward:", error);
                    alert("Ошибка при создании награды: " + error.message);
                }
                return false;
            }
        }, true); // Используем capture phase для надежности
        
        appSection.setAttribute('data-form-handlers-attached', 'true');
        console.log("[Form Handler] Form handlers attached via event delegation on app-section");
        
        // Проверяем наличие форм
        const activityForm = document.getElementById("new-activity-form");
        const rewardForm = document.getElementById("new-reward-form");
        console.log("[Form Handler] Activity form found:", !!activityForm);
        console.log("[Form Handler] Reward form found:", !!rewardForm);
        
        return true;
    }
    
    // НЕ прикрепляем обработчики сразу - они будут прикреплены после загрузки компонентов
    // через loadAppComponents() -> initFormHandlers()
    
    // Прикрепляем обработчики напрямую к кнопкам (более надежный способ)
    function attachDirectFormHandlers() {
        console.log("[attachDirectFormHandlers] Function called");
        
        // Проверяем, что app-section загружен
        const appSection = document.getElementById("app-section");
        if (!appSection) {
            console.warn("[attachDirectFormHandlers] app-section not found, will retry");
            return false;
        }
        
        // Обработчик для кнопки создания активности
        const activityBtn = document.getElementById("create-activity-btn");
        console.log("[attachDirectFormHandlers] Looking for activity button:", !!activityBtn);
        if (activityBtn) {
            console.log("[attachDirectFormHandlers] Activity button found, has handler:", activityBtn.hasAttribute('data-handler-attached'));
        } else {
            console.warn("[attachDirectFormHandlers] Activity button NOT FOUND! Trying querySelector...");
            const activityBtnAlt = document.querySelector("#create-activity-btn");
            console.log("[attachDirectFormHandlers] querySelector result:", !!activityBtnAlt);
        }
        
        if (activityBtn && !activityBtn.hasAttribute('data-handler-attached')) {
            console.log("[Direct Handler] Attaching handler to activity button");
            
            // Предотвращаем отправку формы через submit
            const activityForm = activityBtn.closest('form');
            if (activityForm && activityForm.id === 'new-activity-form' && !activityForm.hasAttribute('data-submit-prevented')) {
                activityForm.addEventListener("submit", function(e) {
                    console.log("[Direct Handler] Activity form submit prevented");
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }, true);
                activityForm.setAttribute('data-submit-prevented', 'true');
            }
            
            // Добавляем обработчик клика на кнопку (но document-level delegation должен работать)
            // Это запасной вариант на случай, если document-level не сработает
            activityBtn.addEventListener("click", async function(e) {
                console.log("[Direct Handler] Activity button clicked (direct handler)!");
                // Не вызываем preventDefault здесь, так как это может конфликтовать с document-level
                // и document-level уже должен обработать это
            }, false); // Используем bubbling, чтобы document-level сработал первым
            
            activityBtn.setAttribute('data-handler-attached', 'true');
            console.log("[Direct Handler] Activity button handler attached successfully");
        } else if (activityBtn) {
            console.log("[Direct Handler] Activity button handler already attached");
        } else {
            console.warn("[Direct Handler] Activity button not found!");
        }
        
        // Обработчик для кнопки создания награды
        const rewardBtn = document.getElementById("create-reward-btn");
        console.log("[attachDirectFormHandlers] Looking for reward button:", !!rewardBtn);
        if (rewardBtn) {
            console.log("[attachDirectFormHandlers] Reward button found, has handler:", rewardBtn.hasAttribute('data-handler-attached'));
        } else {
            console.warn("[attachDirectFormHandlers] Reward button NOT FOUND! Trying querySelector...");
            const rewardBtnAlt = document.querySelector("#create-reward-btn");
            console.log("[attachDirectFormHandlers] querySelector result:", !!rewardBtnAlt);
        }
        
        if (rewardBtn && !rewardBtn.hasAttribute('data-handler-attached')) {
            console.log("[Direct Handler] Attaching handler to reward button");
            
            // Предотвращаем отправку формы через submit
            const rewardForm = rewardBtn.closest('form');
            if (rewardForm && rewardForm.id === 'new-reward-form' && !rewardForm.hasAttribute('data-submit-prevented')) {
                rewardForm.addEventListener("submit", function(e) {
                    console.log("[Direct Handler] Reward form submit prevented");
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }, true);
                rewardForm.setAttribute('data-submit-prevented', 'true');
            }
            
            // Добавляем обработчик клика на кнопку (но document-level delegation должен работать)
            // Это запасной вариант на случай, если document-level не сработает
            rewardBtn.addEventListener("click", async function(e) {
                console.log("[Direct Handler] Reward button clicked (direct handler)!");
                // Не вызываем preventDefault здесь, так как это может конфликтовать с document-level
                // и document-level уже должен обработать это
            }, false); // Используем bubbling, чтобы document-level сработал первым
            
            rewardBtn.setAttribute('data-handler-attached', 'true');
            console.log("[Direct Handler] Reward button handler attached successfully");
        } else if (rewardBtn) {
            console.log("[Direct Handler] Reward button handler already attached");
        } else {
            console.warn("[Direct Handler] Reward button not found!");
        }
        
        // Также прикрепляем обработчики к формам для дополнительной защиты
        const activityForm = document.getElementById("new-activity-form");
        const rewardForm = document.getElementById("new-reward-form");
        
        if (activityForm && !activityForm.hasAttribute('data-form-handler-attached')) {
            activityForm.addEventListener("submit", function(e) {
                console.log("[Form Handler] Activity form submit prevented");
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }, true);
            activityForm.setAttribute('data-form-handler-attached', 'true');
        }
        
        if (rewardForm && !rewardForm.hasAttribute('data-form-handler-attached')) {
            rewardForm.addEventListener("submit", function(e) {
                console.log("[Form Handler] Reward form submit prevented");
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }, true);
            rewardForm.setAttribute('data-form-handler-attached', 'true');
        }
    }
    
    // НЕ прикрепляем обработчики напрямую сразу - они будут прикреплены после загрузки компонентов
    // через loadAppComponents() -> initFormHandlers() -> attachDirectFormHandlers()

    // Инициализация обработчика изменения типа единицы измерения (после загрузки компонентов)
    function initActivityUnitTypeHandler() {
        const unitTypeEl = document.getElementById("activity-unit-type");
        if (unitTypeEl) {
            // Используем функцию из window, если доступна
            const updateFn = typeof window.updateActivityXPInputs === 'function' 
                ? window.updateActivityXPInputs 
                : (typeof updateActivityXPInputs === 'function' ? updateActivityXPInputs : null);
            
            if (updateFn) {
                // Удаляем старые обработчики, клонируя элемент
                const newUnitTypeEl = unitTypeEl.cloneNode(true);
                unitTypeEl.parentNode.replaceChild(newUnitTypeEl, unitTypeEl);
                
                // Добавляем новый обработчик
                newUnitTypeEl.addEventListener("change", function(e) {
                    console.log("[initActivityUnitTypeHandler] Unit type changed, calling updateActivityXPInputs");
                    updateFn();
                });
                
                // Инициализация при загрузке
                updateFn();
                console.log("[initActivityUnitTypeHandler] Handler attached and initialized");
            } else {
                console.warn("[initActivityUnitTypeHandler] updateActivityXPInputs function not found");
            }
        } else {
            console.warn("[initActivityUnitTypeHandler] activity-unit-type element not found");
        }
    }

    // Пытаемся инициализировать сразу, если элемент уже есть
    initActivityUnitTypeHandler();
    
    // Также пытаемся инициализировать после небольшой задержки (на случай динамической загрузки)
    setTimeout(initActivityUnitTypeHandler, 500);
    setTimeout(initActivityUnitTypeHandler, 2000);
    
    // Экспортируем функции инициализации для вызова после загрузки компонентов
    if (typeof window !== 'undefined') {
        window.initFormHandlers = function() {
            attachFormHandlers();
            attachDirectFormHandlers();
            initActivityUnitTypeHandler();
        };
        window.attachFormHandlers = attachFormHandlers;
        window.attachDirectFormHandlers = attachDirectFormHandlers;
    }

    // Manual time form
    const manualForm = document.getElementById("manual-time-form");
    if (manualForm && !manualForm.hasAttribute('data-submit-handler-attached')) {
        manualForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Вызываем функцию из app_activities.js если доступна, иначе из app.js
            if (typeof window.addManualTime === 'function') {
                await window.addManualTime();
            } else if (typeof addManualTime === 'function') {
                await addManualTime();
            } else {
                console.error("addManualTime function not found!");
                alert("Ошибка: функция добавления времени не найдена");
            }
            return false;
        }, true); // Используем capture phase для надежности
        manualForm.setAttribute('data-submit-handler-attached', 'true');

        document.getElementById("manual-minutes").addEventListener("input", () => {
            const activityId = document.getElementById("manual-activity-select").value;
            updateManualPreview(activityId);
        });

        document.getElementById("manual-quantity").addEventListener("input", () => {
            const activityId = document.getElementById("manual-activity-select").value;
            updateManualPreview(activityId);
        });

        document.getElementById("manual-activity-select").addEventListener("change", (e) => {
            updateManualModalUI(e.target.value);
            updateManualPreview(e.target.value);
        });
    }

    // Edit activity form
    const editForm = document.getElementById("edit-activity-form");
    if (editForm && !editForm.hasAttribute('data-submit-handler-attached')) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log("[app.js] Edit activity form submit prevented");
            if (typeof window.updateActivity === 'function') {
                await window.updateActivity();
            } else if (typeof updateActivity === 'function') {
                await updateActivity();
            } else {
                console.error("updateActivity function not found!");
                alert("Ошибка: функция обновления активности не найдена");
            }
            return false;
        }, true); // Используем capture phase для надежности
        editForm.setAttribute('data-submit-handler-attached', 'true');

        // Обработчик изменения типа единицы измерения в модальном окне редактирования
        const editUnitTypeEl = document.getElementById("edit-activity-unit-type");
        if (editUnitTypeEl) {
            editUnitTypeEl.addEventListener("change", updateEditActivityXPInputs);
        }
    }

    // Edit reward form
    const editRewardForm = document.getElementById("edit-reward-form");
    if (editRewardForm) {
        editRewardForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await updateReward();
        });
    }

    // Create goal form
    const createGoalForm = document.getElementById("create-goal-form");
    if (createGoalForm) {
        createGoalForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await createGoal();
        });
    }
});

// Делегирование событий на уровне document для надежности (вне DOMContentLoaded)
// Это гарантирует, что обработчики будут работать даже если кнопки загружаются динамически
console.log("[app.js] Setting up document-level click delegation (global, outside DOMContentLoaded)");
document.addEventListener("click", function(e) {
    // Проверяем, кликнули ли на кнопку создания активности
    const activityBtn = e.target.id === "create-activity-btn" ? e.target : 
                       (e.target.closest && e.target.closest("#create-activity-btn"));
    
    if (activityBtn) {
        // Проверяем, что кнопка находится в DOM
        if (!document.body.contains(activityBtn)) {
            console.warn("[Document Click Handler] Activity button not in DOM");
            return;
        }
        
        console.log("[Document Click Handler] Activity button clicked via delegation!", activityBtn);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Предотвращаем отправку формы
        const form = activityBtn.closest('form');
        if (form && form.id === 'new-activity-form') {
            // Форма уже предотвращена через preventDefault выше
        }
        
        if (typeof window.createActivity === 'function') {
            console.log("[Document Click Handler] Calling window.createActivity()");
            window.createActivity().catch(err => {
                console.error("[Document Click Handler] Error:", err);
                alert("Ошибка: " + err.message);
            });
        } else if (typeof createActivity === 'function') {
            console.log("[Document Click Handler] Calling createActivity()");
            createActivity().catch(err => {
                console.error("[Document Click Handler] Error:", err);
                alert("Ошибка: " + err.message);
            });
        } else {
            console.error("[Document Click Handler] createActivity not found!");
            console.error("[Document Click Handler] Available functions:", Object.keys(window).filter(k => k.includes('Activity')));
            alert("Функция createActivity не найдена! Проверьте консоль.");
        }
        return false;
    }
    
    // Проверяем, кликнули ли на кнопку создания награды
    const rewardBtn = e.target.id === "create-reward-btn" ? e.target : 
                     (e.target.closest && e.target.closest("#create-reward-btn"));
    
    if (rewardBtn) {
        // Проверяем, что кнопка находится в DOM
        if (!document.body.contains(rewardBtn)) {
            console.warn("[Document Click Handler] Reward button not in DOM");
            return;
        }
        
        console.log("[Document Click Handler] Reward button clicked via delegation!", rewardBtn);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (typeof window.createReward === 'function') {
            console.log("[Document Click Handler] Calling window.createReward()");
            window.createReward().catch(err => {
                console.error("[Document Click Handler] Error:", err);
                alert("Ошибка: " + err.message);
            });
        } else if (typeof createReward === 'function') {
            console.log("[Document Click Handler] Calling createReward()");
            createReward().catch(err => {
                console.error("[Document Click Handler] Error:", err);
                alert("Ошибка: " + err.message);
            });
        } else {
            console.error("[Document Click Handler] createReward not found!");
            console.error("[Document Click Handler] Available functions:", Object.keys(window).filter(k => k.includes('Reward')));
            alert("Функция createReward не найдена! Проверьте консоль.");
        }
        return false;
    }
}, true); // Используем capture phase для раннего перехвата

// ============= FORGOT PASSWORD =============
let resetCodeEmail = null;

function showForgotPassword() {
    try {
        const modal = document.getElementById("forgot-password-modal");
        const step1 = document.getElementById("forgot-step1");
        const step2 = document.getElementById("forgot-step2");

        if (!modal || !step1 || !step2) {
            console.error("Forgot password modal elements not found");
            alert("Ошибка: элементы формы восстановления пароля не найдены");
            return;
        }

        modal.classList.remove("hidden");
        step1.classList.remove("hidden");
        step2.classList.add("hidden");
        resetCodeEmail = null;
    } catch (e) {
        console.error("Error showing forgot password modal:", e);
        alert("Ошибка при открытии формы восстановления пароля");
    }
}

function closeForgotPassword() {
    document.getElementById("forgot-password-modal").classList.add("hidden");
    resetCodeEmail = null;
}

async function requestResetCode() {
    const email = document.getElementById("forgot-email").value.trim();
    const errorEl = document.getElementById("forgot-error1");

    if (!email) {
        errorEl.textContent = "Введите email";
        errorEl.classList.remove("hidden");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Ошибка запроса");
        }

        // Сохраняем email для следующего шага
        resetCodeEmail = email;

        // Показываем код (только для разработки!)
        alert(`Код восстановления: ${data.code}\n\n(В продакшене код будет отправлен на email)`);

        // Переходим ко второму шагу
        document.getElementById("forgot-step1").classList.add("hidden");
        document.getElementById("forgot-step2").classList.remove("hidden");
        errorEl.classList.add("hidden");

    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove("hidden");
    }
}

async function resetPassword() {
    const code = document.getElementById("forgot-code").value.trim();
    const newPassword = document.getElementById("forgot-new-password").value;
    const confirmPassword = document.getElementById("forgot-confirm-password").value;
    const errorEl = document.getElementById("forgot-error2");
    const successEl = document.getElementById("forgot-success");

    errorEl.classList.add("hidden");
    successEl.classList.add("hidden");

    if (!code || code.length !== 6) {
        errorEl.textContent = "Введите 6-значный код";
        errorEl.classList.remove("hidden");
        return;
    }

    if (!newPassword || newPassword.length < 6) {
        errorEl.textContent = "Пароль должен быть минимум 6 символов";
        errorEl.classList.remove("hidden");
        return;
    }

    if (newPassword !== confirmPassword) {
        errorEl.textContent = "Пароли не совпадают";
        errorEl.classList.remove("hidden");
        return;
    }

    if (!resetCodeEmail) {
        errorEl.textContent = "Ошибка: email не найден";
        errorEl.classList.remove("hidden");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: resetCodeEmail,
                code: code,
                new_password: newPassword
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Ошибка сброса пароля");
        }

        successEl.textContent = "✅ Пароль успешно изменён! Теперь войдите.";
        successEl.classList.remove("hidden");

        setTimeout(() => {
            closeForgotPassword();
            showLoginForm();
            document.getElementById("login-email").value = resetCodeEmail;
        }, 2000);

    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove("hidden");
    }
}

// ============= STREAK =============
// Функция loadStreak определена в app_wallet.js

// Функция loadRecommendations определена в app_wallet.js

async function startActivityFromRecommendation(activityId) {
    // Находим активность в массиве
    const activity = allActivities.find(a => a.id === activityId);
    if (!activity) {
        alert("Активность не найдена. Пожалуйста, обновите страницу.");
        return;
    }

    // Проверяем, не запущен ли уже таймер для этой активности
    if (activeTimers.has(activityId)) {
        alert("Таймер уже запущен для этой активности! Прокрутите к разделу 'Активности' чтобы остановить его.");
        // Прокручиваем к активностям
        setTimeout(() => {
            document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
    }

    // Находим кнопку старта для этой активности
    // Ищем по data-activity-id на кнопке или по родительскому элементу
    let startBtn = null;
    let activityCard = null;

    // Вариант 1: ищем кнопку с data-activity-id
    const allTimerBtns = document.querySelectorAll('.timer-btn');
    for (const btn of allTimerBtns) {
        if (btn.dataset.activityId == activityId) {
            startBtn = btn;
            activityCard = btn.closest('[data-activity-id]') || btn.parentElement;
            break;
        }
    }

    // Вариант 2: ищем по родительскому элементу с data-activity-id
    if (!startBtn) {
        activityCard = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (activityCard) {
            startBtn = activityCard.querySelector('.timer-btn');
        }
    }

    if (startBtn && !startBtn.classList.contains('bg-red-100')) {
        // Если кнопка найдена и таймер не запущен, запускаем его
        startBtn.click();

        // Показываем уведомление
        showNotification(`✅ ${t('activity_started').replace('{activity}', activity.name)}`, 'success');

        // Прокручиваем к активностям для визуального подтверждения
        setTimeout(() => {
            document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Подсвечиваем активную карточку
            if (activityCard) {
                activityCard.style.transition = 'all 0.3s';
                activityCard.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.5)';
                setTimeout(() => {
                    activityCard.style.boxShadow = '';
                }, 2000);
            }
        }, 300);
    } else {
        // Если кнопка не найдена, создаём временную и запускаем таймер напрямую
        const tempBtn = document.createElement('button');
        tempBtn.className = 'timer-btn';
        tempBtn.dataset.activityId = activityId;
        await toggleTimer(activityId, tempBtn, activity);

        // Показываем уведомление
        showNotification(`✅ ${t('activity_started').replace('{activity}', activity.name)}`, 'success');

        // Прокручиваем к активностям
        setTimeout(() => {
            document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

// Функция showNotification определена в app_utils.js

// ============= ADMIN PANEL =============
async function loadInviteCode() {
    try {
        const res = await fetch(`${API_BASE}/admin/invite-code`, {
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        if (!res.ok) {
            if (res.status === 403) {
                // Подопечный пытается получить invite код
                hideAdminPanel();
                showNotification(`🚫 ${t('access_denied')}`, 'error');
            }
            return;
        }
        const data = await res.json();

        const baseUrl = window.location.origin + window.location.pathname;
        const inviteLink = `${baseUrl}?invite=${data.invite_code}`;
        const inviteLinkInput = document.getElementById("invite-link");
        if (inviteLinkInput) {
            inviteLinkInput.value = inviteLink;
        }
    } catch (e) {
        console.error("Error loading invite code:", e);
    }
}

async function showAdminPanel() {
    // Добавляем обработчик клика при открытии
    setTimeout(() => {
        document.addEventListener('click', handleAdminPanelClickOutside);
    }, 100);
    // Проверяем права доступа перед открытием панели
    try {
        const res = await fetch(`${API_BASE}/admin/invite-code`, {
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });

        if (!res.ok) {
            // Подопечный пытается открыть админ-панель
            showNotification(`🚫 ${t('access_denied')}`, 'error');
            return;
        }
    } catch (e) {
        showNotification(`🚫 ${t('error_checking_access')}`, 'error');
        return;
    }

    const adminPanel = document.getElementById("admin-panel");
    adminPanel.classList.remove("hidden");
    updateAdminCategoryFilter();
    loadChildren();
    loadInviteCode();

    // Прокручиваем к самому верху страницы, где находится админ-панель
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

function hideAdminPanel() {
    document.getElementById("admin-panel").classList.add("hidden");
    // Удаляем обработчик клика при закрытии
    document.removeEventListener('click', handleAdminPanelClickOutside);
}

function handleAdminPanelClickOutside(event) {
    const adminPanel = document.getElementById("admin-panel");
    if (!adminPanel || adminPanel.classList.contains("hidden")) {
        return;
    }

    // Проверяем, был ли клик вне панели
    if (!adminPanel.contains(event.target) && !event.target.closest('#admin-btn')) {
        hideAdminPanel();
    }
}

function copyInviteLink() {
    const input = document.getElementById("invite-link");
    input.select();
    document.execCommand("copy");

    const btn = event.target.closest("button");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
    btn.classList.add("bg-green-500", "hover:bg-green-600");
    btn.classList.remove("bg-blue-500", "hover:bg-blue-600");

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove("bg-green-500", "hover:bg-green-600");
        btn.classList.add("bg-blue-500", "hover:bg-blue-600");
    }, 2000);
}

async function loadChildren() {
    try {
        const res = await fetch(`${API_BASE}/admin/children`, {
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        if (!res.ok) {
            if (res.status === 403) {
                // Подопечный пытается загрузить данные
                document.getElementById("children-list").innerHTML = `<div class="text-center text-red-500 py-4">🚫 ${t('access_denied')}</div>`;
                // Скрываем панель, если подопечный каким-то образом её открыл
                hideAdminPanel();
                showNotification(`🚫 ${t('access_denied')}`, 'error');
            } else {
                document.getElementById("children-list").innerHTML = `<div class="text-center text-gray-400 py-4">${t('error_loading')}</div>`;
            }
            return;
        }

        const children = await res.json();
        const listEl = document.getElementById("children-list");

        if (children.length === 0) {
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4">${t('no_children')}</div>`;
            return;
        }

        listEl.innerHTML = children.map(child => `
            <div class="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-bold text-gray-800">${child.username}</div>
                        <div class="text-sm text-gray-500">${child.email}</div>
                    </div>
                    <button onclick="showChildStats(${child.id}, '${child.username}')"
                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all">
                        <i class="fas fa-chart-line mr-2"></i>${t('stats')}
                    </button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error loading children:", e);
        document.getElementById("children-list").innerHTML = `<div class="text-center text-red-400 py-4">${t('error_loading')}</div>`;
    }
}

async function showChildStats(childId, childName) {
    const modal = document.getElementById("child-stats-modal");
    modal.classList.remove("hidden");
    modal.setAttribute("data-child-id", childId); // Сохраняем childId для обновления при смене языка
    document.getElementById("child-stats-name").textContent = `${t('stats_for')} ${childName}`;
    document.getElementById("child-stats-content").innerHTML = `<div class="text-center text-gray-400 py-8">${t('loading')}</div>`;

    try {
        const categoryFilter = document.getElementById('admin-category-filter');
        const selectedCategory = categoryFilter ? categoryFilter.value : '';

        // Загружаем статистику
        const [statsRes, historyRes, activitiesRes, goalsRes, categoryStatsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/child/${childId}/stats`, {
                headers: { "Authorization": `Bearer ${getAuthToken()}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/history?limit=20`, {
                headers: { "Authorization": `Bearer ${getAuthToken()}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/activities${selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`, {
                headers: { "Authorization": `Bearer ${getAuthToken()}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/goals`, {
                headers: { "Authorization": `Bearer ${getAuthToken()}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/category-stats?period=week`, {
                headers: { "Authorization": `Bearer ${getAuthToken()}` }
            })
        ]);

        if (!statsRes.ok) throw new Error("Ошибка загрузки статистики");

        const stats = await statsRes.json();
        const history = historyRes.ok ? await historyRes.json() : [];
        const activities = activitiesRes.ok ? await activitiesRes.json() : [];
        const goals = goalsRes.ok ? await goalsRes.json() : [];
        const categoryStats = categoryStatsRes.ok ? await categoryStatsRes.json() : { categories: [] };

        const contentEl = document.getElementById("child-stats-content");
        contentEl.innerHTML = `
            <!-- Основная статистика -->
            <div class="flex justify-center mb-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                    <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white text-center">
                        <div class="text-2xl font-black">${Math.round(stats.balance)}</div>
                        <div class="text-sm opacity-90">${t('balance_xp')}</div>
                    </div>
                    <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                        <div class="text-2xl font-black">${stats.level}</div>
                        <div class="text-sm opacity-90">${t('level_text')}</div>
                    </div>
                    <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white text-center">
                        <div class="text-2xl font-black">${stats.current_streak}</div>
                        <div class="text-sm opacity-90">${t('current_streak_text')}</div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white text-center">
                        <div class="text-2xl font-black">${stats.activities_count}</div>
                        <div class="text-sm opacity-90">${t('activities_count_text')}</div>
                    </div>
                </div>
            </div>

            <!-- Детальная статистика -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-xl p-4">
                    <h4 class="font-bold text-gray-800 mb-3">📊 ${t('general_stats')}</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">${t('total_earned')}</span>
                            <span class="font-bold text-green-600">${Math.round(stats.total_earned)} XP</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">${t('total_spent')}</span>
                            <span class="font-bold text-red-600">${Math.round(stats.total_spent)} XP</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">${t('record_streak')}</span>
                            <span class="font-bold">${stats.longest_streak} ${t('days')}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">${t('days_active')}</span>
                            <span class="font-bold">${stats.total_days_active}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-4">
                    <h4 class="font-bold text-gray-800 mb-3">📅 ${t('today')}</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">${t('earned')}</span>
                            <span class="font-bold text-green-600">${Math.round(stats.today_earned)} XP</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">${t('time')}</span>
                            <span class="font-bold">${Math.round(stats.today_time)} ${t('minutes')}</span>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">${t('week')}</span>
                            <span class="font-bold text-green-600">${Math.round(stats.week_earned)} XP</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- История -->
            <div class="mb-4">
                <h4 class="font-bold text-gray-800 mb-3">📜 ${t('recent_transactions')}</h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${history.length > 0 ? history.map(item => {
                        const date = new Date(item.date);
                        const isEarn = item.type === 'earn';
                        const localeMap = { 'ru': 'ru-RU', 'uk': 'uk-UA', 'de': 'de-DE', 'en': 'en-US' };
                        const locale = localeMap[currentLanguage] || 'ru-RU';
                        return `
                            <div class="flex items-center justify-between p-3 rounded-lg ${isEarn ? 'bg-emerald-50' : 'bg-red-50'}">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg flex items-center justify-center ${isEarn ? 'bg-emerald-500' : 'bg-red-500'}">
                                        <i class="fas ${isEarn ? 'fa-arrow-up' : 'fa-arrow-down'} text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-800 text-sm">${item.description}</div>
                                        <div class="text-xs text-gray-500">${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                                <div class="font-bold ${isEarn ? 'text-emerald-600' : 'text-red-600'}">
                                    ${isEarn ? '+' : '-'}${Math.round(item.amount)} XP
                                </div>
                            </div>
                        `;
                    }).join('') : `<div class="text-center text-gray-400 py-4">${t('history_empty')}</div>`}
                </div>
            </div>

            <!-- Статистика по категориям -->
            <div class="mb-4">
                <h4 class="font-bold text-gray-800 mb-3">📊 ${t('category_stats_week')}</h4>
                <div class="space-y-2">
                    ${categoryStats.categories && categoryStats.categories.length > 0 ? categoryStats.categories.map(cat => {
                        const categoryNames = {
                            "general": t('category_general'),
                            "study": t('category_study'),
                            "sport": t('category_sport'),
                            "hobby": t('category_hobby'),
                            "work": t('category_work'),
                            "health": t('category_health')
                        };

                        // Добавляем пользовательские категории
                        if (allCategories.custom) {
                            allCategories.custom.forEach(customCat => {
                                categoryNames[customCat.id] = customCat.name;
                            });
                        }

                        const catName = categoryNames[cat.category] || cat.category;
                        const percentage = categoryStats.total_xp > 0 ? (cat.total_xp / categoryStats.total_xp * 100) : 0;
                        return `
                            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium text-gray-800">${catName}</span>
                                    <span class="font-bold text-blue-600">${Math.round(cat.total_xp)} XP</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                                    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all" style="width: ${percentage}%"></div>
                                </div>
                                <div class="text-xs text-gray-500">${Math.round(cat.total_time)} ${t('min_short')} • ${formatActivitiesCount(cat.activity_count)}</div>
                            </div>
                        `;
                    }).join('') : `<div class="text-center text-gray-400 py-4">${t('no_category_data')}</div>`}
                </div>
            </div>

            <!-- Активности -->
            <div class="mb-4">
                <h4 class="font-bold text-gray-800 mb-3">🎯 ${t('activities')}</h4>
                <div class="grid grid-cols-2 gap-2">
                    ${activities.length > 0 ? activities.map(act => {
                        const categoryNames = {
                            "general": t('category_general'),
                            "study": t('category_study'),
                            "sport": t('category_sport'),
                            "hobby": t('category_hobby'),
                            "work": t('category_work'),
                            "health": t('category_health')
                        };

                        // Добавляем пользовательские категории
                        if (allCategories.custom) {
                            allCategories.custom.forEach(customCat => {
                                categoryNames[customCat.id] = customCat.name;
                            });
                        }

                        const category = act.category || "general";
                        const catName = categoryNames[category] || category;
                        return `
                        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div class="font-medium text-gray-800 text-sm">${act.name}</div>
                            <div class="text-xs text-blue-600 mt-1">${catName}</div>
                            <div class="text-xs text-gray-600">${act.xp_per_hour} ${t('xp_per_hour')}</div>
                        </div>
                    `;
                    }).join('') : `<div class="text-gray-400 text-sm">${t('no_activities_text')}</div>`}
                </div>
            </div>

            <!-- Цели -->
            <div>
                <h4 class="font-bold text-gray-800 mb-3">🎯 ${t('my_goals')}</h4>
                <div class="space-y-2">
                    ${goals.length > 0 ? goals.map(goal => {
                        const progressPercent = goal.target_xp > 0 ? Math.min((goal.current_xp / goal.target_xp) * 100, 100) : 0;
                        const isCompleted = goal.is_completed === 1;
                        return `
                            <div class="p-3 bg-purple-50 rounded-lg border ${isCompleted ? 'border-green-300' : 'border-purple-200'}">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="font-medium text-gray-800 text-sm">${goal.title}</div>
                                    ${isCompleted ? `<span class="text-green-600 text-xs">✓ ${t('completed')}</span>` : ''}
                                </div>
                                <div class="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>${Math.round(goal.current_xp)} / ${Math.round(goal.target_xp)} XP</span>
                                    <span>${Math.round(progressPercent)}%</span>
                                </div>
                                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}"
                                         style="width: ${progressPercent}%"></div>
                                </div>
                            </div>
                        `;
                    }).join('') : `<div class="text-gray-400 text-sm">${t('no_goals_text')}</div>`}
                </div>
            </div>
        `;
    } catch (e) {
        console.error("Error loading child stats:", e);
        document.getElementById("child-stats-content").innerHTML = `<div class="text-center text-red-400 py-4">${t('error_loading_stats')}</div>`;
    }
}

function closeChildStats() {
    document.getElementById("child-stats-modal").classList.add("hidden");
}

function updateAdminCategoryFilter() {
    const filterSelect = document.getElementById('admin-category-filter');
    if (!filterSelect) return;

    // Сохраняем текущее значение
    const currentValue = filterSelect.value;

    // Очищаем селект
    filterSelect.innerHTML = '';

    // Добавляем опцию "Все категории"
    const newAllOption = document.createElement('option');
    newAllOption.value = '';
    newAllOption.textContent = t('all_categories');
    filterSelect.appendChild(newAllOption);

    // Используем те же данные, что и в updateCategoryDropdown - берем категории из allCategories
    // Стандартные категории (с fallback если еще не загружены)
    const standardCats = allCategories.standard && allCategories.standard.length > 0
        ? allCategories.standard
        : [
            {id: "general", name: "Общее"},
            {id: "study", name: "Учеба"},
            {id: "sport", name: "Спорт"},
            {id: "hobby", name: "Хобби"},
            {id: "work", name: "Работа"},
            {id: "health", name: "Здоровье"}
        ];

    // Определяем, какие стандартные категории были заменены пользовательскими
    const replacedStandardCategories = new Set();
    if (allCategories.custom && allCategories.custom.length > 0) {
        allCategories.custom.forEach(cat => {
            if (cat.replaced_standard_category) {
                replacedStandardCategories.add(cat.replaced_standard_category);
            }
        });
    }

    // Добавляем стандартные категории, пропуская те, что были заменены пользовательскими
    standardCats.forEach(cat => {
        if (!replacedStandardCategories.has(cat.id)) {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name; // Используем название из бэкенда (уже переведенное или оригинальное)
            filterSelect.appendChild(option);
        } else {
            // Находим пользовательскую категорию, которая заменяет эту стандартную
            const replacement = allCategories.custom.find(c => c.replaced_standard_category === cat.id);
            if (replacement) {
                const option = document.createElement('option');
                option.value = replacement.id;
                option.textContent = replacement.name; // Оригинальное название пользователя
                filterSelect.appendChild(option);
            }
        }
    });

    // Добавляем остальные пользовательские категории (которые не заменяют стандартные)
    const nonReplacementCustom = allCategories.custom?.filter(cat => !cat.replaced_standard_category) || [];
    if (nonReplacementCustom.length > 0) {
        nonReplacementCustom.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name; // Оригинальное название пользователя
            filterSelect.appendChild(option);
        });
    }

    // Восстанавливаем значение
    filterSelect.value = currentValue;
}

function filterChildrenByCategory() {
    // Перезагружаем статистику для всех открытых модальных окон
    const modal = document.getElementById("child-stats-modal");
    if (!modal.classList.contains("hidden")) {
        const childId = modal.getAttribute("data-child-id");
        const childName = document.getElementById("child-stats-name").textContent.replace(`${t('stats_for')} `, "");
        if (childId) {
            showChildStats(parseInt(childId), childName);
        }
    }
}

// ============= CATEGORIES =============
let allCategories = { standard: [], custom: [], all: [] };

// Функции loadCategories, updateCategoryDropdown, saveCategory, deleteCategory определены в app_categories.js

// Вспомогательные функции для категорий (используются только в app.js)
async function loadCategoriesHelper() {
    try {
        const token = getAuthToken();
        if (!token) {
            // Даже без токена обновляем dropdown с базовыми категориями
            updateCategoryDropdown('activity-category');
            updateCategoryDropdown('edit-activity-category');
            return;
        }

        const res = await fetch(`${API_BASE}/categories/`, {
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });

        if (!res.ok) {
            console.error("Failed to load categories:", res.status);
            // Обновляем dropdown с базовыми категориями даже при ошибке
            updateCategoryDropdown('activity-category');
            updateCategoryDropdown('edit-activity-category');
            return;
        }

        const data = await res.json();
        allCategories = data;

        // Обновляем dropdown для создания активности
        updateCategoryDropdown('activity-category');
        // Обновляем dropdown для редактирования активности
        updateCategoryDropdown('edit-activity-category');
        // Обновляем селект категорий в админ панели
        updateAdminCategoryFilter();

        // Кнопки действий больше не нужны, так как они теперь в dropdown

        // Обновляем список категорий в модальном окне, если оно открыто
        const categoryModal = document.getElementById('category-modal');
        if (categoryModal && !categoryModal.classList.contains('hidden')) {
            renderCustomCategoriesList();
        }

        // Перерисовываем активности, если они уже были загружены, чтобы обновить названия категорий
        if (allActivities && allActivities.length > 0) {
            const activitiesListEl = document.getElementById('activities-list');
            if (activitiesListEl) {
                activitiesListEl.innerHTML = "";
                allActivities.forEach(renderActivityCard);
            }
        }
    } catch (e) {
        console.error("Error loading categories:", e);
        // Обновляем dropdown с базовыми категориями даже при ошибке
        updateCategoryDropdown('activity-category');
        updateCategoryDropdown('edit-activity-category');
    }
}

// Функция updateCategoryDropdown определена в app_categories.js

// Вспомогательная функция для обновления dropdown (используется только в app.js)
function updateCategoryDropdownHelper(selectId) {
    const hiddenInput = document.getElementById(selectId);
    const button = document.getElementById(`${selectId}-button`);
    const textSpan = document.getElementById(`${selectId}-text`);
    const dropdown = document.getElementById(`${selectId}-dropdown`);

    if (!hiddenInput || !button || !textSpan || !dropdown) {
        console.warn(`Custom dropdown elements for ${selectId} not found:`, {
            hiddenInput: !!hiddenInput,
            button: !!button,
            textSpan: !!textSpan,
            dropdown: !!dropdown
        });
        return;
    }

    // Устанавливаем "Общее" по умолчанию, если значение не установлено или пустое
    if (!hiddenInput.value || hiddenInput.value === '') {
        hiddenInput.value = 'general';
        if (textSpan) {
            const generalCat = allCategories.standard?.find(c => c.id === 'general') || { name: t('category_general') };
            textSpan.textContent = generalCat.name;
        }
    }

    const currentValue = hiddenInput.value || 'general';

    // Очищаем dropdown
    dropdown.innerHTML = '';

    // Добавляем стандартные категории (с fallback если еще не загружены)
    const standardCats = allCategories.standard && allCategories.standard.length > 0
        ? allCategories.standard
        : [
            {id: "general", name: "Общее"},
            {id: "study", name: "Учеба"},
            {id: "sport", name: "Спорт"},
            {id: "hobby", name: "Хобби"},
            {id: "work", name: "Работа"},
            {id: "health", name: "Здоровье"}
        ];

    // Определяем, какие стандартные категории были заменены пользовательскими
    const replacedStandardCategories = new Set();
    if (allCategories.custom && allCategories.custom.length > 0) {
        allCategories.custom.forEach(cat => {
            if (cat.replaced_standard_category) {
                replacedStandardCategories.add(cat.replaced_standard_category);
            }
        });
    }

    // Добавляем стандартные категории, пропуская те, что были заменены пользовательскими
    standardCats.forEach(cat => {
        // Пропускаем стандартные категории, которые были заменены пользовательскими
        if (!replacedStandardCategories.has(cat.id)) {
            const option = createDropdownOption(cat.id, cat.name, false, null, selectId);
            dropdown.appendChild(option);
        } else {
            // Находим пользовательскую категорию, которая заменяет эту стандартную
            const replacement = allCategories.custom.find(c => c.replaced_standard_category === cat.id);
            if (replacement) {
                // Показываем пользовательскую категорию на месте стандартной
                const option = createDropdownOption(replacement.id, replacement.name, true, replacement, selectId);
                dropdown.appendChild(option);
            }
        }
    });

    // Добавляем остальные пользовательские категории (которые не заменяют стандартные)
    const nonReplacementCustom = allCategories.custom?.filter(cat => !cat.replaced_standard_category) || [];
    if (nonReplacementCustom.length > 0) {
        const separator = document.createElement('div');
        separator.className = 'px-4 py-2 text-gray-400 text-xs border-t border-gray-200';
        separator.textContent = '──────────';
        dropdown.appendChild(separator);

        nonReplacementCustom.forEach(cat => {
            const option = createDropdownOption(cat.id, cat.name, true, cat, selectId);
            dropdown.appendChild(option);
        });
    }

    // Всегда добавляем кнопку "Добавить категорию" в конец списка
    const addOption = document.createElement('div');
    addOption.className = 'px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between border-t border-gray-200';
    addOption.innerHTML = `<span class="text-blue-600 font-semibold">➕ ${t('add_category')}</span>`;
    addOption.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdown(selectId);
        openCategoryModal();
    };
    dropdown.appendChild(addOption);

    console.log(`Dropdown ${selectId} updated:`, {
        standardCats: standardCats.length,
        customCats: allCategories.custom?.length || 0,
        addOptionAdded: true
    });

    // Обновляем отображаемый текст
    const selectedCat = [...standardCats, ...(allCategories.custom || [])].find(c => c.id === currentValue);
    if (selectedCat) {
        textSpan.textContent = selectedCat.name;
        hiddenInput.value = currentValue;
    } else {
        // Если категория не найдена, устанавливаем "Общее" по умолчанию
        const generalCat = standardCats.find(c => c.id === 'general');
        textSpan.textContent = generalCat ? generalCat.name : t('category_general');
        hiddenInput.value = 'general';
    }

    // Обработчик открытия/закрытия dropdown
    if (!button._dropdownHandler) {
        button._dropdownHandler = (e) => {
            e.stopPropagation();
            const isOpen = !dropdown.classList.contains('hidden');
            if (isOpen) {
                closeDropdown(selectId);
            } else {
                openDropdown(selectId);
            }
        };
        button.addEventListener('click', button._dropdownHandler);
    }

    // Закрываем dropdown при клике вне его
    if (!document._categoryDropdownHandler) {
        document._categoryDropdownHandler = (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                closeDropdown('activity-category');
                closeDropdown('edit-activity-category');
            }
        };
        document.addEventListener('click', document._categoryDropdownHandler);
    }
}

function createDropdownOption(value, name, isCustom, categoryData, selectId) {
    const option = document.createElement('div');
    option.className = 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group min-w-0';
    option.dataset.value = value;
    option.dataset.isCustom = isCustom ? 'true' : 'false';

    const leftPart = document.createElement('div');
    leftPart.className = 'flex-1 min-w-0 pr-2 text-center';
    leftPart.textContent = name;
    leftPart.style.wordBreak = 'break-word';

    option.appendChild(leftPart);

    // Категория "Общее" - захардкоженная, без кнопок редактирования и удаления
    if (value === 'general') {
        // Для категории "Общее" центрируем полностью
        option.className = 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-center group min-w-0';
        leftPart.className = 'text-center';
        // Для категории "Общее" не добавляем кнопки, но добавляем обработчик клика для выбора
        option.onclick = (e) => {
            e.stopPropagation();
            selectCategoryOption(selectId, value, name);
        };
        return option;
    }

    // Добавляем кнопки редактирования для всех остальных категорий
    const actions = document.createElement('div');
    // Для стандартных категорий уменьшаем gap между кнопками
    actions.className = isCustom ? 'flex items-center gap-1' : 'flex items-center gap-0.5';

    // Кнопка редактирования - для всех категорий кроме "Общее"
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors';
    editBtn.innerHTML = '<i class="fas fa-pencil-alt text-xs"></i>';
    editBtn.title = 'Редактировать категорию';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdown(selectId);
        if (isCustom && categoryData) {
            // Для пользовательских категорий редактируем напрямую
            openCategoryModal(categoryData.id, categoryData.name);
        } else {
            // Для стандартных категорий (кроме "Общее") создаем пользовательскую копию
            // Передаем ID стандартной категории для замены активностей
            openCategoryModal(null, name, value);
        }
    };

    actions.appendChild(editBtn);

    // Кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    if (isCustom && categoryData) {
        // Для пользовательских категорий - активная кнопка удаления
        deleteBtn.className = 'p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors';
        deleteBtn.title = 'Удалить категорию (активности перейдут в "Общее")';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            closeDropdown(selectId);
            deleteCategory(categoryData.id);
        };
    } else {
        // Для стандартных категорий - красная кнопка, но с сообщением при клике
        deleteBtn.className = 'p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer';
        deleteBtn.title = 'Стандартные категории нельзя удалить';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            showNotification('❌ Стандартные категории нельзя удалить', 'error');
        };
    }
    deleteBtn.innerHTML = '<i class="fas fa-trash text-xs"></i>';
    actions.appendChild(deleteBtn);

    option.appendChild(actions);

    // При клике на опцию выбираем её
    option.onclick = (e) => {
        if (e.target.closest('button')) return; // Игнорируем клики по кнопкам
        selectCategoryOption(selectId, value, name);
    };

    return option;
}

function selectCategoryOption(selectId, value, name) {
    const hiddenInput = document.getElementById(selectId);
    const textSpan = document.getElementById(`${selectId}-text`);

    if (hiddenInput && textSpan) {
        hiddenInput.value = value;
        textSpan.textContent = name;
        closeDropdown(selectId);

        // Триггерим событие change для совместимости
        const event = new Event('change', { bubbles: true });
        hiddenInput.dispatchEvent(event);
    }
}

function openDropdown(selectId) {
    const dropdown = document.getElementById(`${selectId}-dropdown`);
    const button = document.getElementById(`${selectId}-button`);
    if (dropdown && button) {
        dropdown.classList.remove('hidden');
        const icon = button.querySelector('i');
        if (icon) icon.classList.add('rotate-180');
    }
}

function closeDropdown(selectId) {
    const dropdown = document.getElementById(`${selectId}-dropdown`);
    const button = document.getElementById(`${selectId}-button`);
    if (dropdown && button) {
        dropdown.classList.add('hidden');
        const icon = button.querySelector('i');
        if (icon) icon.classList.remove('rotate-180');
    }
}

// Функция updateCategoryActions больше не нужна, так как кнопки теперь в dropdown
function updateCategoryActions(selectId) {
    // Оставлена для совместимости, но не используется
}

function openCategoryModal(categoryId = null, categoryName = null, standardCategoryId = null) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('category-modal-title');
    const nameInput = document.getElementById('category-name');
    const idInput = document.getElementById('category-id');

    if (categoryId && categoryName) {
        // Редактирование пользовательской категории
        title.textContent = 'Редактировать категорию';
        idInput.value = categoryId;
        nameInput.value = categoryName;
        delete idInput.dataset.originalName;
        delete idInput.dataset.originalValue;
    } else if (categoryName) {
        // Редактирование стандартной категории - предзаполняем название
        title.textContent = 'Редактировать категорию';
        idInput.value = '';
        nameInput.value = categoryName;
        // Сохраняем оригинальное название и ID стандартной категории для замены активностей
        idInput.dataset.originalName = categoryName;
        idInput.dataset.originalValue = standardCategoryId || categoryName; // ID стандартной категории (study, sport и т.д.)
    } else {
        // Создание новой категории
        title.textContent = 'Добавить категорию';
        idInput.value = '';
        nameInput.value = '';
        delete idInput.dataset.originalName;
        delete idInput.dataset.originalValue;
    }

    // Загружаем список категорий
    renderCustomCategoriesList();

    modal.classList.remove('hidden');
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.add('hidden');
    document.getElementById('category-form').reset();
}

// Функция saveCategory определена в app_categories.js

// Вспомогательная функция для сохранения категории (используется только в app.js)
async function saveCategoryHelper() {
    const nameInput = document.getElementById('category-name');
    const idInput = document.getElementById('category-id');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Введите название категории');
        return;
    }

    try {
        let res;
        if (idInput.value) {
            // Редактирование
            const dbId = idInput.value.replace('custom_', '');
            res = await fetch(`${API_BASE}/categories/${dbId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ name })
            });
        } else {
            // Создание новой категории или редактирование стандартной
            const originalName = idInput.dataset.originalName;
            const originalValue = idInput.dataset.originalValue; // ID стандартной категории (study, sport и т.д.)

            if (originalName && originalValue) {
                // Редактируем стандартную категорию
                // Ищем существующую пользовательскую категорию с таким названием
                const existingCategory = allCategories.custom?.find(cat => cat.name === originalName);

                if (existingCategory) {
                    // Если есть пользовательская категория с таким названием, редактируем её
                    const dbId = existingCategory.id.replace('custom_', '');
                    res = await fetch(`${API_BASE}/categories/${dbId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getAuthToken()}`
                        },
                        body: JSON.stringify({ name })
                    });
                } else {
                    // Создаем новую пользовательскую категорию и обновляем активности
                    res = await fetch(`${API_BASE}/categories/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getAuthToken()}`
                        },
                        body: JSON.stringify({
                            name: name,
                            replace_standard_category: originalValue // ID стандартной категории для замены
                        })
                    });
                }
            } else {
                // Создание новой категории
                res = await fetch(`${API_BASE}/categories/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: JSON.stringify({ name })
                });
            }
        }

        if (!res.ok) {
            let errorMessage = 'Ошибка сохранения категории';
            try {
                const errorData = await res.json();
                errorMessage = errorData.detail || errorMessage;
            } catch (e) {
                // Если не удалось распарсить JSON, используем текст ответа
                const text = await res.text().catch(() => '');
                if (text.includes('уже существует') || text.includes('already exists') || text.includes('duplicate')) {
                    errorMessage = 'Категория с таким названием уже существует';
                }
            }

            // Показываем понятное сообщение пользователю
            if (errorMessage.includes('уже существует') || errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
                showNotification('❌ Категория с таким названием уже существует!', 'error');
            } else if (errorMessage.includes('no such table')) {
                showNotification('❌ Ошибка базы данных. Обратитесь к администратору.', 'error');
            } else {
                showNotification(`❌ ${errorMessage}`, 'error');
            }
            return;
        }

        const newData = await res.json();
        await loadCategories();
        renderCustomCategoriesList(); // Обновляем список в модальном окне

        // Если редактировали стандартную категорию, обновляем все активности
        const originalValue = idInput.dataset.originalValue;
        if (originalValue && newData.id) {
            // Обновляем все активности, которые используют старую стандартную категорию
            await loadActivities(); // Перезагружаем активности, чтобы они обновились с новой категорией
        }

        // Обновляем dropdown категорий
        updateCategoryDropdown('activity-category');
        updateCategoryDropdown('edit-activity-category');

        // Обновляем выбранную категорию в активных dropdown
        const activityCategory = document.getElementById('activity-category');
        const activityCategoryText = document.getElementById('activity-category-text');
        const editCategory = document.getElementById('edit-activity-category');
        const editCategoryText = document.getElementById('edit-activity-category-text');

        // Если редактировали стандартную категорию, обновляем выбранную категорию на новую пользовательскую
        const originalName = idInput.dataset.originalName;
        if (originalValue && newData.id) {
            // Обновляем все dropdown, где была выбрана стандартная категория
            if (activityCategory && activityCategoryText) {
                if (activityCategory.value === originalValue || activityCategoryText.textContent === originalName) {
                    activityCategory.value = newData.id;
                    activityCategoryText.textContent = newData.name;
                }
            }
            if (editCategory && editCategoryText) {
                if (editCategory.value === originalValue || editCategoryText.textContent === originalName) {
                    editCategory.value = newData.id;
                    editCategoryText.textContent = newData.name;
                }
            }
        }

        // Если редактировали пользовательскую категорию, обновляем её значение
        if (idInput.value && newData.id) {
            if (activityCategory && activityCategoryText) {
                if (activityCategory.value === idInput.value) {
                    activityCategory.value = newData.id;
                    activityCategoryText.textContent = newData.name;
                }
            }
            if (editCategory && editCategoryText) {
                if (editCategory.value === idInput.value) {
                    editCategory.value = newData.id;
                    editCategoryText.textContent = newData.name;
                }
            }
        }

        // Автоматически выбираем сохраненную категорию в dropdown активности
        if (newData.id && activityCategory && activityCategoryText) {
            // Небольшая задержка, чтобы dropdown успел обновиться
            setTimeout(() => {
                selectCategoryOption('activity-category', newData.id, newData.name);
            }, 100);
        }

        // Закрываем модальное окно после сохранения
        closeCategoryModal();

        showNotification('✅ Категория сохранена!', 'success');
    } catch (e) {
        console.error('Error saving category:', e);
        alert('Ошибка сохранения категории');
    }
}

// Функция deleteCategory определена в app_categories.js

// Вспомогательная функция для удаления категории (используется только в app.js)
async function deleteCategoryHelper(categoryId) {
    if (!confirm('Удалить эту категорию? Активности с этой категорией будут переведены в "Общее".')) {
        return;
    }

    try {
        const dbId = categoryId.replace('custom_', '');
        const res = await fetch(`${API_BASE}/categories/${dbId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || 'Ошибка удаления категории');
            return;
        }

        await loadCategories();
        renderCustomCategoriesList(); // Обновляем список в модальном окне

        // Обновляем кнопки действий
        updateCategoryActions('activity-category');
        updateCategoryActions('edit-activity-category');

        showNotification('✅ Категория удалена!', 'success');
    } catch (e) {
        console.error('Error deleting category:', e);
        alert('Ошибка удаления категории');
    }
}

function renderCustomCategoriesList() {
    const listContainer = document.getElementById('custom-categories-list');
    if (!listContainer) {
        console.warn('custom-categories-list container not found');
        return;
    }

    if (!allCategories.custom || allCategories.custom.length === 0) {
        listContainer.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">У вас пока нет пользовательских категорий</div>';
        return;
    }

    listContainer.innerHTML = allCategories.custom.map(cat => {
        const categoryName = (cat.name || 'Без названия').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const categoryId = cat.id || `custom_${cat.db_id}`;
        const dbId = cat.db_id || categoryId.replace('custom_', '');

        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span class="font-medium text-gray-800 flex-1">${categoryName}</span>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onclick="event.stopPropagation(); openCategoryModal('${categoryId}', '${categoryName.replace(/&#39;/g, "'")}')"
                        class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Редактировать категорию">
                        <i class="fas fa-pencil-alt text-sm"></i>
                    </button>
                    <button
                        onclick="event.stopPropagation(); deleteCategory('${categoryId}')"
                        class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить категорию">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Делаем функции глобальными
window.openCategoryModal = openCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.saveCategory = saveCategory;
window.deleteCategory = deleteCategory;
window.renderCustomCategoriesList = renderCustomCategoriesList;

// Обработчик формы категории
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryForm);
} else {
    initCategoryForm();
}

function initCategoryForm() {
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCategory();
        });
    }
}

// ============= GOALS =============
// Функции loadGoals, createGoal, editGoal, deleteGoal определены в app_goals.js

// Вспомогательные функции для целей (используются только в app.js)
async function loadActivitiesForGoal() {
    try {
        console.log('[loadGoals] Starting to load goals...');
        const listEl = document.getElementById('goals-list');
        if (!listEl) {
            console.warn("[loadGoals] Goals list element not found");
            return;
        }

        // Проверяем доступность функций
        const getToken = typeof getAuthToken === 'function' ? getAuthToken : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken : () => localStorage.getItem('token') || '';
        const translate = typeof t === 'function' ? t : (typeof window !== 'undefined' && window.t) ? window.t : (key) => key;
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        
        console.log('[loadGoals] API_BASE:', apiBase);
        const token = getToken();
        console.log('[loadGoals] Token available:', !!token);
        
        if (!token) {
            console.error("[loadGoals] No auth token available");
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${translate('auth_required') || 'Требуется авторизация'}</div>`;
            return;
        }

        console.log('[loadGoals] Fetching goals from:', `${apiBase}/goals/`);
        const res = await fetch(`${apiBase}/goals/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log('[loadGoals] Response status:', res.status, res.statusText);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[loadGoals] Failed to load goals:", res.status, res.statusText, errorText);
            listEl.innerHTML = `<div class="text-center text-red-400 py-4 text-xs">${translate('error_loading_goals') || 'Ошибка загрузки целей'}</div>`;
            return;
        }

        let data = await res.json();
        console.log('[loadGoals] Received', data.length, 'goals');

        if (data.length === 0) {
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${translate('no_goals') || 'Нет целей'}</div>`;
            return;
        }

        // Маппинг локалей для форматирования дат
        const localeMap = { 'ru': 'ru-RU', 'uk': 'uk-UA', 'de': 'de-DE', 'en': 'en-US' };

        // Сортируем цели по дате достижения: ближайшие сверху, дальние снизу
        // Сначала невыполненные с датой (ближайшие сверху), затем невыполненные без даты, затем выполненные
        data.sort((a, b) => {
            // Выполненные цели в конец
            if (a.is_completed && !b.is_completed) return 1;
            if (!a.is_completed && b.is_completed) return -1;

            // Если обе выполнены или обе не выполнены, сортируем по дате
            if (a.target_date && b.target_date) {
                const dateA = new Date(a.target_date);
                const dateB = new Date(b.target_date);
                // Ближайшие даты сверху (меньшая дата = раньше = выше в списке)
                return dateA - dateB;
            }

            // Если у одной есть дата, а у другой нет - с датой выше (приоритет)
            if (a.target_date && !b.target_date) return -1;
            if (!a.target_date && b.target_date) return 1;

            // Если обе без даты - по названию
            return (a.name || a.title || '').localeCompare(b.name || b.title || '');
        });

        // Проверяем, есть ли новые достигнутые цели для поздравления
        // Используем localStorage для отслеживания уже показанных уведомлений
        const shownNotificationsKey = 'shown_goal_notifications';
        let shownNotifications = JSON.parse(localStorage.getItem(shownNotificationsKey) || '{}');

        // Очищаем старые записи (старше 7 дней)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        Object.keys(shownNotifications).forEach(key => {
            if (shownNotifications[key] < sevenDaysAgo) {
                delete shownNotifications[key];
            }
        });

        const newlyCompletedGoals = data.filter(goal => {
            if (goal.is_completed === 1 && goal.completed_at) {
                // Создаем уникальный ключ для этой цели с датой достижения
                const goalKey = `goal_${goal.id}`;
                const completedTimestamp = new Date(goal.completed_at).getTime();

                // Проверяем, не показывали ли мы уже уведомление для этой цели
                if (shownNotifications[goalKey] && shownNotifications[goalKey] >= completedTimestamp) {
                    return false; // Уже показывали для этой версии достижения
                }

                // Проверяем, была ли цель достигнута недавно (в последние 24 часа)
                const now = Date.now();
                const timeDiff = now - completedTimestamp;

                // Показываем уведомление, если цель достигнута в последние 24 часа
                if (timeDiff < 86400000) { // 24 часа = 86400000 миллисекунд
                    // Сохраняем timestamp достижения для этой цели
                    shownNotifications[goalKey] = completedTimestamp;
                    localStorage.setItem(shownNotificationsKey, JSON.stringify(shownNotifications));
                    return true;
                }
            }
            return false;
        });

        // Показываем поздравление для новых достигнутых целей
        newlyCompletedGoals.forEach(goal => {
            const goalTitle = goal.title || (goal.activity_name ? `"${goal.activity_name}"` : 'цели');
            const bonusText = goal.completion_bonus_xp > 0
                ? ` Бонус: +${Math.round(goal.completion_bonus_xp)} XP!`
                : '';
            const message = `🎉 Поздравляем! Цель "${goalTitle}" достигнута!${bonusText} Прокрутите к разделу "Мои цели" чтобы увидеть прогресс.`;
            const showNotif = typeof showNotification === 'function' ? showNotification : (typeof window !== 'undefined' && window.showNotification) ? window.showNotification : console.log;
            showNotif(message, 'success');
        });

        listEl.innerHTML = data.map(goal => {
            const progressPercent = goal.target_xp > 0 ? Math.min((goal.current_xp / goal.target_xp) * 100, 100) : 0;
            const isCompleted = goal.is_completed === 1;
            const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

            // Определяем активность для проверки типа
            const activity = goal.activity_id ? allActivities.find(a => a.id == goal.activity_id) : null;
            const showQuantity = activity && activity.unit_type === 'quantity' && goal.target_quantity;

            return `
                <div class="p-2 md:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg md:rounded-xl border-2 ${isCompleted ? 'border-green-400 bg-green-50' : 'border-purple-300'} hover:shadow-md transition-all">
                    <div class="flex items-start justify-between mb-1.5 md:mb-2">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-1 md:gap-1.5 mb-1 flex-wrap">
                                <h4 class="font-bold text-gray-800 text-xs md:text-sm">${goal.title}</h4>
                                ${isCompleted ? `<span class="px-1 md:px-1.5 py-0.5 bg-green-500 text-white text-[9px] md:text-[10px] rounded-full flex-shrink-0">✓ ${t('completed')}</span>` : ''}
                            </div>
                            ${goal.activity_name ? `
                                <div class="flex items-center gap-1 mb-0.5 md:mb-1">
                                    <i class="fas fa-tag text-purple-600 text-[10px] md:text-xs"></i>
                                    <span class="text-[10px] md:text-xs text-purple-700 font-medium">${goal.activity_name}</span>
                                </div>
                            ` : ''}
                            ${showQuantity ? `
                                <div class="flex items-center gap-1 mb-0.5 md:mb-1">
                                    <i class="fas fa-hashtag text-purple-600 text-[10px] md:text-xs"></i>
                                    <span class="text-[10px] md:text-xs text-purple-700 font-medium">${Math.round(goal.current_quantity || 0)} / ${Math.round(goal.target_quantity)} ${t('units')}</span>
                                </div>
                            ` : ''}
                            ${goal.target_date ? `
                                <div class="flex items-center gap-1 mb-0.5 md:mb-1">
                                    <i class="fas fa-calendar text-gray-500 text-[10px] md:text-xs"></i>
                                    <span class="text-[9px] md:text-[10px] text-gray-600">
                                        ${new Date(goal.target_date).toLocaleDateString(localeMap[currentLanguage] || 'ru-RU')}
                                        ${daysLeft !== null ? (daysLeft > 0 ? `(${daysLeft} ${t('days_short')})` : daysLeft === 0 ? `(${t('today_exclamation')})` : `(${t('overdue')})`) : ''}
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="flex gap-0.5 md:gap-1 flex-shrink-0 ml-1 md:ml-2">
                            ${!isCompleted ? `
                                <button onclick="editGoal(${goal.id})" class="w-5 h-5 md:w-6 md:h-6 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-all" title="${t('edit')}">
                                    <i class="fas fa-edit text-[9px] md:text-[10px]"></i>
                                </button>
                                <button onclick="deleteGoal(${goal.id})" class="w-5 h-5 md:w-6 md:h-6 rounded bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all" title="${t('delete')}">
                                    <i class="fas fa-trash text-[9px] md:text-[10px]"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="mb-0.5 md:mb-1">
                        <div class="flex justify-between text-[9px] md:text-[10px] mb-0.5 md:mb-1">
                            <span class="text-gray-600 font-medium">${Math.round(goal.current_xp)} / ${Math.round(goal.target_xp)} XP</span>
                            <span class="font-bold text-purple-600">${Math.round(progressPercent)}%</span>
                        </div>
                        <div class="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}"
                                 style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading goals:", e);
    }
}

function showCreateGoalModal() {
    // Сначала обновляем lang атрибут для календаря ДО открытия модального окна
    updateDateInputLang();

    document.getElementById("goal-modal-title").textContent = t('new_goal');
    document.getElementById("goal-submit-btn").innerHTML = `<i class="fas fa-check mr-2"></i>${t('create_goal_btn')}`;
    document.getElementById("edit-goal-id").value = "";
    document.getElementById("create-goal-modal").classList.remove("hidden");
    // Очищаем форму
    document.getElementById("create-goal-form").reset();
    // Скрываем поле количества и переключатель по умолчанию
    const quantityContainer = document.getElementById("goal-quantity-container");
    const modeSelector = document.getElementById("goal-mode-selector");
    const xpContainer = document.getElementById("goal-xp-container");
    if (quantityContainer) {
        quantityContainer.classList.add("hidden");
    }
    if (modeSelector) {
        modeSelector.classList.add("hidden");
    }
    if (xpContainer) {
        xpContainer.classList.remove("hidden");
        const xpInput = document.getElementById("goal-target-xp");
        if (xpInput) xpInput.required = true;
    }
    // Загружаем список активностей для выбора (после очистки формы)
    loadActivitiesForGoal();
    // Применяем переводы для всех элементов в модальном окне
    applyTranslations();

    // Добавляем обработчик изменения активности
    const activitySelect = document.getElementById("goal-activity");
    if (activitySelect) {
        // Удаляем старый обработчик если есть
        const newSelect = activitySelect.cloneNode(true);
        activitySelect.parentNode.replaceChild(newSelect, activitySelect);
        newSelect.addEventListener('change', updateGoalFormForActivity);
    }

    // Добавляем обработчик клика на календарь для обновления языка
    const dateInput = document.getElementById('goal-target-date');
    if (dateInput) {
        // Удаляем старые обработчики
        dateInput.removeEventListener('focus', updateDateInputLang);
        dateInput.removeEventListener('click', updateDateInputLang);
        // Добавляем новые обработчики
        dateInput.addEventListener('focus', updateDateInputLang);
        dateInput.addEventListener('click', updateDateInputLang);
    }

    // Повторно обновляем lang после небольшой задержки для гарантии
    setTimeout(() => {
        updateDateInputLang();
    }, 100);
}

function closeCreateGoalModal() {
    document.getElementById("create-goal-modal").classList.add("hidden");
    document.getElementById("create-goal-form").reset();
    document.getElementById("edit-goal-id").value = "";
}

// Функция для обновления lang атрибута календаря в зависимости от выбранного языка
function updateDateInputLang() {
    const dateInput = document.getElementById('goal-target-date');
    const goalModal = document.getElementById('create-goal-modal');
    const goalForm = document.getElementById('create-goal-form');

    // Используем полные коды локалей для правильной локализации date picker
    const langMap = {
        'ru': 'ru-RU',
        'uk': 'uk-UA',
        'de': 'de-DE',
        'en': 'en-US'
    };
    const locale = langMap[currentLanguage] || 'ru-RU';
    const shortLang = currentLanguage || 'ru';

    // Обновляем lang на HTML элементе для глобальной локализации
    if (document.documentElement) {
        document.documentElement.setAttribute('lang', shortLang);
    }

    if (dateInput) {
        // Устанавливаем lang атрибут на input и всех родительских элементах
        dateInput.setAttribute('lang', locale);
        dateInput.setAttribute('xml:lang', locale);

        // Также устанавливаем атрибут для родительских элементов
        if (goalModal) {
            goalModal.setAttribute('lang', locale);
            goalModal.setAttribute('xml:lang', locale);
        }
        if (goalForm) {
            goalForm.setAttribute('lang', locale);
            goalForm.setAttribute('xml:lang', locale);
        }
    }

    // Обновляем текст описания с форматом даты
    const deadlineDesc = document.getElementById('deadline-description-text');
    if (deadlineDesc) {
        deadlineDesc.innerHTML = `${t('deadline_description')} ${t('format_label')} <span id="date-format-text">${t('date_format_placeholder')}</span>`;
    }
}

// Функция editGoal определена в app_goals.js

// Вспомогательная функция для редактирования цели (используется только в app.js)
async function editGoalHelper(goalId) {
    try {
        // Загружаем данные цели
        const res = await fetch(`${API_BASE}/goals/`, {
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        if (!res.ok) {
            alert(t('error_loading_goals'));
            return;
        }
        const goals = await res.json();
        const goal = goals.find(g => g.id === goalId);

        if (!goal) {
            alert(t('goal_not_found'));
            return;
        }

        if (goal.is_completed === 1) {
            alert(t('cannot_edit_completed'));
            return;
        }

        // Заполняем форму данными цели
        document.getElementById("edit-goal-id").value = goal.id;
        document.getElementById("goal-title").value = goal.title;
        document.getElementById("goal-description").value = goal.description || "";
        document.getElementById("goal-target-xp").value = goal.target_xp;
        document.getElementById("goal-target-date").value = goal.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : "";
        const targetQuantityEl = document.getElementById("goal-target-quantity");
        if (targetQuantityEl) {
            targetQuantityEl.value = goal.target_quantity || "";
        }
        const completionBonusEl = document.getElementById("goal-completion-bonus");
        if (completionBonusEl) {
            completionBonusEl.value = goal.completion_bonus_xp || 0;
        }

        // Загружаем активности и выбираем нужную
        await loadActivitiesForGoal();
        if (goal.activity_id) {
            document.getElementById("goal-activity").value = goal.activity_id;
            updateGoalFormForActivity(); // Обновляем форму в зависимости от типа активности

            // Для активностей в штуках определяем режим цели
            const activity = allActivities.find(a => a.id == goal.activity_id);
            if (activity && activity.unit_type === 'quantity') {
                // Если есть target_quantity, значит режим "по количеству"
                if (goal.target_quantity && goal.target_quantity > 0) {
                    const quantityMode = document.querySelector('input[name="goal-mode"][value="quantity"]');
                    if (quantityMode) {
                        quantityMode.checked = true;
                        updateGoalModeDisplay('quantity');
                    }
                } else {
                    // Иначе режим "по XP"
                    const xpMode = document.querySelector('input[name="goal-mode"][value="xp"]');
                    if (xpMode) {
                        xpMode.checked = true;
                        updateGoalModeDisplay('xp');
                    }
                }
            }
        }

        // Обновляем lang атрибут для календаря
        updateDateInputLang();

        // Обновляем lang атрибут для календаря ДО открытия модального окна
        updateDateInputLang();

        // Меняем заголовок и кнопку
        document.getElementById("goal-modal-title").textContent = t('edit_goal');
        document.getElementById("goal-submit-btn").innerHTML = `<i class="fas fa-save mr-2"></i>${t('save_changes')}`;

        // Применяем переводы для всех элементов в модальном окне
        applyTranslations();

        // Добавляем обработчик клика на календарь для обновления языка
        const dateInput = document.getElementById('goal-target-date');
        if (dateInput) {
            // Удаляем старые обработчики
            dateInput.removeEventListener('focus', updateDateInputLang);
            dateInput.removeEventListener('click', updateDateInputLang);
            // Добавляем новые обработчики
            dateInput.addEventListener('focus', updateDateInputLang);
            dateInput.addEventListener('click', updateDateInputLang);
        }

        // Повторно обновляем lang после небольшой задержки для гарантии
        setTimeout(() => {
            updateDateInputLang();
        }, 100);

        // Открываем модальное окно
        document.getElementById("create-goal-modal").classList.remove("hidden");
    } catch (e) {
        console.error("Error loading goal for edit:", e);
        alert("Ошибка загрузки цели: " + e.message);
    }
}

async function loadActivitiesForGoal() {
    try {
        const res = await fetch(`${API_BASE}/activities/`, {
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        if (!res.ok) {
            console.error("Failed to load activities");
            return;
        }
        const data = await res.json();

        const select = document.getElementById("goal-activity");
        if (!select) {
            console.error("goal-activity select not found");
            return;
        }

        const loadingOption = select.querySelector('option[value=""]');
        if (loadingOption) {
            loadingOption.textContent = t('loading_activities');
            loadingOption.setAttribute('data-i18n', 'loading_activities');
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = t('loading_activities');
            option.setAttribute('data-i18n', 'loading_activities');
            select.appendChild(option);
        }

        if (data.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = t('create_activity_first');
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        data.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.id;
            const unitType = activity.unit_type || 'time';
            if (unitType === 'quantity') {
                option.textContent = `${activity.name} (${activity.xp_per_unit || 1} ${t('xp_per_unit')})`;
            } else {
                option.textContent = `${activity.name} (${activity.xp_per_hour} ${t('xp_per_hour')})`;
            }
            select.appendChild(option);
        });

        // Обновляем форму при изменении активности
        select.addEventListener('change', updateGoalFormForActivity);
    } catch (e) {
        console.error("Error loading activities for goal:", e);
        alert("Ошибка загрузки активностей: " + e.message);
    }
}

// Функция для переключения полей XP в зависимости от типа единицы измерения
function updateActivityXPInputs() {
    const unitTypeEl = document.getElementById("activity-unit-type");
    const xpTimeContainer = document.getElementById("activity-xp-time");
    const xpQuantityContainer = document.getElementById("activity-xp-quantity");
    const xpLabel = document.getElementById("activity-xp-label");
    const xpPerHourInput = document.getElementById("xp-per-hour");
    const xpPerUnitInput = document.getElementById("xp-per-unit");

    if (!unitTypeEl) {
        console.warn("[updateActivityXPInputs] activity-unit-type element not found");
        return;
    }

    const unitType = unitTypeEl.value;
    const t = typeof window !== 'undefined' && window.t ? window.t : (key) => key;

    console.log("[updateActivityXPInputs] Unit type changed to:", unitType);

    if (unitType === "quantity") {
        // Показываем поле для количества
        if (xpTimeContainer) xpTimeContainer.classList.add("hidden");
        if (xpQuantityContainer) xpQuantityContainer.classList.remove("hidden");
        
        // Обновляем label (если существует)
        if (xpLabel) {
            xpLabel.textContent = t('unit_quantity') || 'Количество (штуки)';
            xpLabel.setAttribute('data-i18n', 'unit_quantity');
        }
        
        // Обновляем placeholder для поля количества
        if (xpPerUnitInput) {
            xpPerUnitInput.placeholder = t('xp_per_unit') || 'XP/штука';
            xpPerUnitInput.setAttribute('data-i18n-placeholder', 'xp_per_unit');
            console.log("[updateActivityXPInputs] Updated quantity input placeholder to:", xpPerUnitInput.placeholder);
        }
    } else {
        // Показываем поле для времени
        if (xpTimeContainer) xpTimeContainer.classList.remove("hidden");
        if (xpQuantityContainer) xpQuantityContainer.classList.add("hidden");
        
        // Обновляем label (если существует)
        if (xpLabel) {
            xpLabel.textContent = t('unit_time') || 'Время (минуты)';
            xpLabel.setAttribute('data-i18n', 'unit_time');
        }
        
        // Обновляем placeholder для поля времени
        if (xpPerHourInput) {
            xpPerHourInput.placeholder = t('xp_per_hour') || 'XP/час';
            xpPerHourInput.setAttribute('data-i18n-placeholder', 'xp_per_hour');
            console.log("[updateActivityXPInputs] Updated time input placeholder to:", xpPerHourInput.placeholder);
        }
    }
}

// Экспортируем функцию в window для доступа из других скриптов
if (typeof window !== 'undefined') {
    window.updateActivityXPInputs = updateActivityXPInputs;
}

// Функция для обновления формы цели в зависимости от типа активности
function updateGoalFormForActivity() {
    const activityId = document.getElementById("goal-activity").value;
    const quantityContainer = document.getElementById("goal-quantity-container");
    const xpContainer = document.getElementById("goal-xp-container");
    const modeSelector = document.getElementById("goal-mode-selector");

    if (!activityId) {
        if (modeSelector) modeSelector.classList.add("hidden");
        if (quantityContainer) quantityContainer.classList.add("hidden");
        if (xpContainer) {
            xpContainer.classList.remove("hidden");
            const xpInput = document.getElementById("goal-target-xp");
            if (xpInput) xpInput.required = true;
        }
        return;
    }

    const activity = allActivities.find(a => a.id == activityId);
    if (activity && activity.unit_type === 'quantity') {
        // Для активностей в штуках показываем переключатель
        if (modeSelector) modeSelector.classList.remove("hidden");

        // Устанавливаем обработчики для переключателя режима
        setupGoalModeSelector();

        // По умолчанию выбираем режим "количество"
        const quantityMode = document.querySelector('input[name="goal-mode"][value="quantity"]');
        if (quantityMode) {
            quantityMode.checked = true;
            updateGoalModeDisplay('quantity');
        }
    } else {
        // Для активностей во времени скрываем переключатель и поле количества
        if (modeSelector) modeSelector.classList.add("hidden");
        if (quantityContainer) quantityContainer.classList.add("hidden");
        if (xpContainer) {
            xpContainer.classList.remove("hidden");
            const xpInput = document.getElementById("goal-target-xp");
            if (xpInput) xpInput.required = true;
        }
    }
}

// Функция для настройки переключателя режима цели
function setupGoalModeSelector() {
    const modeInputs = document.querySelectorAll('input[name="goal-mode"]');
    modeInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateGoalModeDisplay(this.value);
        });
    });
}

// Функция для обновления отображения в зависимости от выбранного режима
function updateGoalModeDisplay(mode) {
    const quantityContainer = document.getElementById("goal-quantity-container");
    const xpContainer = document.getElementById("goal-xp-container");
    const quantityInput = document.getElementById("goal-target-quantity");
    const xpInput = document.getElementById("goal-target-xp");
    const modeOptions = document.querySelectorAll('.goal-mode-option');

    // Обновляем визуальное выделение выбранного режима
    modeOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.value === mode) {
            option.classList.remove('border-gray-200');
            option.classList.add('border-purple-500', 'bg-purple-50');
        } else {
            option.classList.remove('border-purple-500', 'bg-purple-50');
            option.classList.add('border-gray-200');
        }
    });

    if (mode === 'quantity') {
        // Режим "по количеству" - показываем поле количества, скрываем XP
        if (quantityContainer) quantityContainer.classList.remove("hidden");
        if (xpContainer) xpContainer.classList.add("hidden");
        if (quantityInput) quantityInput.required = true;
        if (xpInput) xpInput.required = false;
    } else {
        // Режим "по XP" - показываем поле XP, скрываем количество
        if (quantityContainer) quantityContainer.classList.add("hidden");
        if (xpContainer) xpContainer.classList.remove("hidden");
        if (quantityInput) quantityInput.required = false;
        if (xpInput) xpInput.required = true;
    }
}

// Функция createGoal определена в app_goals.js

// Вспомогательная функция для создания цели (используется только в app.js)
async function createGoalHelper() {
    const goalId = document.getElementById("edit-goal-id").value;
    const title = document.getElementById("goal-title").value.trim();
    const description = document.getElementById("goal-description").value.trim();
    const activityId = document.getElementById("goal-activity").value;
    const targetDate = document.getElementById("goal-target-date").value;
    const targetQuantityEl = document.getElementById("goal-target-quantity");
    const targetXpEl = document.getElementById("goal-target-xp");
    const completionBonusEl = document.getElementById("goal-completion-bonus");
    const completionBonus = completionBonusEl ? parseFloat(completionBonusEl.value) || 0 : 0;

    // Название цели теперь необязательно
    // if (!title) {
    //     alert(t('fill_title_and_xp'));
    //     return;
    // }

    if (!activityId) {
        alert(t('select_activity_for_goal'));
        return;
    }

    // Определяем режим цели для активностей в штуках
    const activity = allActivities.find(a => a.id == activityId);
    let targetXp = null;
    let targetQuantity = null;

    if (activity && activity.unit_type === 'quantity') {
        // Для активностей в штуках проверяем выбранный режим
        const selectedMode = document.querySelector('input[name="goal-mode"]:checked');
        if (selectedMode && selectedMode.value === 'quantity') {
            // Режим "по количеству"
            targetQuantity = targetQuantityEl ? parseFloat(targetQuantityEl.value) : null;
            if (!targetQuantity || targetQuantity <= 0) {
        alert(t('enter_target_quantity'));
        return;
            }
            // Вычисляем target_xp на основе количества (если нужно)
            if (activity.xp_per_unit && activity.xp_per_unit > 0) {
                targetXp = targetQuantity * activity.xp_per_unit;
            } else {
                targetXp = targetQuantity; // Fallback
            }
        } else {
            // Режим "по XP"
            targetXp = targetXpEl ? parseFloat(targetXpEl.value) : null;
            if (!targetXp || targetXp <= 0) {
                alert(t('fill_title_and_xp'));
                return;
            }
            // target_quantity не устанавливаем
        }
    } else {
        // Для активностей во времени всегда используем target_xp
        targetXp = targetXpEl ? parseFloat(targetXpEl.value) : null;
        if (!targetXp || targetXp <= 0) {
            alert(t('fill_title_and_xp'));
            return;
        }
    }

    try {
        // Если есть ID - это редактирование, иначе - создание
        if (goalId) {
            // Редактирование
            const res = await fetch(`${API_BASE}/goals/${goalId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
                    target_quantity: targetQuantity || null,
                    completion_bonus_xp: completionBonus,
                    activity_id: activityId ? parseInt(activityId) : null,
                    target_date: targetDate ? new Date(targetDate).toISOString() : null
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || t('error_updating'));
            }

            closeCreateGoalModal();
            loadGoals();
            showNotification(`✅ ${t('goal_updated')}`, 'success');
        } else {
            // Создание
            const res = await fetch(`${API_BASE}/goals/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
                    target_quantity: targetQuantity || null,
                    completion_bonus_xp: completionBonus,
                    activity_id: activityId ? parseInt(activityId) : null,
                    target_date: targetDate ? new Date(targetDate).toISOString() : null
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || t('error_creating_goal'));
            }

            closeCreateGoalModal();
            loadGoals();
            showNotification(`✅ ${t('goal_created')}`, 'success');
        }
    } catch (e) {
        alert(t('error') + ": " + e.message);
    }
}

// Функция deleteGoal определена в app_goals.js

// Вспомогательная функция для удаления цели (используется только в app.js)
async function deleteGoalHelper(goalId) {
    if (!confirm(t('delete_goal_confirm'))) return;

    try {
        const token = getAuthToken();
        if (!token) {
            alert(t('auth_required'));
            return;
        }
        const res = await fetch(`${API_BASE}/goals/${goalId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(t('error_deleting'));

        loadGoals();
        showNotification(`✅ ${t('goal_deleted')}`, 'success');
    } catch (e) {
        alert(t('error_deleting_goal'));
    }
}

// ============= SOCIAL FEATURES =============

// Groups
// Функции loadGroups, loadLeaderboard, loadChallenges, loadAchievements определены в app_social.js

// Вспомогательные функции для социальных функций (используются только в app.js)
async function loadGroupsHelper() {
    console.log('[loadGroups] Starting...');
    const groupsList = document.getElementById('groups-list');
    if (!groupsList) {
        console.warn("[loadGroups] Groups list element not found");
        return;
    }

    try {
        // Безопасный доступ к функциям
        const getToken = typeof getAuthToken === 'function' ? getAuthToken : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken : () => localStorage.getItem('token') || '';
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        
        const token = getToken();
        console.log('[loadGroups] Token available:', !!token, 'API_BASE:', apiBase);
        
        if (!token) {
            console.error("[loadGroups] No auth token available");
            groupsList.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            return;
        }

        console.log('[loadGroups] Fetching from:', `${apiBase}/groups/`);
        const res = await fetch(`${apiBase}/groups/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log('[loadGroups] Response status:', res.status);

        if (!res.ok) throw new Error('Failed to load groups');

        const groups = await res.json();
        
        if (groups.length === 0) {
            groupsList.innerHTML = '<div class="text-center text-gray-400 py-4">У вас пока нет групп</div>';
            return;
        }

        groupsList.innerHTML = groups.map(group => `
            <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-gray-800">${escapeHtml(group.name)}</h3>
                    ${group.role === 'owner' ? '<span class="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Владелец</span>' : ''}
                </div>
                <p class="text-sm text-gray-600 mb-2">Код: <code class="bg-white px-2 py-1 rounded">${escapeHtml(group.invite_code)}</code></p>
                <p class="text-xs text-gray-500 mb-3">Участников: ${group.member_count || 0}</p>
                <div class="flex gap-2">
                    <button onclick="viewGroupMembers(${group.id})" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm transition-all">
                        <i class="fas fa-users"></i> Участники
                    </button>
                    ${group.role !== 'owner' ? `
                        <button onclick="leaveGroup(${group.id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm transition-all">
                            <i class="fas fa-sign-out-alt"></i> Выйти
                        </button>
                    ` : `
                        <button onclick="deleteGroup(${group.id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm transition-all">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    `}
                </div>
            </div>
        `).join('');
    } catch (e) {
        groupsList.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки групп</div>';
    }
}

function openCreateGroupModal() {
    document.getElementById('create-group-modal').classList.remove('hidden');
    document.getElementById('group-name').value = '';
}

function closeCreateGroupModal() {
    document.getElementById('create-group-modal').classList.add('hidden');
}

async function createGroup() {
    const name = document.getElementById('group-name').value.trim();
    if (!name) {
        alert('Введите название группы');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/groups/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ name })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Ошибка создания группы');
        }

        closeCreateGroupModal();
        loadGroups();
        showNotification('✅ Группа создана', 'success');
    } catch (e) {
        alert('Ошибка: ' + e.message);
    }
}

function openJoinGroupModal() {
    document.getElementById('join-group-modal').classList.remove('hidden');
    document.getElementById('invite-code').value = '';
}

function closeJoinGroupModal() {
    document.getElementById('join-group-modal').classList.add('hidden');
}

async function joinGroup() {
    const inviteCode = document.getElementById('invite-code').value.trim();
    if (!inviteCode) {
        alert('Введите код приглашения');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/groups/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ invite_code: inviteCode })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Ошибка присоединения к группе');
        }

        closeJoinGroupModal();
        loadGroups();
        loadLeaderboard(); // Обновить лидерборд
        showNotification('✅ Вы присоединились к группе', 'success');
    } catch (e) {
        alert('Ошибка: ' + e.message);
    }
}

async function viewGroupMembers(groupId) {
    try {
        const res = await fetch(`${API_BASE}/groups/${groupId}/members`, {
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });

        if (!res.ok) throw new Error('Failed to load members');

        const members = await res.json();
        const membersList = members.map(m => `${m.username} (${m.role})`).join(', ');
        alert(`Участники группы:\n\n${membersList}`);
    } catch (e) {
        alert('Ошибка загрузки участников');
    }
}

async function leaveGroup(groupId) {
    if (!confirm('Вы уверены, что хотите покинуть группу?')) return;

    try {
        const token = getAuthToken();
        if (!token) {
            alert('Требуется авторизация');
            return;
        }
        const res = await fetch(`${API_BASE}/groups/${groupId}/leave`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to leave group');

        loadGroups();
        loadLeaderboard();
        showNotification('✅ Вы покинули группу', 'success');
    } catch (e) {
        alert('Ошибка выхода из группы');
    }
}

async function deleteGroup(groupId) {
    if (!confirm('Вы уверены, что хотите удалить группу? Это действие нельзя отменить.')) return;

    try {
        const token = getAuthToken();
        if (!token) {
            alert('Требуется авторизация');
            return;
        }
        const res = await fetch(`${API_BASE}/groups/${groupId}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to delete group');

        loadGroups();
        loadLeaderboard();
        showNotification('✅ Группа удалена', 'success');
    } catch (e) {
        alert('Ошибка удаления группы');
    }
}

// Leaderboard
// Функция loadLeaderboard определена в app_social.js

// Вспомогательная функция для загрузки таблицы лидеров (используется только в app.js)
async function loadLeaderboardHelper() {
    const leaderboardList = document.getElementById('leaderboard-list');
    const groupSelect = document.getElementById('leaderboard-group-select');
    const sortSelect = document.getElementById('leaderboard-sort-select');
    
    if (!leaderboardList || !groupSelect || !sortSelect) return;

    const groupId = groupSelect.value === 'global' ? null : groupSelect.value;
    const sortBy = sortSelect.value;

    try {
        // Загрузить список групп для селекта
        const token = getAuthToken();
        if (!token) {
            leaderboardList.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            return;
        }
        if (groupSelect.children.length <= 1) {
            const groupsRes = await fetch(`${API_BASE}/groups/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (groupsRes.ok) {
                const groups = await groupsRes.json();
                groups.forEach(group => {
                    const option = document.createElement('option');
                    option.value = group.id;
                    option.textContent = group.name;
                    groupSelect.appendChild(option);
                });
            }
        }

        const url = groupId 
            ? `${API_BASE}/leaderboard/group/${groupId}?sort_by=${sortBy}`
            : `${API_BASE}/leaderboard/global?sort_by=${sortBy}`;
        
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to load leaderboard');

        const leaderboard = await res.json();
        
        if (leaderboard.length === 0) {
            leaderboardList.innerHTML = '<div class="text-center text-gray-400 py-4">Нет данных</div>';
            return;
        }

        leaderboardList.innerHTML = leaderboard.map((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            const isCurrentUser = entry.user_id === parseInt(localStorage.getItem('userId') || '0');
            const bgColor = isCurrentUser ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200';
            
            return `
                <div class="p-4 ${bgColor} rounded-xl border-2 hover:shadow-md transition-all">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">${medal || `#${index + 1}`}</span>
                            <div>
                                <h3 class="font-bold text-gray-800">${escapeHtml(entry.username)}${isCurrentUser ? ' (Вы)' : ''}</h3>
                                <p class="text-sm text-gray-600">Уровень ${entry.level || 0}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-amber-600">${formatNumber(entry.value || 0)}</p>
                            <p class="text-xs text-gray-500">${getSortLabel(sortBy)}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        leaderboardList.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки лидерборда</div>';
    }
}

function getSortLabel(sortBy) {
    const labels = {
        balance: 'Баланс XP',
        level: 'Уровень',
        total_earned: 'Всего заработано',
        streak: 'Серия дней',
        today_xp: 'Сегодня',
        week_xp: 'Неделя',
        month_xp: 'Месяц'
    };
    return labels[sortBy] || sortBy;
}

// Challenges
// Функция loadChallenges определена в app_social.js

// Вспомогательная функция для загрузки челленджей (используется только в app.js)
async function loadChallengesHelper() {
    console.log('[loadChallenges] Starting...');
    const challengesList = document.getElementById('challenges-list');
    if (!challengesList) {
        console.warn("[loadChallenges] Challenges list element not found");
        return;
    }

    try {
        // Безопасный доступ к функциям
        const getToken = typeof getAuthToken === 'function' ? getAuthToken : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken : () => localStorage.getItem('token') || '';
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        
        const token = getToken();
        console.log('[loadChallenges] Token available:', !!token, 'API_BASE:', apiBase);
        
        if (!token) {
            console.error("[loadChallenges] No auth token available");
            challengesList.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            return;
        }

        console.log('[loadChallenges] Fetching from:', `${apiBase}/challenges/`);
        const res = await fetch(`${apiBase}/challenges/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log('[loadChallenges] Response status:', res.status);

        if (!res.ok) throw new Error('Failed to load challenges');

        const challenges = await res.json();
        
        if (challenges.length === 0) {
            challengesList.innerHTML = '<div class="text-center text-gray-400 py-4">Нет активных челленджей</div>';
            return;
        }

        challengesList.innerHTML = challenges.map(challenge => {
            const progress = calculateChallengeProgress(challenge);
            const isParticipant = challenge.is_participant || false;
            
            return `
                <div class="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800 mb-1">${escapeHtml(challenge.title)}</h3>
                            ${challenge.description ? `<p class="text-sm text-gray-600 mb-2">${escapeHtml(challenge.description)}</p>` : ''}
                        </div>
                        ${challenge.is_active ? '<span class="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Активен</span>' : '<span class="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">Завершен</span>'}
                    </div>
                    <div class="mb-3 space-y-1">
                        ${challenge.target_xp ? `<p class="text-xs text-gray-600">Цель XP: ${formatNumber(challenge.target_xp)} (${progress.xp}%)</p>` : ''}
                        ${challenge.target_time_minutes ? `<p class="text-xs text-gray-600">Цель времени: ${challenge.target_time_minutes} мин (${progress.time}%)</p>` : ''}
                        ${challenge.target_streak_days ? `<p class="text-xs text-gray-600">Цель серии: ${challenge.target_streak_days} дней (${progress.streak}%)</p>` : ''}
                    </div>
                    <p class="text-xs text-gray-500 mb-3">${formatDate(challenge.start_date)} - ${formatDate(challenge.end_date)}</p>
                    <div class="flex gap-2">
                        ${!isParticipant ? `
                            <button onclick="joinChallenge(${challenge.id})" class="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm transition-all">
                                <i class="fas fa-sign-in-alt"></i> Присоединиться
                            </button>
                        ` : `
                            <button onclick="viewChallengeProgress(${challenge.id})" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm transition-all">
                                <i class="fas fa-chart-line"></i> Прогресс
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        challengesList.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки челленджей</div>';
    }
}

function calculateChallengeProgress(challenge) {
    const participant = challenge.participant || {};
    return {
        xp: challenge.target_xp ? Math.round((participant.current_xp || 0) / challenge.target_xp * 100) : 0,
        time: challenge.target_time_minutes ? Math.round((participant.current_time_minutes || 0) / challenge.target_time_minutes * 100) : 0,
        streak: challenge.target_streak_days ? Math.round((participant.current_streak_days || 0) / challenge.target_streak_days * 100) : 0
    };
}

function openCreateChallengeModal() {
    const modal = document.getElementById('create-challenge-modal');
    const groupSelect = document.getElementById('challenge-group-select');
    
    modal.classList.remove('hidden');
    
    // Загрузить список групп
    groupSelect.innerHTML = '<option value="">Выберите группу</option>';
    fetch(`${API_BASE}/groups/`, {
        headers: { "Authorization": `Bearer ${authToken}` }
    })
    .then(res => res.json())
    .then(groups => {
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });
    })
    .catch(() => {});
    
    // Установить даты по умолчанию
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('challenge-start-date').value = today;
    document.getElementById('challenge-end-date').value = nextWeek;
}

function closeCreateChallengeModal() {
    document.getElementById('create-challenge-modal').classList.add('hidden');
}

async function createChallenge() {
    const groupId = document.getElementById('challenge-group-select').value;
    const title = document.getElementById('challenge-title').value.trim();
    const description = document.getElementById('challenge-description').value.trim();
    const targetXp = document.getElementById('challenge-target-xp').value;
    const targetTime = document.getElementById('challenge-target-time').value;
    const targetStreak = document.getElementById('challenge-target-streak').value;
    const startDate = document.getElementById('challenge-start-date').value;
    const endDate = document.getElementById('challenge-end-date').value;

    if (!groupId || !title || !startDate || !endDate) {
        alert('Заполните все обязательные поля');
        return;
    }

    if (!targetXp && !targetTime && !targetStreak) {
        alert('Укажите хотя бы одну цель (XP, время или серия)');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/challenges/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                group_id: parseInt(groupId),
                title,
                description: description || null,
                target_xp: targetXp ? parseInt(targetXp) : null,
                target_time_minutes: targetTime ? parseInt(targetTime) : null,
                target_streak_days: targetStreak ? parseInt(targetStreak) : null,
                start_date: startDate,
                end_date: endDate
            })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Ошибка создания челленджа');
        }

        closeCreateChallengeModal();
        loadChallenges();
        showNotification('✅ Челлендж создан', 'success');
    } catch (e) {
        alert('Ошибка: ' + e.message);
    }
}

async function joinChallenge(challengeId) {
    try {
        const token = getAuthToken();
        if (!token) {
            alert('Требуется авторизация');
            return;
        }
        const res = await fetch(`${API_BASE}/challenges/${challengeId}/join`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Ошибка присоединения к челленджу');
        }

        loadChallenges();
        showNotification('✅ Вы присоединились к челленджу', 'success');
    } catch (e) {
        alert('Ошибка: ' + e.message);
    }
}

async function viewChallengeProgress(challengeId) {
    try {
        const token = getAuthToken();
        if (!token) {
            alert('Требуется авторизация');
            return;
        }
        const res = await fetch(`${API_BASE}/challenges/${challengeId}/participants`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to load participants');

        const participants = await res.json();
        const participantsList = participants.map(p => 
            `${p.username}: XP ${p.current_xp || 0}, Время ${p.current_time_minutes || 0} мин, Серия ${p.current_streak_days || 0} дней`
        ).join('\n');
        
        alert(`Прогресс участников:\n\n${participantsList}`);
    } catch (e) {
        alert('Ошибка загрузки прогресса');
    }
}

// Achievements
// Функция loadAchievements определена в app_social.js

// Вспомогательная функция для загрузки достижений (используется только в app.js)
async function loadAchievementsHelper() {
    const achievementsList = document.getElementById('achievements-list');
    const groupSelect = document.getElementById('achievements-group-select');
    
    if (!achievementsList || !groupSelect) return;

    const filter = groupSelect.value === 'my' ? 'my' : groupSelect.value === 'shared' ? 'shared' : 'all';
    const groupId = groupSelect.value !== 'my' && groupSelect.value !== 'shared' && groupSelect.value ? groupSelect.value : null;

    try {
        console.log('[loadAchievements] Starting...');
        // Безопасный доступ к функциям
        const getToken = typeof getAuthToken === 'function' ? getAuthToken : (typeof window !== 'undefined' && window.getAuthToken) ? window.getAuthToken : () => localStorage.getItem('token') || '';
        const apiBase = typeof API_BASE !== 'undefined' ? API_BASE : (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : window.location.origin;
        
        const token = getToken();
        console.log('[loadAchievements] Token available:', !!token, 'API_BASE:', apiBase);
        
        if (!token) {
            console.error("[loadAchievements] No auth token available");
            achievementsList.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            return;
        }
        
        if (groupSelect.children.length <= 2) {
            console.log('[loadAchievements] Fetching groups from:', `${apiBase}/groups/`);
            const groupsRes = await fetch(`${apiBase}/groups/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (groupsRes.ok) {
                const groups = await groupsRes.json();
                groups.forEach(group => {
                    const option = document.createElement('option');
                    option.value = group.id;
                    option.textContent = group.name;
                    groupSelect.appendChild(option);
                });
            }
        }

        let url = `${apiBase}/achievements/?filter=${filter}`;
        if (groupId) url += `&group_id=${groupId}`;
        
        console.log('[loadAchievements] Fetching achievements from:', url);
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        console.log('[loadAchievements] Response status:', res.status);

        if (!res.ok) throw new Error('Failed to load achievements');

        const achievements = await res.json();
        
        if (achievements.length === 0) {
            achievementsList.innerHTML = '<div class="text-center text-gray-400 py-4">Нет достижений</div>';
            return;
        }

        achievementsList.innerHTML = achievements.map(achievement => `
            <div class="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:shadow-md transition-all">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                            ${achievement.icon || '🏆'}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800">${escapeHtml(achievement.name)}</h3>
                            <p class="text-sm text-gray-600">${escapeHtml(achievement.description || '')}</p>
                        </div>
                    </div>
                    ${achievement.is_shared ? '<span class="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Поделился</span>' : ''}
                </div>
                <div class="flex items-center justify-between mt-3">
                    <span class="text-sm text-gray-600">+${formatNumber(achievement.xp_reward || 0)} XP</span>
                    <span class="text-xs text-gray-500">${formatDate(achievement.created_at)}</span>
                </div>
                ${!achievement.is_shared ? `
                    <button onclick="shareAchievement(${achievement.id})" class="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm transition-all">
                        <i class="fas fa-share"></i> Поделиться
                    </button>
                ` : `
                    <button onclick="unshareAchievement(${achievement.id})" class="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-all">
                        <i class="fas fa-share-slash"></i> Убрать из общего доступа
                    </button>
                `}
            </div>
        `).join('');
    } catch (e) {
        achievementsList.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки достижений</div>';
    }
}

async function shareAchievement(achievementId) {
    try {
        const res = await fetch(`${API_BASE}/achievements/${achievementId}/share`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });

        if (!res.ok) throw new Error('Failed to share achievement');

        loadAchievements();
        showNotification('✅ Достижение опубликовано', 'success');
    } catch (e) {
        alert('Ошибка публикации достижения');
    }
}

async function unshareAchievement(achievementId) {
    try {
        const res = await fetch(`${API_BASE}/achievements/${achievementId}/unshare`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });

        if (!res.ok) throw new Error('Failed to unshare achievement');

        loadAchievements();
        showNotification('✅ Достижение скрыто', 'success');
    } catch (e) {
        alert('Ошибка скрытия достижения');
    }
}

// Helper functions (escapeHtml, formatNumber, formatDate) определены в app_utils.js