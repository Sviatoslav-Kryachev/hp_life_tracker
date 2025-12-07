const API_BASE = "http://127.0.0.1:8000";

// ============= I18N (INTERNATIONALIZATION) =============
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
        "create": "Создать",
        "edit": "Редактировать",
        "delete": "Удалить",
        "start": "Старт",
        "stop": "Стоп",
        "time": "Время",
        "sessions": "Сессий",
        
        // Rewards
        "reward_name": "Название награды",
        "create_reward": "Создать награду",
        "quick_select": "Быстрый выбор",
        "custom_reward": "Своя награда",
        "spend_xp": "Потрать XP на удовольствия",
        
        // History
        "transaction_history": "История транзакций",
        "all_xp_operations": "Все операции с XP",
        "show_all_history": "Показать всю историю",
        "hide_history": "Скрыть историю",
        "show_all_rewards": "Показать все награды",
        "hide_rewards": "Скрыть награды",
        "earned": "Заработано",
        "spent": "Потрачено",
        
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
        "goal_title": "Название цели",
        "target_xp": "Целевое количество XP",
        "description": "Описание (необязательно)",
        "deadline": "Дедлайн (необязательно)",
        "create_goal": "Создать цель",
        
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
        "current_streak": "Текущая серия",
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
        "category_stats_week": "Статистика по категориям (неделя)"
    },
    uk: {
        // Header
        "level": "Рів.",
        "activities": "Активності",
        "rewards": "Нагороди",
        "history": "Історія",
        "goals": "Мої цілі",
        "admin_panel": "Адмін-панель",
        "logout": "Вихід",
        "telegram_bot": "Відкрити Telegram бота",
        
        // Auth
        "login": "Вхід",
        "register": "Реєстрація",
        "email": "Email",
        "password": "Пароль",
        "username": "Ім'я користувача",
        "confirm_password": "Підтвердіть пароль",
        "forgot_password": "Забули пароль?",
        "enter": "Увійти",
        "create_account": "Зареєструватися",
        
        // Activities
        "new_activity": "➕ Нова активність",
        "activity_name": "Назва активності",
        "xp_per_hour": "XP/година",
        "create": "Створити",
        "edit": "Редагувати",
        "delete": "Видалити",
        "start": "Старт",
        "stop": "Стоп",
        "time": "Час",
        "sessions": "Сесій",
        
        // Rewards
        "reward_name": "Назва нагороди",
        "create_reward": "Створити нагороду",
        "quick_select": "Швидкий вибір",
        "custom_reward": "Своя нагорода",
        "spend_xp": "Витрать XP на задоволення",
        
        // History
        "transaction_history": "Історія транзакцій",
        "all_xp_operations": "Всі операції з XP",
        "show_all_history": "Показати всю історію",
        "hide_history": "Приховати історію",
        "show_all_rewards": "Показати всі нагороди",
        "hide_rewards": "Приховати нагороди",
        "earned": "Зароблено",
        "spent": "Витрачено",
        
        // Stats
        "today": "Сьогодні",
        "earned_xp": "Зароблено XP",
        "spent_xp": "Витрачено XP",
        "calendar": "Календар",
        "week": "Тиждень",
        "month": "Місяць",
        "year": "Рік",
        "progress": "Прогрес",
        "to_level": "До рівня",
        "total_earned": "Всього зароблено",
        "streak_days": "Серія днів",
        "days": "днів",
        "record": "Рекорд:",
        "start_activity": "Почніть активність!",
        // Week days
        "mon": "Пн",
        "tue": "Вт",
        "wed": "Ср",
        "thu": "Чт",
        "fri": "Пт",
        "sat": "Сб",
        "sun": "Нд",
        // Months
        "month_jan": "Січ",
        "month_feb": "Лют",
        "month_mar": "Бер",
        "month_apr": "Кві",
        "month_may": "Тра",
        "month_jun": "Чер",
        "month_jul": "Лип",
        "month_aug": "Сер",
        "month_sep": "Вер",
        "month_oct": "Жов",
        "month_nov": "Лис",
        "month_dec": "Гру",
        // Categories
        "category_general": "Загальне",
        "category_study": "Навчання",
        "category_sport": "Спорт",
        "category_hobby": "Хобі",
        "category_work": "Робота",
        "category_health": "Здоров'я",
        
        // Goals
        "my_goals": "Мої цілі",
        "new_goal": "🎯 Нова ціль",
        "goal_title": "Назва цілі",
        "target_xp": "Цільова кількість XP",
        "description": "Опис (необов'язково)",
        "deadline": "Дедлайн (необов'язково)",
        "create_goal": "Створити ціль",
        
        // Common
        "save": "Зберегти",
        "cancel": "Скасувати",
        "close": "Закрити",
        "loading": "Завантаження...",
        "empty": "Порожньо",
        // Footer
        "about_project": "Про проект",
        "project_description": "Система відстеження активності та мотивації через XP. Досягайте цілей і заробляйте нагороди!",
        "navigation": "Навігація",
        "features": "Функції",
        "tools": "Інструменти",
        "settings": "Налаштування",
        "language": "Мова",
        "manual_time": "Ручний ввід часу",
        "manage_categories": "Управління категоріями",
        "refresh_data": "Оновити дані",
        "data_updated": "✅ Дані оновлено!",
        "timer": "Таймер",
        "streak_system": "Система серій (Streak)",
        "smart_recommendations": "Розумні рекомендації",
        "recommendations": "Рекомендації",
        "blacklist": "Чорний список нагород",
        "goals_system": "Система цілей",
        "calendar_stats": "Календар активності",
        "category_stats": "Статистика за категоріями",
        "add_category": "Додати категорію",
        // Recommendations messages
        "rec_continue": "Вчора ви робили '{activity}' - продовжте серію! 🔥",
        "rec_reminder": "Ви {days} днів не займалися '{activity}' - час повернутися!",
        "rec_more": "Сьогодні ви займалися '{activity}' {minutes} хвилин - можна ще!",
        "rec_new": "Спробуйте '{activity}' - ви ще не починали цю активність!",
        "rec_info": "Створіть першу активність, щоб почати заробляти XP!",
        "yesterday": "Вчора",
        "continue_streak": "продовжте серію",
        "days_not_practiced": "днів не займалися",
        "time_to_return": "час повернутися",
        "today_practiced": "Сьогодні ви займалися",
        "minutes": "хвилин",
        "can_more": "можна ще",
        "try_activity": "Спробуйте",
        "not_started": "ви ще не починали цю активність",
        "create_first_activity": "Створіть першу активність, щоб почати заробляти XP!",
        "auth_required": "Потрібна авторизація",
        "error_loading_recommendations": "Помилка завантаження рекомендацій",
        "no_recommendations": "Немає рекомендацій. Продовжуйте займатися!",
        "start_tracking": "Почати відстеження",
        "click_for_details": "Клікніть для деталей",
        // Day details modal
        "earned": "Зароблено",
        "spent": "Витрачено",
        "activity_time": "Час активності",
        "total": "Разом",
        "earnings": "Заробітки",
        "sessions": "сесій",
        "spendings": "Витрати",
        "purchases": "покупок",
        "no_activity_today": "Немає активності в цей день",
        "error_loading_data": "Помилка завантаження даних",
        "edit_activity": "Редагувати активність",
        "enter_activity_name": "Введіть назву активності",
        "activity_updated": "Активність оновлено!",
        "error_updating": "Помилка оновлення",
        "network_error": "Помилка з'єднання. Перевірте сервер.",
        // Goal modal
        "edit_goal": "Редагувати ціль",
        "goal_not_found": "Ціль не знайдено",
        "cannot_edit_completed": "Не можна редагувати виконану ціль",
        "error_loading_goals": "Помилка завантаження цілей",
        "create_goal_btn": "Створити ціль",
        // Notifications
        "reward_purchased": "Нагорода \"{reward}\" куплена! Витрачено {spent} XP",
        "reward_received": "{reward} отримано! Мінус {spent} XP. Баланс: {balance} XP",
        "activity_started": "Запущено активність \"{activity}\"! Прокрутіть до розділу \"Активності\" щоб побачити таймер.",
        "connection_error": "Помилка з'єднання. Перевірте сервер.",
        "activity_saved": "Активність збережено!",
        "activity_deleted": "Активність видалено!",
        "goal_created": "Ціль створено!",
        "goal_updated": "Ціль оновлено!",
        "goal_deleted": "Ціль видалено!",
        "scroll_to_activities": "Прокрутіть до розділу \"Активності\" щоб побачити таймер",
        "no_goals": "Немає цілей. Створіть першу ціль!",
        "fill_title_and_xp": "Заповніть назву та цільову кількість XP",
        "select_activity_for_goal": "Будь ласка, виберіть активність для цілі",
        "error_creating_goal": "Помилка створення цілі",
        "delete_goal_confirm": "Видалити цю ціль?",
        "error_deleting": "Помилка видалення",
        "error_deleting_goal": "Помилка видалення цілі",
        "error": "Помилка",
        // Admin panel
        "invite_link": "Посилання для запрошення",
        "copy": "Копіювати",
        "send_link_to_daughter": "Надішліть це посилання дочці для реєстрації",
        "filter_by_category": "Фільтр за категоріями активностей",
        "all_categories": "Всі категорії",
        "children": "Підопічні",
        "stats": "Статистика",
        "access_denied": "Доступ заборонено. Тільки адміністратори можуть переглядати адмін-панель.",
        "error_checking_access": "Помилка перевірки прав доступу.",
        "error_loading": "Помилка завантаження",
        "error_loading_stats": "Помилка завантаження статистики",
        // Child stats modal
        "stats_for": "Статистика:",
        "balance_xp": "Баланс XP",
        "level": "Рівень",
        "current_streak": "Поточна серія",
        "general_stats": "Загальна статистика",
        "total_earned": "Всього зароблено:",
        "total_spent": "Всього витрачено:",
        "record_streak": "Рекорд серії:",
        "days_active": "Днів активності:",
        "today": "Сьогодні",
        "earned": "Зароблено:",
        "time": "Час:",
        "minutes": "хвилин",
        "week": "За тиждень:",
        "recent_transactions": "Останні транзакції",
        "history_empty": "Історія порожня",
        "category_stats_week": "Статистика за категоріями (тиждень)",
        "no_children": "Немає підопічних. Надішліть посилання для реєстрації.",
        "days_short": "дн.",
        "today_exclamation": "Сьогодні!",
        "overdue": "Прострочено",
        "completed": "Виконано"
    },
    de: {
        // Header
        "level": "Stufe",
        "activities": "Aktivitäten",
        "rewards": "Belohnungen",
        "history": "Verlauf",
        "goals": "Meine Ziele",
        "admin_panel": "Admin-Panel",
        "logout": "Abmelden",
        "telegram_bot": "Telegram-Bot öffnen",
        
        // Auth
        "login": "Anmelden",
        "register": "Registrieren",
        "email": "E-Mail",
        "password": "Passwort",
        "username": "Benutzername",
        "confirm_password": "Passwort bestätigen",
        "forgot_password": "Passwort vergessen?",
        "enter": "Anmelden",
        "create_account": "Konto erstellen",
        
        // Activities
        "new_activity": "➕ Neue Aktivität",
        "activity_name": "Aktivitätsname",
        "xp_per_hour": "XP/Stunde",
        "create": "Erstellen",
        "edit": "Bearbeiten",
        "delete": "Löschen",
        "start": "Start",
        "stop": "Stop",
        "time": "Zeit",
        "sessions": "Sitzungen",
        
        // Rewards
        "reward_name": "Belohnungsname",
        "create_reward": "Belohnung erstellen",
        "quick_select": "Schnellauswahl",
        "custom_reward": "Eigene Belohnung",
        "spend_xp": "XP für Vergnügen ausgeben",
        
        // History
        "transaction_history": "Transaktionsverlauf",
        "all_xp_operations": "Alle XP-Operationen",
        "show_all_history": "Gesamten Verlauf anzeigen",
        "hide_history": "Verlauf ausblenden",
        "show_all_rewards": "Alle Belohnungen anzeigen",
        "hide_rewards": "Belohnungen ausblenden",
        "earned": "Verdient",
        "spent": "Ausgegeben",
        
        // Stats
        "today": "Heute",
        "earned_xp": "Verdiente XP",
        "spent_xp": "Ausgegebene XP",
        "calendar": "Kalender",
        "week": "Woche",
        "month": "Monat",
        "year": "Jahr",
        "progress": "Fortschritt",
        "to_level": "Bis Stufe",
        "total_earned": "Gesamt verdient",
        "streak_days": "Tages-Serie",
        "days": "Tage",
        "record": "Rekord:",
        "start_activity": "Beginnen Sie eine Aktivität!",
        // Week days
        "mon": "Mo",
        "tue": "Di",
        "wed": "Mi",
        "thu": "Do",
        "fri": "Fr",
        "sat": "Sa",
        "sun": "So",
        // Months
        "month_jan": "Jan",
        "month_feb": "Feb",
        "month_mar": "Mär",
        "month_apr": "Apr",
        "month_may": "Mai",
        "month_jun": "Jun",
        "month_jul": "Jul",
        "month_aug": "Aug",
        "month_sep": "Sep",
        "month_oct": "Okt",
        "month_nov": "Nov",
        "month_dec": "Dez",
        // Categories
        "category_general": "Allgemein",
        "category_study": "Lernen",
        "category_sport": "Sport",
        "category_hobby": "Hobby",
        "category_work": "Arbeit",
        "category_health": "Gesundheit",
        
        // Goals
        "my_goals": "Meine Ziele",
        "new_goal": "🎯 Neues Ziel",
        "goal_title": "Zielname",
        "target_xp": "Ziel-XP-Menge",
        "description": "Beschreibung (optional)",
        "deadline": "Frist (optional)",
        "create_goal": "Ziel erstellen",
        
        // Common
        "save": "Speichern",
        "cancel": "Abbrechen",
        "close": "Schließen",
        "loading": "Lädt...",
        "empty": "Leer",
        // Footer
        "about_project": "Über das Projekt",
        "project_description": "System zur Aktivitätsverfolgung und Motivation durch XP. Erreichen Sie Ziele und verdienen Sie Belohnungen!",
        "navigation": "Navigation",
        "features": "Funktionen",
        "tools": "Werkzeuge",
        "settings": "Einstellungen",
        "language": "Sprache",
        "manual_time": "Manuelle Zeiteingabe",
        "manage_categories": "Kategorien verwalten",
        "refresh_data": "Daten aktualisieren",
        "data_updated": "✅ Daten aktualisiert!",
        "timer": "Timer",
        "streak_system": "Streak-System",
        "smart_recommendations": "Intelligente Empfehlungen",
        "recommendations": "Empfehlungen",
        "blacklist": "Schwarze Liste der Belohnungen",
        "goals_system": "Zielsystem",
        "calendar_stats": "Aktivitätskalender",
        "category_stats": "Statistik nach Kategorien",
        "add_category": "Kategorie hinzufügen",
        // Recommendations messages
        "rec_continue": "Gestern haben Sie '{activity}' gemacht - setzen Sie die Serie fort! 🔥",
        "rec_reminder": "Sie haben {days} Tage lang '{activity}' nicht gemacht - Zeit zurückzukehren!",
        "rec_more": "Heute haben Sie {minutes} Minuten '{activity}' gemacht - es geht noch mehr!",
        "rec_new": "Versuchen Sie '{activity}' - Sie haben diese Aktivität noch nicht begonnen!",
        "rec_info": "Erstellen Sie Ihre erste Aktivität, um XP zu verdienen!",
        "yesterday": "Gestern",
        "continue_streak": "setzen Sie die Serie fort",
        "days_not_practiced": "Tage nicht gemacht",
        "time_to_return": "Zeit zurückzukehren",
        "today_practiced": "Heute haben Sie",
        "minutes": "Minuten",
        "can_more": "es geht noch mehr",
        "try_activity": "Versuchen Sie",
        "not_started": "Sie haben diese Aktivität noch nicht begonnen",
        "create_first_activity": "Erstellen Sie Ihre erste Aktivität, um XP zu verdienen!",
        "auth_required": "Autorisierung erforderlich",
        "error_loading_recommendations": "Fehler beim Laden der Empfehlungen",
        "no_recommendations": "Keine Empfehlungen. Machen Sie weiter!",
        "start_tracking": "Verfolgung starten",
        "click_for_details": "Klicken Sie für Details",
        // Day details modal
        "earned": "Verdient",
        "spent": "Ausgegeben",
        "activity_time": "Aktivitätszeit",
        "total": "Gesamt",
        "earnings": "Einnahmen",
        "sessions": "Sitzungen",
        "spendings": "Ausgaben",
        "purchases": "Käufe",
        "no_activity_today": "Keine Aktivität an diesem Tag",
        "error_loading_data": "Fehler beim Laden der Daten",
        "edit_activity": "Aktivität bearbeiten",
        "enter_activity_name": "Geben Sie den Aktivitätsnamen ein",
        "activity_updated": "Aktivität aktualisiert!",
        "error_updating": "Fehler beim Aktualisieren",
        "network_error": "Verbindungsfehler. Überprüfen Sie den Server.",
        // Goal modal
        "edit_goal": "Ziel bearbeiten",
        "goal_not_found": "Ziel nicht gefunden",
        "cannot_edit_completed": "Abgeschlossenes Ziel kann nicht bearbeitet werden",
        "error_loading_goals": "Fehler beim Laden der Ziele",
        "create_goal_btn": "Ziel erstellen",
        // Notifications
        "reward_purchased": "Belohnung \"{reward}\" gekauft! {spent} XP ausgegeben",
        "reward_received": "{reward} erhalten! Minus {spent} XP. Kontostand: {balance} XP",
        "activity_started": "Aktivität \"{activity}\" gestartet! Scrollen Sie zum Abschnitt \"Aktivitäten\", um den Timer zu sehen.",
        "connection_error": "Verbindungsfehler. Überprüfen Sie den Server.",
        "activity_saved": "Aktivität gespeichert!",
        "activity_deleted": "Aktivität gelöscht!",
        "goal_created": "Ziel erstellt!",
        "goal_updated": "Ziel aktualisiert!",
        "goal_deleted": "Ziel gelöscht!",
        "scroll_to_activities": "Scrollen Sie zum Abschnitt \"Aktivitäten\", um den Timer zu sehen",
        "no_goals": "Keine Ziele. Erstellen Sie das erste Ziel!",
        "fill_title_and_xp": "Füllen Sie den Titel und die Ziel-XP-Menge aus",
        "select_activity_for_goal": "Bitte wählen Sie eine Aktivität für das Ziel",
        "error_creating_goal": "Fehler beim Erstellen des Ziels",
        "delete_goal_confirm": "Dieses Ziel löschen?",
        "error_deleting": "Fehler beim Löschen",
        "error_deleting_goal": "Fehler beim Löschen des Ziels",
        "error": "Fehler",
        // Admin panel
        "invite_link": "Einladungslink",
        "copy": "Kopieren",
        "send_link_to_daughter": "Senden Sie diesen Link an Ihre Tochter zur Registrierung",
        "filter_by_category": "Filter nach Aktivitätskategorien",
        "all_categories": "Alle Kategorien",
        "children": "Schützlinge",
        "stats": "Statistik",
        "access_denied": "Zugriff verweigert. Nur Administratoren können das Admin-Panel anzeigen.",
        "error_checking_access": "Fehler beim Überprüfen der Zugriffsrechte.",
        "error_loading": "Fehler beim Laden",
        "error_loading_stats": "Fehler beim Laden der Statistik",
        // Child stats modal
        "stats_for": "Statistik:",
        "balance_xp": "XP-Guthaben",
        "level": "Stufe",
        "current_streak": "Aktuelle Serie",
        "general_stats": "Allgemeine Statistik",
        "total_earned": "Insgesamt verdient:",
        "total_spent": "Insgesamt ausgegeben:",
        "record_streak": "Rekordserie:",
        "days_active": "Aktive Tage:",
        "today": "Heute",
        "earned": "Verdient:",
        "time": "Zeit:",
        "minutes": "Minuten",
        "week": "Diese Woche:",
        "recent_transactions": "Letzte Transaktionen",
        "history_empty": "Verlauf leer",
        "category_stats_week": "Statistik nach Kategorien (Woche)",
        "no_children": "Keine Schützlinge. Senden Sie den Link zur Registrierung.",
        "days_short": "T.",
        "today_exclamation": "Heute!",
        "overdue": "Überfällig",
        "completed": "Abgeschlossen"
    },
    en: {
        // Header
        "level": "Level",
        "activities": "Activities",
        "rewards": "Rewards",
        "history": "History",
        "goals": "My Goals",
        "admin_panel": "Admin Panel",
        "logout": "Logout",
        "telegram_bot": "Open Telegram Bot",
        
        // Auth
        "login": "Login",
        "register": "Register",
        "email": "Email",
        "password": "Password",
        "username": "Username",
        "confirm_password": "Confirm Password",
        "forgot_password": "Forgot Password?",
        "enter": "Enter",
        "create_account": "Create Account",
        
        // Activities
        "new_activity": "➕ New Activity",
        "activity_name": "Activity Name",
        "xp_per_hour": "XP/hour",
        "create": "Create",
        "edit": "Edit",
        "delete": "Delete",
        "start": "Start",
        "stop": "Stop",
        "time": "Time",
        "sessions": "Sessions",
        
        // Rewards
        "reward_name": "Reward Name",
        "create_reward": "Create Reward",
        "quick_select": "Quick Select",
        "custom_reward": "Custom Reward",
        "spend_xp": "Spend XP on pleasures",
        
        // History
        "transaction_history": "Transaction History",
        "all_xp_operations": "All XP operations",
        "show_all_history": "Show all history",
        "hide_history": "Hide history",
        "show_all_rewards": "Show all rewards",
        "hide_rewards": "Hide rewards",
        "earned": "Earned",
        "spent": "Spent",
        
        // Stats
        "today": "Today",
        "earned_xp": "Earned XP",
        "spent_xp": "Spent XP",
        "calendar": "Calendar",
        "week": "Week",
        "month": "Month",
        "year": "Year",
        "progress": "Progress",
        "to_level": "To level",
        "total_earned": "Total earned",
        "streak_days": "Day Streak",
        "days": "days",
        "record": "Record:",
        "start_activity": "Start an activity!",
        // Week days
        "mon": "Mon",
        "tue": "Tue",
        "wed": "Wed",
        "thu": "Thu",
        "fri": "Fri",
        "sat": "Sat",
        "sun": "Sun",
        // Months
        "month_jan": "Jan",
        "month_feb": "Feb",
        "month_mar": "Mar",
        "month_apr": "Apr",
        "month_may": "May",
        "month_jun": "Jun",
        "month_jul": "Jul",
        "month_aug": "Aug",
        "month_sep": "Sep",
        "month_oct": "Oct",
        "month_nov": "Nov",
        "month_dec": "Dec",
        // Categories
        "category_general": "General",
        "category_study": "Study",
        "category_sport": "Sport",
        "category_hobby": "Hobby",
        "category_work": "Work",
        "category_health": "Health",
        
        // Goals
        "my_goals": "My Goals",
        "new_goal": "🎯 New Goal",
        "goal_title": "Goal Title",
        "target_xp": "Target XP Amount",
        "description": "Description (optional)",
        "deadline": "Deadline (optional)",
        "create_goal": "Create Goal",
        
        // Common
        "save": "Save",
        "cancel": "Cancel",
        "close": "Close",
        "loading": "Loading...",
        "empty": "Empty",
        // Footer
        "about_project": "About Project",
        "project_description": "Activity tracking and motivation system through XP. Achieve goals and earn rewards!",
        "navigation": "Navigation",
        "features": "Features",
        "tools": "Tools",
        "settings": "Settings",
        "language": "Language",
        "manual_time": "Manual Time Entry",
        "manage_categories": "Manage Categories",
        "refresh_data": "Refresh Data",
        "data_updated": "✅ Data updated!",
        "timer": "Timer",
        "streak_system": "Streak System",
        "smart_recommendations": "Smart Recommendations",
        "recommendations": "Recommendations",
        "blacklist": "Rewards Blacklist",
        "goals_system": "Goals System",
        "calendar_stats": "Activity Calendar",
        "category_stats": "Category Statistics",
        "add_category": "Add Category",
        // Recommendations messages
        "rec_continue": "Yesterday you did '{activity}' - continue the streak! 🔥",
        "rec_reminder": "You haven't practiced '{activity}' for {days} days - time to return!",
        "rec_more": "Today you practiced '{activity}' for {minutes} minutes - you can do more!",
        "rec_new": "Try '{activity}' - you haven't started this activity yet!",
        "rec_info": "Create your first activity to start earning XP!",
        "yesterday": "Yesterday",
        "continue_streak": "continue the streak",
        "days_not_practiced": "days not practiced",
        "time_to_return": "time to return",
        "today_practiced": "Today you practiced",
        "minutes": "minutes",
        "can_more": "you can do more",
        "try_activity": "Try",
        "not_started": "you haven't started this activity yet",
        "create_first_activity": "Create your first activity to start earning XP!",
        "auth_required": "Authorization required",
        "error_loading_recommendations": "Error loading recommendations",
        "no_recommendations": "No recommendations. Keep practicing!",
        "start_tracking": "Start tracking",
        "click_for_details": "Click for details",
        // Day details modal
        "earned": "Earned",
        "spent": "Spent",
        "activity_time": "Activity time",
        "total": "Total",
        "earnings": "Earnings",
        "sessions": "sessions",
        "spendings": "Spendings",
        "purchases": "purchases",
        "no_activity_today": "No activity on this day",
        "error_loading_data": "Error loading data",
        "edit_activity": "Edit activity",
        "enter_activity_name": "Enter activity name",
        "activity_updated": "Activity updated!",
        "error_updating": "Error updating",
        "network_error": "Connection error. Check the server.",
        // Goal modal
        "edit_goal": "Edit goal",
        "goal_not_found": "Goal not found",
        "cannot_edit_completed": "Cannot edit completed goal",
        "error_loading_goals": "Error loading goals",
        "create_goal_btn": "Create goal",
        // Notifications
        "reward_purchased": "Reward \"{reward}\" purchased! Spent {spent} XP",
        "reward_received": "{reward} received! Minus {spent} XP. Balance: {balance} XP",
        "activity_started": "Activity \"{activity}\" started! Scroll to the \"Activities\" section to see the timer.",
        "connection_error": "Connection error. Check the server.",
        "activity_saved": "Activity saved!",
        "activity_deleted": "Activity deleted!",
        "goal_created": "Goal created!",
        "goal_updated": "Goal updated!",
        "goal_deleted": "Goal deleted!",
        "scroll_to_activities": "Scroll to the \"Activities\" section to see the timer",
        "no_goals": "No goals. Create your first goal!",
        "fill_title_and_xp": "Fill in the title and target XP amount",
        "select_activity_for_goal": "Please select an activity for the goal",
        "error_creating_goal": "Error creating goal",
        "delete_goal_confirm": "Delete this goal?",
        "error_deleting": "Error deleting",
        "error_deleting_goal": "Error deleting goal",
        "error": "Error",
        // Admin panel
        "invite_link": "Invite link",
        "copy": "Copy",
        "send_link_to_daughter": "Send this link to your daughter for registration",
        "filter_by_category": "Filter by activity categories",
        "all_categories": "All categories",
        "children": "Children",
        "stats": "Statistics",
        "access_denied": "Access denied. Only administrators can view the admin panel.",
        "error_checking_access": "Error checking access rights.",
        "error_loading": "Error loading",
        "error_loading_stats": "Error loading statistics",
        // Child stats modal
        "stats_for": "Statistics:",
        "balance_xp": "Balance XP",
        "level": "Level",
        "current_streak": "Current streak",
        "general_stats": "General statistics",
        "total_earned": "Total earned:",
        "total_spent": "Total spent:",
        "record_streak": "Record streak:",
        "days_active": "Days active:",
        "today": "Today",
        "earned": "Earned:",
        "time": "Time:",
        "minutes": "minutes",
        "week": "This week:",
        "recent_transactions": "Recent transactions",
        "history_empty": "History is empty",
        "category_stats_week": "Category statistics (week)",
        "no_children": "No children. Send the link for registration.",
        "days_short": "days",
        "today_exclamation": "Today!",
        "overdue": "Overdue",
        "completed": "Completed"
    }
};

let currentLanguage = localStorage.getItem('language') || 'ru';

function t(key) {
    return translations[currentLanguage][key] || translations['ru'][key] || key;
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
    updateLanguageMenu();
    // Обновляем тексты аккордеонов
    updateHistoryAccordionButton();
    updateRewardsAccordionButton();
    // Перезагружаем данные, которые зависят от языка
    if (document.getElementById('app-section') && !document.getElementById('app-section').classList.contains('hidden')) {
        loadCategoryStats();
        loadCalendar(currentCalendarPeriod);
        loadActivities();
        loadRecommendations();
        updateAdminCategoryFilter();
    }
    closeLanguageMenu();
}

function applyTranslations() {
    // Применяем переводы ко всем элементам с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Применяем переводы к placeholder'ам
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Применяем переводы к title атрибутам
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
}

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
    
    // Обновляем флажок в кнопке хедера
    const flagMap = {
        'ru': '🇷🇺',
        'uk': '🇺🇦',
        'de': '🇩🇪',
        'en': '🇬🇧'
    };
    const flagEl = document.getElementById('current-language-flag');
    if (flagEl) {
        flagEl.textContent = flagMap[currentLanguage] || '🇷🇺';
    }
    const flagFooterEl = document.getElementById('footer-language-flag');
    if (flagFooterEl) {
        flagFooterEl.textContent = flagMap[currentLanguage] || '🇷🇺';
    }
}

// Закрываем меню при клике вне его
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('language-switcher-wrapper');
    const menu = document.getElementById('language-menu');
    if (wrapper && menu && !wrapper.contains(e.target)) {
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

window.toggleFooterLanguageMenu = toggleFooterLanguageMenu;

// Применяем переводы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    updateLanguageMenu();
});

// Экспортируем функции для использования в HTML
window.changeLanguage = changeLanguage;
window.toggleLanguageMenu = toggleLanguageMenu;
window.t = t;

// ============= MOBILE MENU =============
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    const icon = btn.querySelector('i');
    
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
    const btn = document.getElementById('mobile-menu-btn');
    const icon = btn.querySelector('i');
    
    menu.classList.add('hidden');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// ============= AUTH STATE =============
let authToken = localStorage.getItem('token') || '';
let currentUser = null;

// ============= APP STATE =============
const activeTimers = new Map();
let allActivities = [];
let allRewards = [];

// ============= DOM ELEMENTS =============
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const activityNameInput = document.getElementById("activity-name");
const xpPerHourInput = document.getElementById("xp-per-hour");
const activitiesList = document.getElementById("activities-list");
const newActivityForm = document.getElementById("new-activity-form");
const balanceSpan = document.getElementById("balance");
const levelSpan = document.getElementById("level");
// Элементы будут инициализированы при первом использовании
let rewardsListVisible, rewardsListHidden, rewardsAccordionBtn;
let historyListVisible, historyListHidden, historyAccordionBtn;

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

async function login(email, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Ошибка входа");
        }
        
        const data = await res.json();
        authToken = data.access_token;
        localStorage.setItem('token', authToken);
        
        await loadCurrentUser();
        showApp();
        
    } catch (e) {
        document.getElementById("login-error").textContent = e.message;
        document.getElementById("login-error").classList.remove("hidden");
    }
}

async function register(email, username, password) {
    try {
        // Проверяем invite код из URL
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get('invite');
        
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email, 
                password, 
                username: username || null,
                invite_code: inviteCode || null
            })
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Ошибка регистрации");
        }
        
        document.getElementById("register-error").classList.add("hidden");
        document.getElementById("register-success").textContent = "✅ Регистрация успешна! Теперь войдите.";
        document.getElementById("register-success").classList.remove("hidden");
        
        setTimeout(() => {
            showLoginForm();
            document.getElementById("login-email").value = email;
        }, 1500);
        
    } catch (e) {
        document.getElementById("register-success").classList.add("hidden");
        document.getElementById("register-error").textContent = e.message;
        document.getElementById("register-error").classList.remove("hidden");
    }
}

async function loadCurrentUser() {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error("Не удалось загрузить пользователя");
        
        currentUser = await res.json();
        document.getElementById("user-info").textContent = currentUser.username || currentUser.email;
        
        // Проверяем, является ли пользователь администратором
        checkAdminStatus();
        
    } catch (e) {
        console.error("Error loading user:", e);
        logout();
    }
}

async function checkAdminStatus() {
    try {
        // Пытаемся получить invite код - если успешно, значит админ
        const res = await fetch(`${API_BASE}/admin/invite-code`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (res.ok) {
            const adminBtn = document.getElementById("admin-btn");
            const footerAdminBtn = document.getElementById("footer-admin-btn");
            if (adminBtn) adminBtn.classList.remove("hidden");
            if (footerAdminBtn) footerAdminBtn.classList.remove("hidden");
            loadInviteCode();
        }
    } catch (e) {
        // Не админ или ошибка
    }
}

function logout() {
    authToken = '';
    currentUser = null;
    localStorage.removeItem('token');
    showAuth();
}

function showAuth() {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
}

function showApp() {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    
    // Сбрасываем кэш элементов, чтобы они переинициализировались
    rewardsListVisible = null;
    rewardsListHidden = null;
    rewardsAccordionBtn = null;
    historyListVisible = null;
    historyListHidden = null;
    historyAccordionBtn = null;
    
    // Небольшая задержка, чтобы DOM успел обновиться
    setTimeout(async () => {
        loadWallet();
        // Сначала загружаем категории, чтобы они были доступны при отображении активностей
        await loadCategories();
        loadActivities(); // Теперь загружаем активности, когда категории уже загружены
        loadRewards();
        loadTodayStats();
        loadWeekCalendar();
        setTimeout(() => loadCategoryStats(), 100);
        loadStreak();
        loadRecommendations();
        loadGoals();
        loadHistory(); // Автоматически загружаем историю
        
        // Дополнительное обновление dropdown через небольшую задержку на случай, если элементы еще не готовы
        setTimeout(() => {
            updateCategoryDropdown('activity-category');
            updateCategoryDropdown('edit-activity-category');
        }, 200);
    }, 50);
}

async function checkAuth() {
    // Сразу скрываем auth-section если есть токен, чтобы избежать мигания
    if (authToken) {
        authSection.classList.add("hidden");
        appSection.classList.remove("hidden");
    } else {
        showAuth();
        return;
    }
    
    try {
        await loadCurrentUser();
        showApp();
    } catch (e) {
        showAuth();
    }
}


// ============= WALLET =============
async function loadWallet() {
    try {
        const res = await fetch(`${API_BASE}/xp/wallet`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        balanceSpan.textContent = `${Math.round(data.balance)} XP`;
        levelSpan.textContent = data.level;
        
        // Обновляем прогресс уровня
        const nextLevel = data.level + 1;
        const xpForCurrentLevel = (data.level - 1) * 1000;
        const xpForNextLevel = data.level * 1000;
        const currentProgress = data.total_earned - xpForCurrentLevel;
        const progressPercent = Math.min((currentProgress / 1000) * 100, 100);
        
        const nextLevelEl = document.getElementById('next-level');
        const xpToNextEl = document.getElementById('xp-to-next');
        const levelProgressEl = document.getElementById('level-progress');
        const totalEarnedEl = document.getElementById('total-earned');
        
        if (nextLevelEl) nextLevelEl.textContent = nextLevel;
        if (xpToNextEl) xpToNextEl.textContent = `${Math.round(currentProgress)}/${1000} XP`;
        if (levelProgressEl) levelProgressEl.style.width = `${progressPercent}%`;
        if (totalEarnedEl) totalEarnedEl.textContent = Math.round(data.total_earned);
        
    } catch (e) {
        console.error("Error loading wallet", e);
    }
}

// ============= TODAY STATS =============
async function loadTodayStats() {
    try {
        const res = await fetch(`${API_BASE}/xp/today`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const earnedEl = document.getElementById('today-earned');
        const spentEl = document.getElementById('today-spent');
        const sessionsEl = document.getElementById('today-sessions');
        const timeEl = document.getElementById('today-time');
        
        if (earnedEl) earnedEl.textContent = Math.round(data.earned_today);
        if (spentEl) spentEl.textContent = Math.round(data.spent_today);
        if (sessionsEl) sessionsEl.textContent = data.sessions_today;
        if (timeEl) {
            const hours = Math.floor(data.time_today_minutes / 60);
            const mins = Math.round(data.time_today_minutes % 60);
            timeEl.textContent = hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
        }
    } catch (e) {
        console.error("Error loading today stats", e);
    }
}

// ============= CATEGORY STATS =============
async function loadCategoryStats() {
    try {
        const categoryStatsEl = document.getElementById('category-stats');
        if (!categoryStatsEl) {
            console.warn("Category stats element not found");
            return;
        }
        
        if (!authToken) {
            console.error("No auth token available");
            categoryStatsEl.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">Требуется авторизация</div>';
            return;
        }
        
        const res = await fetch(`${API_BASE}/xp/category-stats?period=week`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load category stats:", res.status, res.statusText, errorText);
            categoryStatsEl.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">Ошибка загрузки</div>';
            return;
        }
        
        const data = await res.json();
        
        if (!data.categories || data.categories.length === 0) {
            categoryStatsEl.innerHTML = '<div class="text-center text-gray-400 py-4 text-sm">Нет данных по категориям</div>';
            return;
        }
        
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
        
        categoryStatsEl.innerHTML = data.categories.map(cat => {
            const catName = categoryNames[cat.category] || cat.category;
            const percentage = data.total_xp > 0 ? (cat.total_xp / data.total_xp * 100) : 0;
            return `
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-gray-800 text-sm">${catName}</span>
                        <span class="font-bold text-blue-600 text-sm">${Math.round(cat.total_xp)} XP</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all" style="width: ${percentage}%"></div>
                    </div>
                    <div class="text-xs text-gray-500">${Math.round(cat.total_time)} мин • ${cat.activity_count} активностей</div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading category stats", e);
        const categoryStatsEl = document.getElementById('category-stats');
        if (categoryStatsEl) {
            categoryStatsEl.innerHTML = '<div class="text-center text-red-400 py-4 text-sm">Ошибка загрузки</div>';
        }
    }
}

// ============= CALENDAR =============
let currentCalendarPeriod = 'week';

function changeCalendarPeriod(period) {
    currentCalendarPeriod = period;
    
    // Обновляем активную кнопку
    document.querySelectorAll('[id^="period-"]').forEach(btn => {
        btn.classList.remove('bg-indigo-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    const activeBtn = document.getElementById(`period-${period}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-indigo-500', 'text-white');
    }
    
    // Загружаем календарь для выбранного периода
    loadCalendar(period);
}

async function loadCalendar(period = currentCalendarPeriod) {
    try {
        const endpoint = period === 'week' ? '/xp/week' : period === 'month' ? '/xp/month' : '/xp/year';
        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const containerEl = document.getElementById('calendar-container');
        if (!containerEl) return;
        
        if (period === 'week') {
            // Маппинг индексов дней недели (0=Пн, 6=Вс) на ключи переводов
            const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            
            containerEl.innerHTML = `
                <div class="flex justify-between gap-0.5 md:gap-1" id="week-calendar">
                    ${data.map((day, index) => {
                        const isToday = index === 6;
                        const hasActivity = day.earned > 0 || day.spent > 0;
                        const intensity = Math.min(day.earned / 100, 1);
                        const todayDate = new Date();
                        const dayDate = new Date(day.date);
                        const isTodayDate = dayDate.toDateString() === todayDate.toDateString();
                        
                        // Получаем локализованное название дня недели
                        const dayKey = dayKeys[index];
                        const localizedDayName = dayKey ? t(dayKey) : day.day_name;
                        
                        return `
                            <div class="flex flex-col items-center cursor-pointer ${isTodayDate ? 'scale-110' : ''}" 
                                 onclick="showDayDetails('${day.date}')"
                                 title="${t('click_for_details')}: ${day.earned} ${t('earned_xp')}, ${day.spent} ${t('spent_xp')}">
                                <span class="text-xs text-gray-500 mb-1">${localizedDayName}</span>
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110
                                    ${isTodayDate ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 
                                      hasActivity ? `bg-emerald-${Math.round(intensity * 4 + 1)}00 text-emerald-800` : 'bg-gray-100 text-gray-400'}">
                                    ${Math.round(day.earned)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else if (period === 'month') {
            // Календарь месяца в виде сетки
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Понедельник = 0
            
            // Создаём карту данных по дням
            const dayDataMap = {};
            data.forEach(day => {
                dayDataMap[day.day_number] = day;
            });
            
            let calendarHTML = `
                <div class="grid grid-cols-7 gap-1 mb-2">
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('mon')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('tue')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('wed')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('thu')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('fri')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('sat')}</div>
                    <div class="text-center text-xs font-semibold text-gray-500 py-1">${t('sun')}</div>
                </div>
                <div class="grid grid-cols-7 gap-1">
            `;
            
            // Пустые ячейки до первого дня месяца
            for (let i = 0; i < startDayOfWeek; i++) {
                calendarHTML += '<div class="aspect-square"></div>';
            }
            
            // Дни месяца
            for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
                const day = dayDataMap[dayNum] || { day_number: dayNum, earned: 0, spent: 0, date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` };
                const dayDate = new Date(day.date);
                const todayDate = new Date();
                const isTodayDate = dayDate.toDateString() === todayDate.toDateString();
                const hasActivity = day.earned > 0 || day.spent > 0;
                const intensity = Math.min(day.earned / 200, 1);
                
                calendarHTML += `
                    <div class="aspect-square flex flex-col items-center justify-center rounded-lg transition-all hover:bg-gray-50 cursor-pointer ${isTodayDate ? 'ring-2 ring-indigo-400 scale-105 bg-indigo-50' : ''}" 
                         onclick="showDayDetails('${day.date}')"
                         title="${t('click_for_details')}: ${day.earned} ${t('earned_xp')}, ${day.spent} ${t('spent_xp')}">
                        <span class="text-[10px] font-medium ${isTodayDate ? 'text-indigo-600 font-bold' : 'text-gray-600'}">${dayNum}</span>
                        ${hasActivity ? `
                            <div class="w-2 h-2 rounded-full mt-0.5 ${isTodayDate ? 'bg-indigo-500' : intensity > 0.5 ? 'bg-emerald-500' : intensity > 0.25 ? 'bg-emerald-400' : 'bg-emerald-300'}"></div>
                        ` : ''}
                    </div>
                `;
            }
            
            calendarHTML += '</div>';
            containerEl.innerHTML = calendarHTML;
        } else if (period === 'year') {
            // Календарь года - по месяцам
            const today = new Date();
            const currentYear = today.getFullYear();
            
            // Маппинг номеров месяцев на ключи переводов
            const monthKeys = [
                'month_jan', 'month_feb', 'month_mar', 'month_apr', 'month_may', 'month_jun',
                'month_jul', 'month_aug', 'month_sep', 'month_oct', 'month_nov', 'month_dec'
            ];
            
            containerEl.innerHTML = `
                <div class="text-center mb-3">
                    <h4 class="text-sm font-bold text-gray-700">${currentYear}</h4>
                </div>
                <div class="grid grid-cols-4 gap-2">
                    ${data.map(month => {
                        const hasActivity = month.earned > 0 || month.spent > 0;
                        const intensity = Math.min(month.earned / 2000, 1);
                        const today = new Date();
                        const isCurrentMonth = today.getMonth() + 1 === month.month;
                        
                        // Получаем локализованное название месяца
                        const monthKey = monthKeys[month.month - 1];
                        const localizedMonthName = t(monthKey);
                        
                        let bgColor = 'bg-gray-100';
                        let textColor = 'text-gray-400';
                        if (hasActivity) {
                            if (intensity > 0.75) {
                                bgColor = 'bg-emerald-500';
                                textColor = 'text-white';
                            } else if (intensity > 0.5) {
                                bgColor = 'bg-emerald-400';
                                textColor = 'text-white';
                            } else if (intensity > 0.25) {
                                bgColor = 'bg-emerald-300';
                                textColor = 'text-emerald-800';
                            } else {
                                bgColor = 'bg-emerald-200';
                                textColor = 'text-emerald-800';
                            }
                        }
                        
                        return `
                            <div class="flex flex-col items-center p-2 rounded-lg transition-all hover:shadow-md cursor-pointer ${isCurrentMonth ? 'ring-2 ring-indigo-300' : ''}" 
                                 onclick="showMonthDetails(${month.month})"
                                 title="${t('click_for_details')}: ${localizedMonthName} - ${month.earned} ${t('earned_xp')}, ${month.spent} ${t('spent_xp')}">
                                <span class="text-xs font-semibold ${isCurrentMonth ? 'text-indigo-600' : 'text-gray-600'} mb-1">${localizedMonthName}</span>
                                <div class="w-full h-8 rounded flex items-center justify-center text-[10px] font-bold ${bgColor} ${textColor}">
                                    ${Math.round(month.earned)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    } catch (e) {
        console.error("Error loading calendar", e);
    }
}

// Старая функция для обратной совместимости
async function loadWeekCalendar() {
    await loadCalendar('week');
}

// ============= DAY DETAILS =============
async function showDayDetails(date) {
    try {
        const modal = document.getElementById('day-details-modal');
        const titleEl = document.getElementById('day-details-title');
        const contentEl = document.getElementById('day-details-content');
        
        modal.classList.remove('hidden');
        contentEl.innerHTML = `<div class="text-center text-gray-400 py-4">${t('loading')}</div>`;
        
        const res = await fetch(`${API_BASE}/xp/day/${date}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            contentEl.innerHTML = `<div class="text-center text-red-400 py-4">${t('error_loading_data')}</div>`;
            return;
        }
        
        const data = await res.json();
        
        // Форматируем дату
        const dateObj = new Date(date);
        
        // Для украинского языка используем правильный падеж (именительный)
        let formattedDate;
        if (currentLanguage === 'uk') {
            const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'];
            const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                           'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
            const weekday = weekdays[dateObj.getDay()];
            const month = months[dateObj.getMonth()];
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            formattedDate = `${weekday}, ${day} ${month} ${year}`;
        } else {
            const localeMap = { 'ru': 'ru-RU', 'de': 'de-DE', 'en': 'en-US' };
            const locale = localeMap[currentLanguage] || 'ru-RU';
            formattedDate = dateObj.toLocaleDateString(locale, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        titleEl.textContent = `📅 ${formattedDate}`;
        
        // Форматируем время
        const formatTime = (timeStr) => {
            if (!timeStr) return '';
            const time = new Date(timeStr);
            const localeMap = { 'ru': 'ru-RU', 'uk': 'uk-UA', 'de': 'de-DE', 'en': 'en-US' };
            const locale = localeMap[currentLanguage] || 'ru-RU';
            return time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        };
        
        // Форматируем длительность
        const formatDuration = (minutes) => {
            if (!minutes || minutes === 0) return '0м';
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            if (hours > 0) {
                return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
            }
            return `${mins}м`;
        };
        
        let html = `
            <div class="space-y-4">
                <!-- Общая статистика -->
                <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('earned')}</div>
                            <div class="text-xl font-bold text-green-600">+${data.total_earned} XP</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('spent')}</div>
                            <div class="text-xl font-bold text-red-600">-${data.total_spent} XP</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('activity_time')}</div>
                            <div class="text-lg font-semibold text-indigo-600">${formatDuration(data.total_time)}</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-600 mb-1">${t('total')}</div>
                            <div class="text-lg font-semibold ${data.net >= 0 ? 'text-green-600' : 'text-red-600'}">${data.net >= 0 ? '+' : ''}${data.net} XP</div>
                        </div>
                    </div>
                </div>
        `;
        
        // Заработки
        if (data.earnings && data.earnings.length > 0) {
            html += `
                <div>
                    <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <i class="fas fa-arrow-up text-green-500"></i>
                        ${t('earnings')} (${data.sessions_count} ${t('sessions')})
                    </h4>
                    <div class="space-y-2">
                        ${data.earnings.map(earning => `
                            <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="font-semibold text-gray-800">${earning.activity_name}</div>
                                        <div class="text-xs text-gray-600 mt-1">
                                            <i class="fas fa-clock text-xs"></i> ${formatDuration(earning.duration_minutes)}
                                            ${earning.time ? ` • ${formatTime(earning.time)}` : ''}
                                        </div>
                                    </div>
                                    <div class="text-green-600 font-bold">+${earning.xp_earned} XP</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="text-center text-gray-400 py-4 bg-gray-50 rounded-lg">
                    <i class="fas fa-info-circle mb-2"></i>
                    <div>${t('no_activity_today')}</div>
                </div>
            `;
        }
        
        // Расходы
        if (data.spendings && data.spendings.length > 0) {
            html += `
                <div>
                    <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <i class="fas fa-arrow-down text-red-500"></i>
                        ${t('spendings')} (${data.purchases_count} ${t('purchases')})
                    </h4>
                    <div class="space-y-2">
                        ${data.spendings.map(spending => `
                            <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="font-semibold text-gray-800">${spending.reward_name}</div>
                                        ${spending.time ? `
                                            <div class="text-xs text-gray-600 mt-1">
                                                <i class="fas fa-clock text-xs"></i> ${formatTime(spending.time)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="text-red-600 font-bold">-${spending.xp_spent} XP</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        contentEl.innerHTML = html;
        
    } catch (e) {
        console.error("Error loading day details:", e);
        document.getElementById('day-details-content').innerHTML = 
            `<div class="text-center text-red-400 py-4">${t('error_loading_data')}</div>`;
    }
}

function closeDayDetailsModal() {
    document.getElementById('day-details-modal').classList.add('hidden');
}

// Показать детали месяца (переключаемся на календарь месяца)
function showMonthDetails(month) {
    changeCalendarPeriod('month');
    // Прокручиваем к календарю
    setTimeout(() => {
        document.getElementById('calendar-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// ============= HISTORY =============
let historyOpen = false;

function toggleHistory() {
    historyOpen = !historyOpen;
    const panel = document.getElementById('history-panel');
    const chevron = document.getElementById('history-chevron');
    
    if (historyOpen) {
        panel.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
        loadHistory();
    } else {
        panel.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
    }
}

function renderHistoryItem(item) {
    const isEarn = item.type === 'earn';
    const date = new Date(item.date);
    const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    
    return `
        <div class="flex items-center justify-between p-2.5 rounded-lg ${isEarn ? 'bg-emerald-50' : 'bg-red-50'} transition-all hover:bg-opacity-80">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isEarn ? 'bg-emerald-500' : 'bg-red-500'}">
                    <i class="fas ${isEarn ? 'fa-arrow-up' : 'fa-arrow-down'} text-white text-xs"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="font-medium text-gray-800 text-sm truncate">${item.description}</div>
                    <div class="text-xs text-gray-500">${dateStr} в ${timeStr}${item.duration_minutes ? ` • ${Math.round(item.duration_minutes)} мин` : ''}</div>
                </div>
            </div>
            <div class="font-bold ${isEarn ? 'text-emerald-600' : 'text-red-600'} flex-shrink-0 ml-2">
                ${isEarn ? '+' : '-'}${Math.round(item.amount)} XP
            </div>
        </div>
    `;
}

async function loadHistory() {
    try {
        // Инициализируем элементы каждый раз
        getHistoryElements();
        
        // Если элементы не найдены, пробуем еще раз через небольшую задержку
        if (!historyListVisible || !historyListHidden || !historyAccordionBtn) {
            await new Promise(resolve => setTimeout(resolve, 100));
            getHistoryElements();
        }
        
        if (!historyListVisible || !historyListHidden) {
            console.error("History elements not found", { historyListVisible, historyListHidden });
            return;
        }
        
        if (!authToken) {
            console.error("No auth token available");
            if (historyListVisible) {
                historyListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            }
            if (historyAccordionBtn) historyAccordionBtn.classList.add('hidden');
            return;
        }
        
        const res = await fetch(`${API_BASE}/xp/full-history?limit=30`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load history:", res.status, res.statusText, errorText);
            if (historyListVisible) {
                historyListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки истории</div>';
            }
            if (historyAccordionBtn) historyAccordionBtn.classList.add('hidden');
            return;
        }
        
        const data = await res.json();
        
        historyListVisible.innerHTML = '';
        historyListHidden.innerHTML = '';
        
        if (data.length === 0) {
            historyListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">История пуста</div>';
            historyAccordionBtn.classList.add('hidden');
            return;
        }
        
        const visibleHistory = data.slice(0, 4);
        const hiddenHistory = data.slice(4);
        
        visibleHistory.forEach(item => {
            historyListVisible.innerHTML += renderHistoryItem(item);
        });
        
        if (hiddenHistory.length > 0) {
            hiddenHistory.forEach(item => {
                historyListHidden.innerHTML += renderHistoryItem(item);
            });
            historyAccordionBtn.classList.remove('hidden');
            // Загружаем состояние аккордеона из localStorage после добавления элементов
            setTimeout(() => {
                updateHistoryAccordionButton();
            }, 0);
        } else {
            historyAccordionBtn.classList.add('hidden');
        }
    } catch (e) {
        console.error("Error loading history", e);
    }
}

// ============= ACCORDION FUNCTIONS =============
function toggleRewardsAccordion() {
    getRewardsElements();
    if (!rewardsListHidden || !rewardsAccordionBtn) {
        console.error("Rewards accordion elements not found");
        return;
    }
    
    const isHidden = rewardsListHidden.classList.contains('hidden');
    const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
    const text = rewardsAccordionBtn.querySelector('.accordion-text');
    
    if (!icon || !text) return;
    
    if (isHidden) {
        // Показываем скрытые элементы
        rewardsListHidden.classList.remove('hidden');
        // Устанавливаем реальную высоту для плавной анимации
        const height = rewardsListHidden.scrollHeight;
        rewardsListHidden.style.maxHeight = height + 'px';
        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_rewards');
        localStorage.setItem('rewardsAccordionExpanded', 'true');
    } else {
        // Скрываем элементы
        rewardsListHidden.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_rewards');
        localStorage.setItem('rewardsAccordionExpanded', 'false');
        setTimeout(() => {
            if (rewardsListHidden && rewardsListHidden.style.maxHeight === '0px') {
                rewardsListHidden.classList.add('hidden');
            }
        }, 400);
    }
}

function updateRewardsAccordionButton() {
    getRewardsElements();
    if (!rewardsListHidden || !rewardsAccordionBtn) return;
    
    const isExpanded = localStorage.getItem('rewardsAccordionExpanded') === 'true';
    const icon = rewardsAccordionBtn.querySelector('.accordion-icon');
    const text = rewardsAccordionBtn.querySelector('.accordion-text');
    
    if (!icon || !text) return;
    
    if (isExpanded) {
        rewardsListHidden.classList.remove('hidden');
        const height = rewardsListHidden.scrollHeight;
        rewardsListHidden.style.maxHeight = height + 'px';
        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_rewards');
    } else {
        rewardsListHidden.classList.add('hidden');
        rewardsListHidden.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_rewards');
    }
}

function toggleHistoryAccordion() {
    getHistoryElements();
    if (!historyListHidden || !historyAccordionBtn) {
        console.error("History accordion elements not found");
        return;
    }
    
    const isHidden = historyListHidden.classList.contains('hidden');
    const icon = historyAccordionBtn.querySelector('.accordion-icon');
    const text = historyAccordionBtn.querySelector('.accordion-text');
    
    if (!icon || !text) return;
    
    if (isHidden) {
        // Показываем скрытые элементы
        historyListHidden.classList.remove('hidden');
        // Устанавливаем реальную высоту для плавной анимации
        const height = historyListHidden.scrollHeight;
        historyListHidden.style.maxHeight = height + 'px';
        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_history');
        localStorage.setItem('historyAccordionExpanded', 'true');
    } else {
        // Скрываем элементы
        historyListHidden.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_history');
        localStorage.setItem('historyAccordionExpanded', 'false');
        setTimeout(() => {
            if (historyListHidden && historyListHidden.style.maxHeight === '0px') {
                historyListHidden.classList.add('hidden');
            }
        }, 400);
    }
}

function updateHistoryAccordionButton() {
    getHistoryElements();
    if (!historyListHidden || !historyAccordionBtn) return;
    
    const isExpanded = localStorage.getItem('historyAccordionExpanded') === 'true';
    const icon = historyAccordionBtn.querySelector('.accordion-icon');
    const text = historyAccordionBtn.querySelector('.accordion-text');
    
    if (!icon || !text) return;
    
    if (isExpanded) {
        historyListHidden.classList.remove('hidden');
        const height = historyListHidden.scrollHeight;
        historyListHidden.style.maxHeight = height + 'px';
        icon.style.transform = 'rotate(180deg)';
        text.textContent = t('hide_history');
    } else {
        historyListHidden.classList.add('hidden');
        historyListHidden.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        text.textContent = t('show_all_history');
    }
}

// ============= ACTIVITIES =============
async function loadActivities() {
    try {
        const activitiesListEl = document.getElementById('activities-list');
        if (!activitiesListEl) {
            console.warn("Activities list element not found");
            return;
        }
        
        if (!authToken) {
            console.error("No auth token available");
            activitiesListEl.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            return;
        }
        
        const res = await fetch(`${API_BASE}/activities/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load activities:", res.status, res.statusText, errorText);
            activitiesListEl.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки активностей</div>';
            return;
        }
        
        const data = await res.json();
        allActivities = data;
        activitiesListEl.innerHTML = "";
        
        if (data.length === 0) {
            activitiesListEl.innerHTML = '<div class="text-center text-gray-400 py-4">Нет активностей. Создайте первую активность!</div>';
            return;
        }
        
        data.forEach(renderActivityCard);
    } catch (e) {
        console.error("Error loading activities", e);
        const activitiesListEl = document.getElementById('activities-list');
        if (activitiesListEl) {
            activitiesListEl.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки активностей</div>';
        }
    }
}

function renderActivityCard(activity) {
    const div = document.createElement("div");
    div.className = "activity-card p-4 mb-3 rounded-xl bg-white/80 border border-blue-100 shadow-sm hover:shadow-lg flex items-center justify-between gap-3";
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
    
    const left = document.createElement("div");
    left.className = "flex-grow";
    left.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
            <div class="text-lg font-semibold text-gray-800">${activity.name}</div>
            <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">${categoryName}</span>
        </div>
        <div class="text-sm text-gray-500">${activity.xp_per_hour} XP/час</div>
    `;

    // Timer button
    const timerBtn = document.createElement("button");
    timerBtn.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2";
    timerBtn.innerHTML = '<i class="fas fa-play text-green-500"></i> Старт';
    timerBtn.dataset.activityId = activity.id;
    timerBtn.addEventListener("click", (e) => toggleTimer(activity.id, e.currentTarget, activity));

    // Manual time button
    const manualTimeBtn = document.createElement("button");
    manualTimeBtn.className = "manual-time-btn p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    manualTimeBtn.innerHTML = '<i class="fas fa-clock"></i>';
    manualTimeBtn.title = "Добавить время вручную";
    manualTimeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openManualTimeModal(activity.id);
    });

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = "Редактировать";
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditModal(activity);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = "Удалить";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteActivity(activity.id, div);
    });

    div.appendChild(left);
    div.appendChild(timerBtn);
    div.appendChild(manualTimeBtn);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    activitiesList.appendChild(div);
}

async function createActivity() {
    const name = activityNameInput.value.trim();
    const xp = xpPerHourInput ? Number(xpPerHourInput.value) || 60 : 60;
    const categoryEl = document.getElementById("activity-category");
    const category = categoryEl ? (categoryEl.value || "general") : "general";
    
    if (!name) {
        showActivityMessage("Введите название активности", "error");
        return;
    }
    
    const duplicate = allActivities.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        showActivityMessage(`❌ "${name}" уже существует!`, "error");
        activityNameInput.focus();
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/activities/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_per_hour: xp, category: category })
        });
        
        if (!res.ok) {
            const error = await res.json();
            showActivityMessage(error.detail || "Ошибка создания", "error");
            return;
        }
        
        const created = await res.json();
        activityNameInput.value = "";
        if (xpPerHourInput) xpPerHourInput.value = "60";
        allActivities.push(created);
        renderActivityCard(created);
        showActivityMessage(`✅ "${created.name}" создана!`, "success");
    } catch (e) {
        console.error("Error:", e);
        showActivityMessage("Ошибка соединения", "error");
    }
}

function openEditModal(activity) {
    // Обновляем dropdown категорий перед открытием модального окна
    updateCategoryDropdown('edit-activity-category');
    
    document.getElementById("edit-activity-id").value = activity.id;
    document.getElementById("edit-activity-name").value = activity.name;
    document.getElementById("edit-xp-per-hour").value = activity.xp_per_hour;
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
    document.getElementById("edit-activity-modal").classList.remove("hidden");
}

function closeEditModal() {
    document.getElementById("edit-activity-modal").classList.add("hidden");
    document.getElementById("edit-activity-form").reset();
}

async function updateActivity() {
    const id = document.getElementById("edit-activity-id").value;
    const name = document.getElementById("edit-activity-name").value.trim();
    const xpPerHour = Number(document.getElementById("edit-xp-per-hour").value) || 60;
    const categoryEl = document.getElementById("edit-activity-category");
    const category = categoryEl ? categoryEl.value || "general" : "general";

    if (!name) {
        alert(t('enter_activity_name'));
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/activities/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_per_hour: xpPerHour, category: category })
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || t('error_updating'));
            return;
        }

        closeEditModal();
        await loadActivities();
        showActivityMessage(`✅ ${t('activity_updated')}`, "success");
    } catch (e) {
        console.error("Error:", e);
        alert(t('network_error'));
    }
}

async function deleteActivity(activityId, cardElement) {
    if (!confirm("Удалить активность?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/activities/${activityId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            alert("Ошибка удаления");
            return;
        }
        
        cardElement.style.transition = "all 0.3s ease";
        cardElement.style.opacity = "0";
        cardElement.style.transform = "translateX(-20px)";
        setTimeout(() => cardElement.remove(), 300);
        allActivities = allActivities.filter(a => a.id != activityId);
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

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
async function toggleTimer(activityId, button, activity) {
    const isActive = activeTimers.has(activityId);
    if (isActive) {
        await stopTimer(activityId, button);
    } else {
        await startTimer(activityId, button, activity);
    }
}

async function startTimer(activityId, button, activity) {
    try {
        const res = await fetch(`${API_BASE}/timer/start?activity_id=${activityId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        const data = await res.json();
        const logId = data.log_id;
        const startTime = Date.now();
        const timerInfo = { logId, startTime, intervalId: null, activity };
        activeTimers.set(activityId, timerInfo);
        
        button.innerHTML = '<i class="fas fa-stop text-red-500"></i> <span id="timer-' + activityId + '">00:00</span>';
        button.className = "timer-btn px-6 py-2 rounded-xl text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 transition-all duration-300";
        
        const intervalId = setInterval(() => updateTimerDisplay(activityId, startTime, activity), 1000);
        timerInfo.intervalId = intervalId;
    } catch (e) {
        console.error("Error starting timer:", e);
        alert("Ошибка запуска таймера");
    }
}

function updateTimerDisplay(activityId, startTime, activity) {
    const elapsedMs = Date.now() - startTime;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    const timerSpan = document.getElementById(`timer-${activityId}`);
    
    if (timerSpan) {
        const xpPerSecond = activity.xp_per_hour / 3600;
        const earnedXP = Math.round(elapsedSeconds * xpPerSecond);
        timerSpan.textContent = `${minutes}:${seconds} (+${earnedXP} XP)`;
    }
}

async function stopTimer(activityId, button) {
    const timerInfo = activeTimers.get(activityId);
    if (!timerInfo || !timerInfo.logId) {
        alert("Таймер не запущен");
        return;
    }
    
    if (timerInfo.intervalId) {
        clearInterval(timerInfo.intervalId);
    }
    
    try {
        const res = await fetch(`${API_BASE}/timer/stop/${timerInfo.logId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        const data = await res.json();
        activeTimers.delete(activityId);
        
        button.innerHTML = '<i class="fas fa-play text-green-500"></i> Старт';
        button.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2 transition-all duration-300";
        
        await loadWallet();
        loadTodayStats(); // Обновляем статистику
        loadWeekCalendar(); // Обновляем календарь
        loadStreak(); // Обновляем streak
        
        let message = `✅ Таймер остановлен! Заработано ${Math.round(data.xp_earned)} XP`;
        if (data.streak_bonus && data.streak_bonus > 0) {
            message += `\n🔥 Бонус за серию: +${data.streak_bonus} XP`;
        }
        if (data.completed_goals && data.completed_goals.length > 0) {
            message += `\n🎯 Цель выполнена: ${data.completed_goals.join(", ")}`;
            loadGoals(); // Обновляем список целей
        }
        alert(message);
    } catch (e) {
        console.error("Error stopping timer:", e);
        alert("Ошибка остановки таймера");
    }
}


// ============= MANUAL TIME =============
function openManualTimeModal(activityId) {
    const select = document.getElementById("manual-activity-select");
    select.innerHTML = '<option value="">Выберите активность</option>';
    allActivities.forEach(activity => {
        const option = document.createElement("option");
        option.value = activity.id;
        option.textContent = `${activity.name} (${activity.xp_per_hour} XP/час)`;
        select.appendChild(option);
    });
    select.value = activityId;
    document.getElementById("manual-minutes").value = "";
    document.getElementById("manual-time-preview").classList.add("hidden");
    document.getElementById("manual-time-modal").classList.remove("hidden");
}

function closeManualTimeModal() {
    document.getElementById("manual-time-modal").classList.add("hidden");
}

function updateManualPreview(activityId) {
    const minutes = document.getElementById("manual-minutes").value;
    const preview = document.getElementById("manual-time-preview");
    if (activityId && minutes) {
        const activity = allActivities.find(a => a.id == activityId);
        if (activity) {
            const xp = Math.round((minutes / 60) * activity.xp_per_hour);
            preview.textContent = `+${xp} XP`;
            preview.classList.remove("hidden");
        }
    } else {
        preview.classList.add("hidden");
    }
}

async function addManualTime() {
    const activityId = document.getElementById("manual-activity-select").value;
    const minutes = Number(document.getElementById("manual-minutes").value);
    
    if (!activityId || !minutes || minutes < 1) {
        alert("Выберите активность и укажите минуты");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/timer/manual`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ activity_id: Number(activityId), minutes })
        });
        
        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Ошибка добавления времени");
            return;
        }
        
        const data = await res.json();
        closeManualTimeModal();
        await loadWallet();
        showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${minutes} мин!`, "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
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

async function loadRewards() {
    try {
        // Инициализируем элементы каждый раз, так как они могут быть в скрытой секции
        getRewardsElements();
        
        // Если элементы не найдены, пробуем еще раз через небольшую задержку
        if (!rewardsListVisible || !rewardsListHidden || !rewardsAccordionBtn) {
            await new Promise(resolve => setTimeout(resolve, 100));
            getRewardsElements();
        }
        
        if (!rewardsListVisible || !rewardsListHidden || !rewardsAccordionBtn) {
            console.error("Rewards elements not found", { 
                rewardsListVisible, 
                rewardsListHidden, 
                rewardsAccordionBtn,
                appSection: document.getElementById("app-section")?.classList.contains("hidden")
            });
            return;
        }
        
        if (!authToken) {
            console.error("No auth token available");
            if (rewardsListVisible) {
                rewardsListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            }
            if (rewardsAccordionBtn) rewardsAccordionBtn.classList.add('hidden');
            return;
        }
        
        const res = await fetch(`${API_BASE}/rewards/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load rewards:", res.status, res.statusText, errorText);
            if (rewardsListVisible) {
                rewardsListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки наград</div>';
            }
            if (rewardsAccordionBtn) rewardsAccordionBtn.classList.add('hidden');
            return;
        }
        
        const data = await res.json();
        allRewards = data;
        
        // Еще раз проверяем элементы перед использованием
        if (!rewardsListVisible || !rewardsListHidden) {
            console.error("Rewards elements lost after fetch, retrying...");
            getRewardsElements();
            if (!rewardsListVisible || !rewardsListHidden) {
                console.error("Rewards elements still not found");
                return;
            }
        }
        
        // Финальная проверка элементов перед использованием
        getRewardsElements();
        if (!rewardsListVisible || !rewardsListHidden) {
            console.error("Rewards elements are null before innerHTML operations");
            return;
        }
        
        // Безопасно очищаем содержимое
        try {
            rewardsListVisible.innerHTML = "";
            rewardsListHidden.innerHTML = "";
        } catch (e) {
            console.error("Error clearing rewards lists:", e);
            return;
        }
        
        if (data.length === 0) {
            try {
                rewardsListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Наград пока нет</div>';
            } catch (e) {
                console.error("Error setting empty rewards message:", e);
            }
            if (rewardsAccordionBtn) {
                rewardsAccordionBtn.classList.add('hidden');
            }
            return;
        }
        
        const visibleRewards = data.slice(0, 4);
        const hiddenRewards = data.slice(4);
        
        // Проверяем элементы перед рендерингом
        if (!rewardsListVisible) {
            console.error("rewardsListVisible is null before rendering visible rewards");
            return;
        }
        
        visibleRewards.forEach(reward => {
            const div = renderRewardCard(reward);
            if (div && rewardsListVisible) {
                rewardsListVisible.appendChild(div);
            }
        });
        
        if (hiddenRewards.length > 0) {
            if (!rewardsListHidden) {
                console.error("rewardsListHidden is null before rendering hidden rewards");
                return;
            }
            
            hiddenRewards.forEach(reward => {
                const div = renderRewardCard(reward);
                if (div && rewardsListHidden) {
                    rewardsListHidden.appendChild(div);
                }
            });
            
            if (rewardsAccordionBtn) {
                rewardsAccordionBtn.classList.remove('hidden');
                // Загружаем состояние аккордеона из localStorage после добавления элементов
                setTimeout(() => {
                    updateRewardsAccordionButton();
                }, 0);
            }
        } else {
            if (rewardsAccordionBtn) {
                rewardsAccordionBtn.classList.add('hidden');
            }
        }
    } catch (e) {
        console.error("Error loading rewards:", e);
    }
}

function renderRewardCard(reward) {
    const brand = detectBrand(reward.name);
    
    const div = document.createElement("div");
    div.className = `reward-card group relative p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border-2 ${brand.borderColor} hover:shadow-md hover:border-opacity-80 transition-all duration-200 w-full max-w-full overflow-hidden`;

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
    spendBtn.innerHTML = '<i class="fas fa-shopping-bag text-xs"></i><span class="hidden sm:inline">Купить</span>';
    spendBtn.addEventListener("click", () => spendReward(reward.id));
    btnContainer.appendChild(spendBtn);

    mainSection.appendChild(leftSection);
    mainSection.appendChild(btnContainer);

    div.appendChild(mainSection);
    return div;
}

async function createReward() {
    const name = rewardNameInput.value.trim();
    const xpCost = rewardCostInput ? Number(rewardCostInput.value) : 0;

    if (!name || xpCost <= 0) {
        showRewardMessage("Введите корректное название и стоимость", "error");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/rewards/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_cost: xpCost })
        });

        if (!res.ok) {
            const error = await res.json();
            showRewardMessage(error.detail || "Ошибка создания", "error");
            return;
        }

        const created = await res.json();
        rewardNameInput.value = "";
        rewardCostInput.value = "10";
        allRewards.push(created);
        renderRewardCard(created);
        showRewardMessage(`✅ "${created.name}" создана!`, "success");
    } catch (e) {
        console.error("Error:", e);
        showRewardMessage("Ошибка соединения", "error");
    }
}

function openEditRewardModal(reward) {
    document.getElementById("edit-reward-id").value = reward.id;
    document.getElementById("edit-reward-name").value = reward.name;
    document.getElementById("edit-reward-cost").value = reward.xp_cost;
    document.getElementById("edit-reward-modal").classList.remove("hidden");
}

function closeEditRewardModal() {
    document.getElementById("edit-reward-modal").classList.add("hidden");
}

async function updateReward() {
    const id = document.getElementById("edit-reward-id").value;
    const name = document.getElementById("edit-reward-name").value.trim();
    const xpCost = Number(document.getElementById("edit-reward-cost").value) || 0;
    
    if (!name || xpCost <= 0) {
        alert("Введите корректное название и стоимость");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/rewards/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, xp_cost: xpCost })
        });
        
        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || "Ошибка обновления");
            return;
        }
        
        closeEditRewardModal();
        await loadRewards();
        showRewardMessage("✅ Награда обновлена!", "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

async function deleteReward(rewardId, cardElement) {
    if (!confirm("Удалить награду?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/rewards/${rewardId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            alert("Ошибка удаления");
            return;
        }
        
        cardElement.style.transition = "all 0.3s ease";
        cardElement.style.opacity = "0";
        cardElement.style.transform = "translateX(-20px)";
        setTimeout(() => {
            cardElement.remove();
            // Перезагружаем список наград для правильного распределения по видимым/скрытым
            loadRewards();
        }, 300);
        allRewards = allRewards.filter(r => r.id != rewardId);
        showRewardMessage("✅ Награда удалена!", "success");
    } catch (e) {
        console.error("Error:", e);
        alert("Ошибка сети");
    }
}

async function spendReward(rewardId) {
    if (!rewardMessage) return;
    
    rewardMessage.classList.remove("hidden", "text-red-500", "text-green-600");
    rewardMessage.classList.add("text-gray-500");
    rewardMessage.textContent = "Проверяем баланс...";
    
    try {
        const res = await fetch(`${API_BASE}/rewards/spend/${rewardId}`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            let errorMsg = data.detail || "Не удалось потратить XP";
            // Проверяем, это блокировка из черного списка
            if (res.status === 403) {
                errorMsg = `🚫 ${errorMsg}`;
            }
            rewardMessage.textContent = errorMsg;
            rewardMessage.classList.remove("text-gray-500");
            rewardMessage.classList.add("text-red-500");
            showNotification(errorMsg, 'error');
            return;
        }
        
        // Успешная покупка
        const successMsg = `✅ ${t('reward_received').replace('{reward}', data.reward).replace('{spent}', data.spent).replace('{balance}', Math.round(data.new_balance))}`;
        rewardMessage.textContent = successMsg;
        rewardMessage.classList.remove("text-gray-500");
        rewardMessage.classList.add("text-green-600");
        
        // Показываем уведомление
        showNotification(`✅ ${t('reward_purchased').replace('{reward}', data.reward).replace('{spent}', data.spent)}`, 'success');
        
        // Обновляем все данные
        await loadWallet();
        await loadHistory(); // Обновляем историю транзакций
        loadTodayStats(); // Обновляем статистику
    } catch (e) {
        console.error("Error:", e);
        const errorMsg = t('connection_error');
        rewardMessage.textContent = errorMsg;
        rewardMessage.classList.remove("text-gray-500");
        rewardMessage.classList.add("text-red-500");
        showNotification(errorMsg, 'error');
    }
}

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

// ============= INITIALIZATION =============
window.addEventListener("DOMContentLoaded", () => {
    // Сразу проверяем токен и скрываем auth-section если он есть
    if (authToken) {
        authSection.classList.add("hidden");
        appSection.classList.remove("hidden");
    }
    // Check auth on load
    checkAuth();

    // Login form
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        login(email, password);
    });

    // Register form
    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("register-email").value;
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;
        const passwordConfirm = document.getElementById("register-password-confirm").value;
        
        if (password !== passwordConfirm) {
            document.getElementById("register-error").textContent = "Пароли не совпадают";
            document.getElementById("register-error").classList.remove("hidden");
            return;
        }
        
        register(email, username, password);
    });

    // Activity form
    if (newActivityForm) {
        newActivityForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createActivity();
        });
    }

    // Reward form
    if (newRewardForm) {
        newRewardForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createReward();
        });
    }

    // Manual time form
    const manualForm = document.getElementById("manual-time-form");
    if (manualForm) {
        manualForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await addManualTime();
        });
        
        document.getElementById("manual-minutes").addEventListener("input", () => {
            const activityId = document.getElementById("manual-activity-select").value;
            updateManualPreview(activityId);
        });
        
        document.getElementById("manual-activity-select").addEventListener("change", (e) => {
            updateManualPreview(e.target.value);
        });
    }

    // Edit activity form
    const editForm = document.getElementById("edit-activity-form");
    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await updateActivity();
        });
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

// ============= FORGOT PASSWORD =============
let resetCodeEmail = null;

function showForgotPassword() {
    document.getElementById("forgot-password-modal").classList.remove("hidden");
    document.getElementById("forgot-step1").classList.remove("hidden");
    document.getElementById("forgot-step2").classList.add("hidden");
    resetCodeEmail = null;
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
async function loadStreak() {
    try {
        const res = await fetch(`${API_BASE}/streak/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        
        const countEl = document.getElementById('streak-count');
        const recordEl = document.getElementById('streak-record');
        const messageEl = document.getElementById('streak-message');
        
        if (countEl) countEl.textContent = data.current_streak;
        if (recordEl) recordEl.textContent = `${data.longest_streak} дней`;
        
        if (messageEl) {
            if (data.current_streak === 0) {
                messageEl.textContent = "Начните активность, чтобы начать серию!";
            } else if (data.current_streak === 1) {
                messageEl.textContent = "🔥 Отличное начало! Продолжайте завтра!";
            } else if (data.current_streak < 7) {
                messageEl.textContent = `🔥 ${data.current_streak} дней подряд! Продолжайте!`;
            } else if (data.current_streak < 30) {
                messageEl.textContent = `🔥 Неделя подряд! Вы получаете бонусы XP!`;
            } else {
                messageEl.textContent = `🔥 Месяц без пропусков! Вы получаете +100 XP бонус!`;
            }
        }
    } catch (e) {
        console.error("Error loading streak", e);
    }
}

// ============= RECOMMENDATIONS =============
async function loadRecommendations() {
    try {
        const listEl = document.getElementById('recommendations-list');
        if (!listEl) {
            console.warn("Recommendations list element not found");
            return;
        }
        
        if (!authToken) {
            console.error("No auth token available");
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${t('auth_required')}</div>`;
            return;
        }
        
        const res = await fetch(`${API_BASE}/recommendations/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load recommendations:", res.status, res.statusText, errorText);
            listEl.innerHTML = `<div class="text-center text-red-400 py-4 text-xs">${t('error_loading_recommendations')}</div>`;
            return;
        }
        
        const data = await res.json();
        
        if (!data.recommendations || data.recommendations.length === 0) {
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${t('no_recommendations')}</div>`;
            return;
        }
        
        listEl.innerHTML = data.recommendations.map(rec => {
            let icon = "fas fa-lightbulb";
            let bgColor = "bg-blue-50";
            let borderColor = "border-blue-200";
            let textColor = "text-blue-700";
            let iconBgColor = "bg-blue-100";
            
            if (rec.priority === "high") {
                icon = "fas fa-fire";
                bgColor = "bg-orange-50";
                borderColor = "border-orange-300";
                textColor = "text-orange-700";
                iconBgColor = "bg-orange-100";
            } else if (rec.priority === "medium") {
                icon = "fas fa-exclamation-circle";
                bgColor = "bg-amber-50";
                borderColor = "border-amber-200";
                textColor = "text-amber-700";
                iconBgColor = "bg-amber-100";
            }
            
            // Генерируем локализованное сообщение на основе типа
            let localizedMessage = rec.message; // Fallback на оригинальное сообщение
            if (rec.type === "continue" && rec.activity_name) {
                localizedMessage = t('rec_continue').replace('{activity}', rec.activity_name);
            } else if (rec.type === "reminder" && rec.activity_name && rec.days_since) {
                localizedMessage = t('rec_reminder')
                    .replace('{activity}', rec.activity_name)
                    .replace('{days}', rec.days_since);
            } else if (rec.type === "more" && rec.activity_name && rec.minutes_today !== undefined) {
                localizedMessage = t('rec_more')
                    .replace('{activity}', rec.activity_name)
                    .replace('{minutes}', rec.minutes_today);
            } else if (rec.type === "new" && rec.activity_name) {
                localizedMessage = t('rec_new').replace('{activity}', rec.activity_name);
            } else if (rec.type === "info") {
                localizedMessage = t('rec_info');
            }
            
            // Проверяем, начата ли активность (не начата = есть activity_id, но нет активного таймера)
            const isNotStarted = rec.activity_id && !activeTimers.has(rec.activity_id);
            const notStartedStyles = isNotStarted 
                ? "border-2 border-dashed border-emerald-400 bg-gradient-to-r from-emerald-50/50 to-green-50/50 shadow-sm" 
                : "";
            
            let actionBtn = '';
            if (rec.activity_id) {
                actionBtn = `<button onclick="startActivityFromRecommendation(${rec.activity_id})" class="ml-auto w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all flex-shrink-0" title="${t('start_tracking')}">
                    <i class="fas fa-play text-[10px] md:text-xs"></i>
                </button>`;
            }
            
            return `
                <div class="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl ${bgColor} border ${borderColor} ${notStartedStyles} transition-all hover:shadow-md hover:border-opacity-80 group">
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <i class="fas fa-caret-right text-emerald-500 text-sm md:text-base"></i>
                        <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg ${iconBgColor} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <i class="${icon} ${textColor} text-xs md:text-sm"></i>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium ${textColor} text-xs md:text-sm leading-tight">${localizedMessage}</div>
                    </div>
                    ${actionBtn}
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error loading recommendations", e);
    }
}

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

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаём элемент уведомления
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.style.maxWidth = '400px';
    notification.style.zIndex = '9999'; // Высокий z-index, чтобы показываться поверх всех элементов
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Удаляем через 4 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============= ADMIN PANEL =============
async function loadInviteCode() {
    try {
        const res = await fetch(`${API_BASE}/admin/invite-code`, {
            headers: { "Authorization": `Bearer ${authToken}` }
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
            headers: { "Authorization": `Bearer ${authToken}` }
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
            headers: { "Authorization": `Bearer ${authToken}` }
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
    document.getElementById("child-stats-modal").classList.remove("hidden");
    document.getElementById("child-stats-name").textContent = `${t('stats_for')} ${childName}`;
    document.getElementById("child-stats-content").innerHTML = `<div class="text-center text-gray-400 py-8">${t('loading')}</div>`;
    
    try {
        const categoryFilter = document.getElementById('admin-category-filter');
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        
        // Загружаем статистику
        const [statsRes, historyRes, activitiesRes, goalsRes, categoryStatsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/child/${childId}/stats`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/history?limit=20`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/activities${selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/goals`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE}/admin/child/${childId}/category-stats?period=week`, {
                headers: { "Authorization": `Bearer ${authToken}` }
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
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${Math.round(stats.balance)}</div>
                    <div class="text-sm opacity-90">Баланс XP</div>
                </div>
                <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${stats.level}</div>
                    <div class="text-sm opacity-90">Уровень</div>
                </div>
                <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${stats.current_streak}</div>
                    <div class="text-sm opacity-90">Серия дней</div>
                </div>
                <div class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                    <div class="text-2xl font-black">${stats.activities_count}</div>
                    <div class="text-sm opacity-90">Активностей</div>
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
                                <div class="text-xs text-gray-500">${Math.round(cat.total_time)} мин • ${cat.activity_count} активностей</div>
                            </div>
                        `;
                    }).join('') : '<div class="text-center text-gray-400 py-4">Нет данных по категориям</div>'}
                </div>
            </div>
            
            <!-- Активности -->
            <div class="mb-4">
                <h4 class="font-bold text-gray-800 mb-3">🎯 Активности</h4>
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
                            <div class="text-xs text-gray-600">${act.xp_per_hour} XP/час</div>
                        </div>
                    `;
                    }).join('') : '<div class="text-gray-400 text-sm">Нет активностей</div>'}
                </div>
            </div>
            
            <!-- Цели -->
            <div>
                <h4 class="font-bold text-gray-800 mb-3">🎯 Цели</h4>
                <div class="space-y-2">
                    ${goals.length > 0 ? goals.map(goal => {
                        const progressPercent = goal.target_xp > 0 ? Math.min((goal.current_xp / goal.target_xp) * 100, 100) : 0;
                        const isCompleted = goal.is_completed === 1;
                        return `
                            <div class="p-3 bg-purple-50 rounded-lg border ${isCompleted ? 'border-green-300' : 'border-purple-200'}">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="font-medium text-gray-800 text-sm">${goal.title}</div>
                                    ${isCompleted ? '<span class="text-green-600 text-xs">✓ Выполнено</span>' : ''}
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
                    }).join('') : '<div class="text-gray-400 text-sm">Нет целей</div>'}
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

async function loadCategories() {
    try {
        if (!authToken) {
            // Даже без токена обновляем dropdown с базовыми категориями
            updateCategoryDropdown('activity-category');
            updateCategoryDropdown('edit-activity-category');
            return;
        }
        
        const res = await fetch(`${API_BASE}/categories/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
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

function updateCategoryDropdown(selectId) {
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
    addOption.innerHTML = '<span class="text-blue-600 font-semibold">➕ Добавить категорию</span>';
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
    leftPart.className = 'flex-1 min-w-0 pr-2';
    leftPart.textContent = name;
    leftPart.style.wordBreak = 'break-word';
    
    option.appendChild(leftPart);
    
    // Категория "Общее" - захардкоженная, без кнопок редактирования и удаления
    if (value === 'general') {
        // Для категории "Общее" не добавляем кнопки
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

async function saveCategory() {
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
                    'Authorization': `Bearer ${authToken}`
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
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify({ name })
                    });
                } else {
                    // Создаем новую пользовательскую категорию и обновляем активности
                    res = await fetch(`${API_BASE}/categories/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
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
                        'Authorization': `Bearer ${authToken}`
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

async function deleteCategory(categoryId) {
    if (!confirm('Удалить эту категорию? Активности с этой категорией будут переведены в "Общее".')) {
        return;
    }
    
    try {
        const dbId = categoryId.replace('custom_', '');
        const res = await fetch(`${API_BASE}/categories/${dbId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
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
async function loadGoals() {
    try {
        const listEl = document.getElementById('goals-list');
        if (!listEl) {
            console.warn("Goals list element not found");
            return;
        }
        
        if (!authToken) {
            console.error("No auth token available");
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${t('auth_required')}</div>`;
            return;
        }
        
        const res = await fetch(`${API_BASE}/goals/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load goals:", res.status, res.statusText, errorText);
            listEl.innerHTML = `<div class="text-center text-red-400 py-4 text-xs">${t('error_loading_goals')}</div>`;
            return;
        }
        
        let data = await res.json();
        
        if (data.length === 0) {
            listEl.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${t('no_goals')}</div>`;
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
        
        listEl.innerHTML = data.map(goal => {
            const progressPercent = goal.target_xp > 0 ? Math.min((goal.current_xp / goal.target_xp) * 100, 100) : 0;
            const isCompleted = goal.is_completed === 1;
            const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;
            
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
                                <button onclick="editGoal(${goal.id})" class="w-5 h-5 md:w-6 md:h-6 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-all" title="Редактировать">
                                    <i class="fas fa-edit text-[9px] md:text-[10px]"></i>
                                </button>
                                <button onclick="deleteGoal(${goal.id})" class="w-5 h-5 md:w-6 md:h-6 rounded bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all" title="Удалить">
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
    document.getElementById("goal-modal-title").textContent = t('new_goal');
    document.getElementById("goal-submit-btn").innerHTML = `<i class="fas fa-check mr-2"></i>${t('create_goal_btn')}`;
    document.getElementById("edit-goal-id").value = "";
    document.getElementById("create-goal-modal").classList.remove("hidden");
    // Загружаем список активностей для выбора
    loadActivitiesForGoal();
    // Очищаем форму
    document.getElementById("create-goal-form").reset();
}

function closeCreateGoalModal() {
    document.getElementById("create-goal-modal").classList.add("hidden");
    document.getElementById("create-goal-form").reset();
    document.getElementById("edit-goal-id").value = "";
}

async function editGoal(goalId) {
    try {
        // Загружаем данные цели
        const res = await fetch(`${API_BASE}/goals/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
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
        
        // Загружаем активности и выбираем нужную
        await loadActivitiesForGoal();
        if (goal.activity_id) {
            document.getElementById("goal-activity").value = goal.activity_id;
        }
        
        // Меняем заголовок и кнопку
        document.getElementById("goal-modal-title").textContent = "✏️ Редактировать цель";
        document.getElementById("goal-submit-btn").innerHTML = '<i class="fas fa-save mr-2"></i>Сохранить изменения';
        
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
            headers: { "Authorization": `Bearer ${authToken}` }
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
        
        select.innerHTML = '<option value="">-- Выберите активность --</option>';
        
        if (data.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Сначала создайте активность";
            option.disabled = true;
            select.appendChild(option);
            return;
        }
        
        data.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.id;
            option.textContent = `${activity.name} (${activity.xp_per_hour} XP/час)`;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Error loading activities for goal:", e);
        alert("Ошибка загрузки активностей: " + e.message);
    }
}

async function createGoal() {
    const goalId = document.getElementById("edit-goal-id").value;
    const title = document.getElementById("goal-title").value.trim();
    const description = document.getElementById("goal-description").value.trim();
    const targetXp = parseFloat(document.getElementById("goal-target-xp").value);
    const activityId = document.getElementById("goal-activity").value;
    const targetDate = document.getElementById("goal-target-date").value;
    
    if (!title || !targetXp || targetXp <= 0) {
        alert(t('fill_title_and_xp'));
        return;
    }
    
    if (!activityId) {
        alert(t('select_activity_for_goal'));
        return;
    }
    
    try {
        // Если есть ID - это редактирование, иначе - создание
        if (goalId) {
            // Редактирование
            const res = await fetch(`${API_BASE}/goals/${goalId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
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
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    target_xp: targetXp,
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

async function deleteGoal(goalId) {
    if (!confirm(t('delete_goal_confirm'))) return;
    
    try {
        const res = await fetch(`${API_BASE}/goals/${goalId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (!res.ok) throw new Error(t('error_deleting'));
        
        loadGoals();
        showNotification(`✅ ${t('goal_deleted')}`, 'success');
    } catch (e) {
        alert(t('error_deleting_goal'));
    }
}

