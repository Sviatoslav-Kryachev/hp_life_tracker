// ============= UTILITIES MODULE =============
// Общие утилиты, переводы, форматирование

// Автоматически определяем базовый URL API из текущего домена
const API_BASE = window.location.origin;

// ============= I18N (INTERNATIONALIZATION) =============
// Переводы вынесены в отдельный файл для удобства
// ВАЖНО: Этот объект должен быть загружен до использования функции t()
const translations = {
    ru: {
        // Header
        "level": "Ур.",
        "activities": "Активности",
        "rewards": "Награды",
        "history": "История",
        "goals": "Мои цели",
        "admin_panel": "Админ-панель",
        "logout": "Выход",
        "telegram_bot": "Открыть Telegram бота",
        "link_telegram": "Привязать Telegram",
        "link_telegram_title": "Привязать Telegram аккаунт",
        "telegram_link_instructions": "Чтобы привязать Telegram аккаунт:",
        "telegram_link_step1": "Откройте бота в Telegram и отправьте /start",
        "telegram_link_step2": "Скопируйте ваш Telegram ID из сообщения бота",
        "telegram_link_step3": "Вставьте его в поле ниже и нажмите \"Привязать\"",
        "telegram_id_label": "Telegram ID:",
        "telegram_id_hint": "Ваш Telegram ID был показан ботом в сообщении",
        "link_button": "Привязать",
        "telegram_linked": "Telegram аккаунт привязан",
        "telegram_linked_success": "Telegram аккаунт успешно привязан!",
        "enter_telegram_id": "Введите Telegram ID",
        "invalid_telegram_id": "Некорректный Telegram ID",
        "error_linking": "Ошибка привязки аккаунта",

        // Auth
        "login": "Вход",
        "register": "Регистрация",
        "email": "Email",
        "password": "Пароль",
        "username": "Имя пользователя",
        "confirm_password": "Подтвердите пароль",
        "forgot_password": "Забыли пароль?",
        "enter": "Войти",
        "create_account": "Зарегистрироваться",

        // Activities
        "new_activity": "➕ Новая активность",
        "activity_name": "Название активности",
        "xp_per_hour": "XP/час",
        "xp_per_unit": "XP/штука",
        "unit_time": "Время (минуты)",
        "unit_quantity": "Количество (штуки)",
        "create": "Создать",
        "edit": "Редактировать",
        "delete": "Удалить",
        "start": "Старт",
        "stop": "Стоп",
        "time": "Время",
        "sessions": "Сессий",
        "manual_quantity": "Ручной ввод количества",
        "minutes_placeholder": "Минут",
        "quantity_placeholder": "Введите к-во",
        "enter_quantity": "Введите количество",
        "enter_minutes": "Введите минуты",
        "error_adding": "Ошибка добавления",
        "units": "штук",

        // Rewards
        "reward_name": "Название награды",
        "create_reward": "Создать награду",
        "quick_select": "Быстрый выбор",
        "custom_reward": "Своя награда",
        "spend_xp": "Потрать XP на удовольствия",
        "buy": "Купить",
        "edit_reward": "✏️ Редактировать награду",
        "reward_name_placeholder": "Название",
        "xp_cost_placeholder": "XP стоимость",
        "save_reward": "Сохранить",
        "reward_updated": "Награда обновлена!",
        "error_updating_reward": "Ошибка обновления",
        "enter_correct_name_cost": "Введите корректное название и стоимость",

        // History
        "transaction_history": "История транзакций",
        "all_xp_operations": "Все операции с XP",
        "show_all_history": "Показать всю историю",
        "hide_history": "Скрыть историю",
        "show_all_rewards": "Показать все награды",
        "hide_rewards": "Скрыть награды",
        "show_all_activities": "Показать все активности",
        "hide_activities": "Скрыть активности",
        "earned": "Заработано",
        "spent": "Потрачено",
        "at_time": "в",
        "filter_period": "Период",
        "all": "Все",

        // Stats
        "today": "Сегодня",
        "earned_xp": "Заработано XP",
        "spent_xp": "Потрачено XP",
        "calendar": "Календарь",
        "week": "Неделя",
        "month": "Месяц",
        "year": "Год",
        "progress": "Прогресс",
        "to_level": "До уровня",
        "total_earned": "Всего заработано",
        "streak_days": "Серия дней",
        "days": "дней",
        "record": "Рекорд:",
        "start_activity": "Начните активность!",
        "start_streak_message": "Начните активность, чтобы начать серию!",
        "streak_1_day": "🔥 Отличное начало! Продолжайте завтра!",
        "streak_days_in_row": "🔥 {days} дней подряд! Продолжайте!",
        "streak_week": "🔥 Неделя подряд! Вы получаете бонусы XP!",
        "streak_month": "🔥 Месяц без пропусков! Вы получаете +100 XP бонус!",
        // Week days
        "mon": "Пн",
        "tue": "Вт",
        "wed": "Ср",
        "thu": "Чт",
        "fri": "Пт",
        "sat": "Сб",
        "sun": "Вс",
        // Months
        "month_jan": "Янв",
        "month_feb": "Фев",
        "month_mar": "Мар",
        "month_apr": "Апр",
        "month_may": "Май",
        "month_jun": "Июн",
        "month_jul": "Июл",
        "month_aug": "Авг",
        "month_sep": "Сен",
        "month_oct": "Окт",
        "month_nov": "Ноя",
        "month_dec": "Дек",
        // Categories
        "category_general": "Общее",
        "category_study": "Учеба",
        "category_sport": "Спорт",
        "category_hobby": "Хобби",
        "category_work": "Работа",
        "category_health": "Здоровье",

        // Goals
        "my_goals": "Мои цели",
        "new_goal": "🎯 Новая цель",
        "edit_goal": "✏️ Редактировать цель",
        "goal_title": "Название цели",
        "target_xp": "Целевое количество XP",
        "target_quantity": "К-во для достижения",
        "target_quantity_description": "Целевое количество (для активностей в штуках)",
        "completion_bonus_xp": "Бонус XP за достижение цели",
        "completion_bonus_xp_description": "Дополнительный бонус XP при достижении цели",
        "enter_target_quantity": "Введите целевое количество",
        "description": "Описание (необязательно)",
        "deadline": "Дедлайн (необязательно)",
        "create_goal": "Создать цель",
        "goal_completed_congratulations": "🎉 Поздравляем! Вы достигли цели!",
        "goal_completed_bonus": "Бонус за достижение цели",
        "important": "Важно:",
        "goal_info_text": "Выберите активность из вашего списка. Цель будет отслеживать прогресс только по этой активности.",
        "select_activity_label": "Выберите активность",
        "loading_activities": "-- Загрузка активностей --",
        "create_activity_first": "Сначала создайте активность, если её нет в списке",
        "goal_title_placeholder": "Например: Изучить 100 часов немецкого",
        "target_xp_description": "Сколько XP нужно заработать для достижения цели",
        "goal_description_placeholder": "Дополнительная информация о цели",
        "deadline_description": "Установите дату, к которой хотите достичь цели",
        "date_format_placeholder": "дд.мм.гггг",
        "format_label": "Формат:",
        "save_changes": "Сохранить изменения",

        // Common
        "save": "Сохранить",
        "cancel": "Отмена",
        "close": "Закрыть",
        "loading": "Загрузка...",
        "empty": "Пусто",
        // Footer
        "about_project": "О проекте",
        "project_description": "Система отслеживания активности и мотивации через XP. Достигайте целей и зарабатывайте награды!",
        "navigation": "Навигация",
        "features": "Функции",
        "tools": "Инструменты",
        "settings": "Настройки",
        "language": "Язык",
        "manual_time": "Ручной ввод времени",
        "manage_categories": "Управление категориями",
        "refresh_data": "Обновить данные",
        "data_updated": "✅ Данные обновлены!",
        "timer": "Таймер",
        "streak_system": "Система серий (Streak)",
        "smart_recommendations": "Умные рекомендации",
        "recommendations": "Рекомендации",
        "blacklist": "Черный список наград",
        "goals_system": "Система целей",
        "calendar_stats": "Календарь активности",
        "category_stats": "Статистика по категориям",
        "add_category": "Добавить категорию",
        "add": "Добавить",
        // Recommendations messages
        "rec_continue": "Вчера вы делали '{activity}' - продолжите серию! 🔥",
        "rec_reminder": "Вы {days} дней не занимались '{activity}' - время вернуться!",
        "rec_more": "Сегодня вы занимались '{activity}' {minutes} минут - можно ещё!",
        "rec_new": "Попробуйте '{activity}' - вы ещё не начинали эту активность!",
        "rec_info": "Создайте первую активность, чтобы начать зарабатывать XP!",
        "yesterday": "Вчера",
        "continue_streak": "продолжите серию",
        "days_not_practiced": "дней не занимались",
        "time_to_return": "время вернуться",
        "today_practiced": "Сегодня вы занимались",
        "minutes": "минут",
        "can_more": "можно ещё",
        "try_activity": "Попробуйте",
        "not_started": "вы ещё не начинали эту активность",
        "create_first_activity": "Создайте первую активность, чтобы начать зарабатывать XP!",
        "auth_required": "Требуется авторизация",
        "error_loading_recommendations": "Ошибка загрузки рекомендаций",
        "no_recommendations": "Нет рекомендаций. Продолжайте заниматься!",
        "start_tracking": "Начать отслеживание",
        "click_for_details": "Кликните для деталей",
        // Day details modal
        "earned": "Заработано",
        "spent": "Потрачено",
        "activity_time": "Время активности",
        "total": "Итого",
        "earnings": "Заработки",
        "sessions": "сессий",
        "spendings": "Расходы",
        "purchases": "покупок",
        "no_activity_today": "Нет активности в этот день",
        "error_loading_data": "Ошибка загрузки данных",
        "edit_activity": "Редактировать активность",
        "enter_activity_name": "Введите название активности",
        "activity_updated": "Активность обновлена!",
        "error_updating": "Ошибка обновления",
        "network_error": "Ошибка сети",
        // Goal modal
        "edit_goal": "Редактировать цель",
        "goal_not_found": "Цель не найдена",
        "cannot_edit_completed": "Нельзя редактировать выполненную цель",
        "error_loading_goals": "Ошибка загрузки целей",
        "create_goal_btn": "Создать цель",
        // Notifications
        "reward_purchased": "Награда \"{reward}\" куплена! Потрачено {spent} XP",
        "reward_received": "{reward} получена! Минус {spent} XP. Баланс: {balance} XP",
        "activity_started": "Запущена активность \"{activity}\"! Прокрутите к разделу \"Активности\" чтобы увидеть таймер.",
        "connection_error": "Ошибка соединения. Проверьте сервер.",
        "activity_saved": "Активность сохранена!",
        "activity_deleted": "Активность удалена!",
        "goal_created": "Цель создана!",
        "goal_updated": "Цель обновлена!",
        "goal_deleted": "Цель удалена!",
        "scroll_to_activities": "Прокрутите к разделу \"Активности\" чтобы увидеть таймер",
        "no_goals": "Нет целей. Создайте первую цель!",
        "fill_title_and_xp": "Заполните название и целевое количество XP",
        "select_activity_for_goal": "Пожалуйста, выберите активность для цели",
        "error_creating_goal": "Ошибка создания цели",
        "delete_goal_confirm": "Удалить эту цель?",
        "error_deleting": "Ошибка удаления",
        "error_deleting_goal": "Ошибка удаления цели",
        "error": "Ошибка",
        // Admin panel
        "invite_link": "Ссылка для приглашения",
        "copy": "Копировать",
        "send_link_to_daughter": "Отправьте эту ссылку дочери для регистрации",
        "filter_by_category": "Фильтр по категориям активностей",
        "all_categories": "Все категории",
        "sort_label": "Сортировка:",
        "sort_newest": "⬆️ Сначала новые",
        "sort_oldest": "Сначала старые",
        "sort_name_asc": "По имени (А-Я)",
        "sort_name_desc": "По имени (Я-А)",
        "category_label": "Категория:",
        "all_categories_with_icon": "📂 Все категории",
        "reset_filters": "Сбросить",
        "children": "Подопечные",
        "stats": "Статистика",
        "access_denied": "Доступ запрещён. Только администраторы могут просматривать админ-панель.",
        "error_checking_access": "Ошибка проверки прав доступа.",
        "error_loading": "Ошибка загрузки",
        "error_loading_stats": "Ошибка загрузки статистики",
        // Child stats modal
        "stats_for": "Статистика:",
        "balance_xp": "Баланс XP",
        "level": "Уровень",
        "level_text": "Уровень",
        "current_streak": "Текущая серия",
        "current_streak_text": "Серия дней",
        "activities_count_text": "Активностей",
        "activities": "Активности",
        "no_category_data": "Нет данных по категориям",
        "no_activities_text": "Нет активностей",
        "no_goals_text": "Нет целей",
        "general_stats": "Общая статистика",
        "total_earned": "Всего заработано:",
        "total_spent": "Всего потрачено:",
        "record_streak": "Рекорд серии:",
        "days_active": "Дней активности:",
        "today": "Сегодня",
        "earned": "Заработано:",
        "time": "Время:",
        "minutes": "минут",
        "week": "За неделю:",
        "recent_transactions": "Последние транзакции",
        "history_empty": "История пуста",
        "category_stats_week": "Статистика по категориям (неделя)",
        "min_short": "мин",
        "activities_count": "активностей",
        "days_short": "дн.",
        "today_exclamation": "Сегодня!",
        "overdue": "Просрочено",
        "completed": "Выполнено"
    },
    // Добавлены сокращенные версии для других языков (uk, de, en)
    // Полные версии можно добавить позже
    uk: {},
    de: {},
    en: {}
};

// Загружаем полные переводы из основного файла при необходимости
// Пока используем только русский язык

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
    localStorage.setItem('language', lang);
    applyTranslations();
    updateLanguageMenu();
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

function updateLanguageMenu() {
    document.querySelectorAll('[data-check]').forEach(check => {
        check.classList.add('hidden');
    });
    document.querySelectorAll('[data-check-footer]').forEach(check => {
        check.classList.add('hidden');
    });
    const activeCheck = document.querySelector(`[data-check="${currentLanguage}"]`);
    if (activeCheck) {
        activeCheck.classList.remove('hidden');
    }
    const activeCheckFooter = document.querySelector(`[data-check-footer="${currentLanguage}"]`);
    if (activeCheckFooter) {
        activeCheckFooter.classList.remove('hidden');
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
