// Автоматически определяем базовый URL API из текущего домена
const API_BASE = window.location.origin;

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
        "link_telegram": "Прив'язати Telegram",
        "link_telegram_title": "Прив'язати Telegram акаунт",
        "telegram_link_instructions": "Щоб прив'язати Telegram акаунт:",
        "telegram_link_step1": "Відкрийте бота в Telegram та надішліть /start",
        "telegram_link_step2": "Скопіюйте ваш Telegram ID з повідомлення бота",
        "telegram_link_step3": "Вставте його в поле нижче та натисніть \"Прив'язати\"",
        "telegram_id_label": "Telegram ID:",
        "telegram_id_hint": "Ваш Telegram ID був показаний ботом у повідомленні",
        "link_button": "Прив'язати",
        "telegram_linked": "Telegram акаунт прив'язано",
        "telegram_linked_success": "Telegram акаунт успішно прив'язано!",
        "enter_telegram_id": "Введіть Telegram ID",
        "invalid_telegram_id": "Некорректний Telegram ID",
        "error_linking": "Помилка прив'язки акаунта",

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
        "xp_per_unit": "XP/штука",
        "unit_time": "Час (хвилини)",
        "unit_quantity": "Кількість (штуки)",
        "create": "Створити",
        "edit": "Редагувати",
        "delete": "Видалити",
        "start": "Старт",
        "stop": "Стоп",
        "time": "Час",
        "sessions": "Сесій",
        "manual_quantity": "Ручний ввід кількості",
        "minutes_placeholder": "Хвилин",
        "quantity_placeholder": "Введіть к-во",
        "enter_quantity": "Введіть кількість",
        "enter_minutes": "Введіть хвилини",
        "error_adding": "Помилка додавання",
        "units": "штук",

        // Rewards
        "reward_name": "Назва нагороди",
        "create_reward": "Створити нагороду",
        "quick_select": "Швидкий вибір",
        "custom_reward": "Своя нагорода",
        "spend_xp": "Витрать XP на задоволення",
        "buy": "Купити",
        "edit_reward": "✏️ Редагувати нагороду",
        "reward_name_placeholder": "Назва",
        "xp_cost_placeholder": "XP вартість",
        "save_reward": "Зберегти",
        "reward_updated": "Нагорода оновлена!",
        "error_updating_reward": "Помилка оновлення",
        "enter_correct_name_cost": "Введіть коректну назву та вартість",

        // History
        "transaction_history": "Історія транзакцій",
        "all_xp_operations": "Всі операції з XP",
        "show_all_history": "Показати всю історію",
        "hide_history": "Приховати історію",
        "show_all_rewards": "Показати всі нагороди",
        "hide_rewards": "Приховати нагороди",
        "show_all_activities": "Показати всі активності",
        "hide_activities": "Приховати активності",
        "earned": "Зароблено",
        "spent": "Витрачено",
        "at_time": "о",
        "filter_period": "Період",
        "all": "Всі",

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
        "start_streak_message": "Почніть активність, щоб почати серію!",
        "streak_1_day": "🔥 Чудовий початок! Продовжуйте завтра!",
        "streak_days_in_row": "🔥 {days} днів поспіль! Продовжуйте!",
        "streak_week": "🔥 Тиждень поспіль! Ви отримуєте бонуси XP!",
        "streak_month": "🔥 Місяць без пропусків! Ви отримуєте +100 XP бонус!",
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
        "edit_goal": "✏️ Редагувати ціль",
        "goal_title": "Назва цілі",
        "target_xp": "Цільова кількість XP",
        "target_quantity": "К-во для досягнення",
        "target_quantity_description": "Цільова кількість (для активностей у штуках)",
        "completion_bonus_xp": "Бонус XP за досягнення цілі",
        "completion_bonus_xp_description": "Додатковий бонус XP при досягненні цілі",
        "enter_target_quantity": "Введіть цільову кількість",
        "description": "Опис (необов'язково)",
        "deadline": "Дедлайн (необов'язково)",
        "create_goal": "Створити ціль",
        "goal_completed_congratulations": "🎉 Вітаємо! Ви досягли цілі!",
        "goal_completed_bonus": "Бонус за досягнення цілі",
        "important": "Важливо:",
        "goal_info_text": "Виберіть активність зі свого списку. Ціль буде відстежувати прогрес тільки за цією активністю.",
        "select_activity_label": "Виберіть активність",
        "loading_activities": "-- Завантаження активностей --",
        "create_activity_first": "Спочатку створіть активність, якщо її немає в списку",
        "goal_title_placeholder": "Наприклад: Вивчити 100 годин німецької",
        "target_xp_description": "Скільки XP потрібно заробити для досягнення цілі",
        "goal_description_placeholder": "Додаткова інформація про ціль",
        "deadline_description": "Встановіть дату, до якої хочете досягти цілі",
        "date_format_placeholder": "дд.мм.рррр",
        "format_label": "Формат:",
        "save_changes": "Зберегти зміни",

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
        "add": "Додати",
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
        "sort_label": "Сортування:",
        "sort_newest": "⬆️ Спочатку нові",
        "sort_oldest": "Спочатку старі",
        "sort_name_asc": "За ім'ям (А-Я)",
        "sort_name_desc": "За ім'ям (Я-А)",
        "category_label": "Категорія:",
        "all_categories_with_icon": "📂 Всі категорії",
        "reset_filters": "Скинути",
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
        "level_text": "Рівень",
        "current_streak": "Поточна серія",
        "current_streak_text": "Серія днів",
        "activities_count_text": "Активностей",
        "activities": "Активності",
        "no_category_data": "Немає даних за категоріями",
        "no_activities_text": "Немає активностей",
        "no_goals_text": "Немає цілей",
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
        "completed": "Виконано",
        "min_short": "хв",
        "activities_count": "активностей"
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
        "link_telegram": "Telegram verknüpfen",
        "link_telegram_title": "Telegram-Konto verknüpfen",
        "telegram_link_instructions": "Um ein Telegram-Konto zu verknüpfen:",
        "telegram_link_step1": "Öffnen Sie den Bot in Telegram und senden Sie /start",
        "telegram_link_step2": "Kopieren Sie Ihre Telegram-ID aus der Bot-Nachricht",
        "telegram_link_step3": "Fügen Sie sie in das Feld unten ein und klicken Sie auf \"Verknüpfen\"",
        "telegram_id_label": "Telegram-ID:",
        "telegram_id_hint": "Ihre Telegram-ID wurde vom Bot in der Nachricht angezeigt",
        "link_button": "Verknüpfen",
        "telegram_linked": "Telegram-Konto verknüpft",
        "telegram_linked_success": "Telegram-Konto erfolgreich verknüpft!",
        "enter_telegram_id": "Telegram-ID eingeben",
        "invalid_telegram_id": "Ungültige Telegram-ID",
        "error_linking": "Fehler beim Verknüpfen des Kontos",

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
        "xp_per_unit": "XP/Stück",
        "unit_time": "Zeit (Minuten)",
        "unit_quantity": "Menge (Stücke)",
        "create": "Erstellen",
        "edit": "Bearbeiten",
        "delete": "Löschen",
        "start": "Start",
        "stop": "Stop",
        "time": "Zeit",
        "sessions": "Sitzungen",
        "manual_quantity": "Manuelle Mengeneingabe",
        "minutes_placeholder": "Minuten",
        "quantity_placeholder": "Menge eingeben",
        "enter_quantity": "Geben Sie die Menge ein",
        "enter_minutes": "Geben Sie die Minuten ein",
        "error_adding": "Fehler beim Hinzufügen",
        "units": "Stücke",

        // Rewards
        "reward_name": "Belohnungsname",
        "create_reward": "Belohnung erstellen",
        "quick_select": "Schnellauswahl",
        "custom_reward": "Eigene Belohnung",
        "spend_xp": "XP für Vergnügen ausgeben",
        "buy": "Kaufen",
        "edit_reward": "✏️ Belohnung bearbeiten",
        "reward_name_placeholder": "Name",
        "xp_cost_placeholder": "XP-Kosten",
        "save_reward": "Speichern",
        "reward_updated": "Belohnung aktualisiert!",
        "error_updating_reward": "Fehler beim Aktualisieren",
        "enter_correct_name_cost": "Geben Sie einen korrekten Namen und Kosten ein",

        // History
        "transaction_history": "Transaktionsverlauf",
        "all_xp_operations": "Alle XP-Operationen",
        "show_all_history": "Gesamten Verlauf anzeigen",
        "hide_history": "Verlauf ausblenden",
        "show_all_rewards": "Alle Belohnungen anzeigen",
        "hide_rewards": "Belohnungen ausblenden",
        "show_all_activities": "Alle Aktivitäten anzeigen",
        "hide_activities": "Aktivitäten ausblenden",
        "earned": "Verdient",
        "spent": "Ausgegeben",
        "at_time": "um",
        "filter_period": "Zeitraum",
        "all": "Alle",

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
        "start_streak_message": "Starten Sie eine Aktivität, um eine Serie zu beginnen!",
        "streak_1_day": "🔥 Großartiger Start! Machen Sie morgen weiter!",
        "streak_days_in_row": "🔥 {days} Tage in Folge! Weiter so!",
        "streak_week": "🔥 Eine Woche in Folge! Sie erhalten XP-Boni!",
        "streak_month": "🔥 Ein Monat ohne Auslassung! Sie erhalten +100 XP Bonus!",
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
        "edit_goal": "✏️ Ziel bearbeiten",
        "goal_title": "Zielname",
        "target_xp": "Ziel-XP-Menge",
        "target_quantity": "Menge zum Erreichen",
        "target_quantity_description": "Zielmenge (für Aktivitäten in Stücken)",
        "completion_bonus_xp": "Bonus-XP für Zielerreichung",
        "completion_bonus_xp_description": "Zusätzlicher Bonus-XP beim Erreichen des Ziels",
        "enter_target_quantity": "Geben Sie die Zielmenge ein",
        "description": "Beschreibung (optional)",
        "deadline": "Frist (optional)",
        "create_goal": "Ziel erstellen",
        "goal_completed_congratulations": "🎉 Glückwunsch! Sie haben das Ziel erreicht!",
        "goal_completed_bonus": "Bonus für Zielerreichung",
        "important": "Wichtig:",
        "goal_info_text": "Wählen Sie eine Aktivität aus Ihrer Liste. Das Ziel verfolgt nur den Fortschritt dieser Aktivität.",
        "select_activity_label": "Aktivität auswählen",
        "loading_activities": "-- Aktivitäten werden geladen --",
        "create_activity_first": "Erstellen Sie zuerst eine Aktivität, wenn sie nicht in der Liste ist",
        "goal_title_placeholder": "Zum Beispiel: 100 Stunden Deutsch lernen",
        "target_xp_description": "Wie viel XP müssen verdient werden, um das Ziel zu erreichen",
        "goal_description_placeholder": "Zusätzliche Informationen zum Ziel",
        "deadline_description": "Legen Sie das Datum fest, bis zu dem Sie das Ziel erreichen möchten",
        "date_format_placeholder": "tt.mm.jjjj",
        "format_label": "Format:",
        "save_changes": "Änderungen speichern",

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
        "sort_label": "Sortierung:",
        "sort_newest": "⬆️ Zuerst neueste",
        "sort_oldest": "Zuerst älteste",
        "sort_name_asc": "Nach Name (A-Z)",
        "sort_name_desc": "Nach Name (Z-A)",
        "category_label": "Kategorie:",
        "all_categories_with_icon": "📂 Alle Kategorien",
        "reset_filters": "Zurücksetzen",
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
        "level_text": "Stufe",
        "current_streak": "Aktuelle Serie",
        "current_streak_text": "Tages-Serie",
        "activities_count_text": "Aktivitäten",
        "activities": "Aktivitäten",
        "no_category_data": "Keine Kategoriedaten",
        "no_activities_text": "Keine Aktivitäten",
        "no_goals_text": "Keine Ziele",
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
        "days_short": "Tage",
        "today_exclamation": "Heute!",
        "overdue": "Überfällig",
        "completed": "Abgeschlossen",
        "min_short": "Min.",
        "activities_count": "Aktivitäten"
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
        "link_telegram": "Link Telegram",
        "link_telegram_title": "Link Telegram Account",
        "telegram_link_instructions": "To link a Telegram account:",
        "telegram_link_step1": "Open the bot in Telegram and send /start",
        "telegram_link_step2": "Copy your Telegram ID from the bot message",
        "telegram_link_step3": "Paste it in the field below and click \"Link\"",
        "telegram_id_label": "Telegram ID:",
        "telegram_id_hint": "Your Telegram ID was shown by the bot in the message",
        "link_button": "Link",
        "telegram_linked": "Telegram account linked",
        "telegram_linked_success": "Telegram account successfully linked!",
        "enter_telegram_id": "Enter Telegram ID",
        "invalid_telegram_id": "Invalid Telegram ID",
        "error_linking": "Error linking account",

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
        "xp_per_unit": "XP/piece",
        "unit_time": "Time (minutes)",
        "unit_quantity": "Quantity (pieces)",
        "create": "Create",
        "edit": "Edit",
        "delete": "Delete",
        "start": "Start",
        "stop": "Stop",
        "time": "Time",
        "sessions": "Sessions",
        "manual_quantity": "Manual quantity entry",
        "minutes_placeholder": "Minutes",
        "quantity_placeholder": "Enter quantity",
        "enter_quantity": "Enter quantity",
        "enter_minutes": "Enter minutes",
        "error_adding": "Error adding",
        "units": "pieces",

        // Rewards
        "reward_name": "Reward Name",
        "create_reward": "Create Reward",
        "quick_select": "Quick Select",
        "custom_reward": "Custom Reward",
        "spend_xp": "Spend XP on pleasures",
        "buy": "Buy",
        "edit_reward": "✏️ Edit Reward",
        "reward_name_placeholder": "Name",
        "xp_cost_placeholder": "XP Cost",
        "save_reward": "Save",
        "reward_updated": "Reward updated!",
        "error_updating_reward": "Error updating",
        "enter_correct_name_cost": "Enter correct name and cost",

        // History
        "transaction_history": "Transaction History",
        "all_xp_operations": "All XP operations",
        "show_all_history": "Show all history",
        "hide_history": "Hide history",
        "show_all_rewards": "Show all rewards",
        "hide_rewards": "Hide rewards",
        "show_all_activities": "Show all activities",
        "hide_activities": "Hide activities",
        "earned": "Earned",
        "spent": "Spent",
        "at_time": "at",
        "filter_period": "Period",
        "all": "All",

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
        "start_streak_message": "Start an activity to begin a streak!",
        "streak_1_day": "🔥 Great start! Continue tomorrow!",
        "streak_days_in_row": "🔥 {days} days in a row! Keep going!",
        "streak_week": "🔥 A week in a row! You're getting XP bonuses!",
        "streak_month": "🔥 A month without skipping! You get +100 XP bonus!",
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
        "edit_goal": "✏️ Edit Goal",
        "goal_title": "Goal Title",
        "target_xp": "Target XP Amount",
        "target_quantity": "Quantity to achieve",
        "target_quantity_description": "Target quantity (for activities in pieces)",
        "completion_bonus_xp": "Bonus XP for goal completion",
        "completion_bonus_xp_description": "Additional bonus XP when achieving the goal",
        "enter_target_quantity": "Enter target quantity",
        "description": "Description (optional)",
        "deadline": "Deadline (optional)",
        "create_goal": "Create Goal",
        "goal_completed_congratulations": "🎉 Congratulations! You achieved the goal!",
        "goal_completed_bonus": "Bonus for goal completion",
        "important": "Important:",
        "goal_info_text": "Select an activity from your list. The goal will track progress only for this activity.",
        "select_activity_label": "Select Activity",
        "loading_activities": "-- Loading activities --",
        "create_activity_first": "Create an activity first if it's not in the list",
        "goal_title_placeholder": "For example: Learn 100 hours of German",
        "target_xp_description": "How much XP needs to be earned to achieve the goal",
        "goal_description_placeholder": "Additional information about the goal",
        "deadline_description": "Set the date by which you want to achieve the goal",
        "date_format_placeholder": "dd.mm.yyyy",
        "format_label": "Format:",
        "save_changes": "Save Changes",

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
        "add": "Add",
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
        "sort_label": "Sort:",
        "sort_newest": "⬆️ Newest first",
        "sort_oldest": "Oldest first",
        "sort_name_asc": "By name (A-Z)",
        "sort_name_desc": "By name (Z-A)",
        "category_label": "Category:",
        "all_categories_with_icon": "📂 All categories",
        "reset_filters": "Reset",
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
        "level_text": "Level",
        "current_streak": "Current streak",
        "current_streak_text": "Day Streak",
        "activities_count_text": "Activities",
        "activities": "Activities",
        "no_category_data": "No category data",
        "no_activities_text": "No activities",
        "no_goals_text": "No goals",
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
        "completed": "Completed",
        "min_short": "min",
        "activities_count": "activities"
    }
};

let currentLanguage = localStorage.getItem('language') || 'ru';

function t(key) {
    return translations[currentLanguage][key] || translations['ru'][key] || key;
}

// Функция для правильного склонения "активностей" на разных языках
function formatActivitiesCount(count) {
    if (currentLanguage === 'uk') {
        // Украинский: 1 активність, 2-4 активності, 5+ активностів
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
        // Русский: 1 активность, 2-4 активности, 5+ активностей
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
        // Немецкий: 1 Aktivität, 2+ Aktivitäten
        return count === 1 ? `${count} Aktivität` : `${count} Aktivitäten`;
    } else {
        // Английский: 1 activity, 2+ activities
        return count === 1 ? `${count} activity` : `${count} activities`;
    }
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
    updateLanguageMenu();
    // Обновляем lang атрибут для календаря
    updateDateInputLang();
    // Обновляем тексты аккордеонов
    updateHistoryAccordionButton();
    updateRewardsAccordionButton();
    // Перезагружаем данные, которые зависят от языка
    if (document.getElementById('app-section') && !document.getElementById('app-section').classList.contains('hidden')) {
        loadCategoryStats();
        loadCalendar(currentCalendarPeriod);
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
            const childName = document.getElementById("child-stats-name")?.textContent.replace(`${t('stats_for')} `, "") || "";
            if (childId) {
                showChildStats(parseInt(childId), childName);
            }
        }
    }
    closeLanguageMenu();
}

function applyTranslations() {
    // Применяем переводы ко всем элементам с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Применяем переводы к опциям в select (включая опции внутри select)
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        option.textContent = t(key);
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
    updateDateInputLang(); // Обновляем lang атрибут календаря при загрузке
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

// ============= BOTTOM NAVIGATION (Mobile) =============

function navigateToSection(section) {
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
    
    // Скроллим к соответствующей секции
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
            // Для целей скроллим к goals-list в sidebar
            targetElement = document.getElementById('goals-list');
            if (!targetElement) {
                // Если goals-list не найден, скроллим к sidebar (первому элементу с классом lg:col-span-1)
                const sidebar = document.querySelector('.grid.lg\\:grid-cols-3 > .lg\\:col-span-1');
                if (sidebar) targetElement = sidebar;
            }
            break;
    }
    
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Добавляем небольшой отступ сверху для фиксированного хедера
        setTimeout(() => {
            const headerHeight = document.querySelector('.fixed.top-0')?.offsetHeight || 70;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 10;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 100);
    }
}

// Устанавливаем активную кнопку при скролле (опционально)
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    const scrollPosition = window.pageYOffset + 150; // С учетом хедера
    
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
    let currentSection = 'activities';
    for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].el.getBoundingClientRect();
        if (rect.top <= scrollPosition) {
            currentSection = sections[i].id;
            break;
        }
    }
    
    // Обновляем активную кнопку
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active-nav');
        if (btn.dataset.section === currentSection) {
            btn.classList.add('active-nav');
        }
    });
}, { passive: true });

// Устанавливаем начальную активную кнопку
document.addEventListener('DOMContentLoaded', () => {
    // По умолчанию активна кнопка "Активности"
    const activitiesBtn = document.querySelector('.mobile-nav-btn[data-section="activities"]');
    if (activitiesBtn) {
        activitiesBtn.classList.add('active-nav');
    }
});

// ============= AUTH STATE =============
let authToken = localStorage.getItem('token') || '';
let currentUser = null;

// ============= APP STATE =============
const activeTimers = new Map();
let allActivities = [];
let activitiesFilterState = {
    sort: 'newest', // newest, oldest, name-asc, name-desc
    category: 'all'
};
let activitiesAccordionExpanded = false; // По умолчанию свернут - показываем только первые 5 активностей
let allRewards = [];

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
        // Очищаем предыдущие ошибки
        const errorEl = document.getElementById("login-error");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.add("hidden");
        }

        // Проверяем, что поля заполнены
        if (!email || !password) {
            if (errorEl) {
                errorEl.textContent = "Пожалуйста, заполните все поля";
                errorEl.classList.remove("hidden");
            }
            return;
        }

        // Убираем возможные пробелы в начале и конце
        email = email.trim();
        password = password.trim();

        console.log("Attempting login with email:", email);
        console.log("Password length:", password.length);

        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        console.log("Login response status:", res.status, res.statusText);

        if (!res.ok) {
            let errorMessage = "Ошибка входа";
            try {
                const error = await res.json();
                errorMessage = error.detail || errorMessage;
            } catch (parseError) {
                // Если не удалось распарсить JSON, используем статус
                if (res.status === 401) {
                    errorMessage = "Неверный email или пароль";
                } else if (res.status === 404) {
                    errorMessage = "Сервер не найден. Проверьте подключение.";
                } else {
                    errorMessage = `Ошибка ${res.status}: ${res.statusText}`;
                }
            }

            if (errorEl) {
                errorEl.textContent = errorMessage;
                errorEl.classList.remove("hidden");
            } else {
                alert(errorMessage);
            }
            return;
        }

        const data = await res.json();
        if (!data.access_token) {
            if (errorEl) {
                errorEl.textContent = "Ошибка: токен не получен";
                errorEl.classList.remove("hidden");
            }
            return;
        }

        authToken = data.access_token;
        localStorage.setItem('token', authToken);

        await loadCurrentUser();
        showApp();

        } catch (e) {
        console.error("Login error:", e);
        const errorEl = document.getElementById("login-error");
        const errorMessage = e.message || "Произошла ошибка при входе. Проверьте подключение к интернету.";

        if (errorEl) {
            errorEl.textContent = errorMessage;
            errorEl.classList.remove("hidden");
        } else {
            alert(errorMessage);
        }

        // Дополнительное логирование для отладки
        console.error("Login failed:", {
            email: email,
            passwordLength: password ? password.length : 0,
            error: e.message,
            stack: e.stack
        });
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
        const res = await fetch(`${API_BASE}/telegram/status`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        
        if (res.ok) {
            const data = await res.json();
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
                'Authorization': `Bearer ${authToken}`
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

function showAuth() {
    if (!authSection || !appSection) {
        initDOMElements();
    }
    if (authSection) authSection.classList.remove("hidden");
    if (appSection) appSection.classList.add("hidden");
}

function showApp() {
    if (!authSection || !appSection) {
        initDOMElements();
    }
    if (authSection) authSection.classList.add("hidden");
    if (appSection) appSection.classList.remove("hidden");

    // Предотвращаем скролл вниз при показе приложения
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Сбрасываем кэш элементов, чтобы они переинициализировались
    rewardsListVisible = null;
    rewardsListHidden = null;
    rewardsAccordionBtn = null;
    historyListVisible = null;
    historyListHidden = null;
    historyAccordionBtn = null;
    activitiesListVisible = null;
    activitiesListHidden = null;
    activitiesAccordionBtn = null;

    // Небольшая задержка, чтобы DOM успел обновиться
    setTimeout(async () => {
        loadWallet();
        // Сначала загружаем категории, чтобы они были доступны при отображении активностей
        await loadCategories();
        loadActivities(); // Теперь загружаем активности, когда категории уже загружены
        initActivitiesFilters(); // Инициализируем фильтры и аккордеон
        loadRewards();
        loadTodayStats();
        loadWeekCalendar();
        setTimeout(() => loadCategoryStats(), 100);
        loadStreak();
        loadRecommendations();
        loadGoals();
        loadHistory();
        // Инициализируем кнопки фильтра периода истории
        if (document.getElementById('history-period-today')) {
            setHistoryPeriod(historyPeriod);
        }
        loadHistory(); // Автоматически загружаем историю

        // Дополнительное обновление dropdown через небольшую задержку на случай, если элементы еще не готовы
        setTimeout(() => {
            updateCategoryDropdown('activity-category');
            updateCategoryDropdown('edit-activity-category');
        }, 200);
    }, 50);
}

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
    if (authToken && authSection && appSection) {
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
            const hourLabel = currentLanguage === 'uk' ? 'год' : currentLanguage === 'de' ? 'Std.' : currentLanguage === 'en' ? 'h' : 'ч';
            const minLabel = currentLanguage === 'uk' ? 'хв' : currentLanguage === 'de' ? 'Min.' : currentLanguage === 'en' ? 'm' : 'м';
            timeEl.textContent = hours > 0 ? `${hours}${hourLabel} ${mins}${minLabel}` : `${mins}${minLabel}`;
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
                    <div class="text-xs text-gray-500">${Math.round(cat.total_time)} ${t('min_short')} • ${formatActivitiesCount(cat.activity_count)}</div>
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
            // Маппинг дней недели на ключи переводов
            const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            
            // Маппинг русских сокращений на индексы (Пн=0, Вт=1, ..., Вс=6)
            const dayNameToIndex = {
                'Пн': 0, 'Вт': 1, 'Ср': 2, 'Чт': 3, 'Пт': 4, 'Сб': 5, 'Вс': 6
            };

            containerEl.innerHTML = `
                <div class="flex justify-between gap-0.5 md:gap-1" id="week-calendar">
                    ${data.map((day, index) => {
                        const hasActivity = day.earned > 0 || day.spent > 0;
                        const intensity = Math.min(day.earned / 100, 1);
                        const todayDate = new Date();
                        // Парсим дату правильно, учитывая что она в формате YYYY-MM-DD
                        const [year, month, dayNum] = day.date.split('-').map(Number);
                        const dayDate = new Date(year, month - 1, dayNum, 12, 0, 0);
                        const isTodayDate = dayDate.toDateString() === todayDate.toDateString();

                        // Определяем день недели из данных сервера или вычисляем из даты
                        let dayIndex = dayNameToIndex[day.day_name];
                        if (dayIndex === undefined) {
                            // Если не нашли по названию, вычисляем из даты
                            // JavaScript: 0=Вс, 1=Пн, ..., 6=Сб
                            // Нужно: 0=Пн, 1=Вт, ..., 6=Вс
                            const jsDay = dayDate.getDay();
                            dayIndex = jsDay === 0 ? 6 : jsDay - 1; // Конвертируем в формат Пн=0, Вс=6
                        }
                        
                        // Получаем локализованное название дня недели
                        const dayKey = dayKeys[dayIndex];
                        const localizedDayName = dayKey ? t(dayKey) : day.day_name;
                        
                        // Логируем для отладки
                        console.log(`Week day ${index}:`, {
                            date: day.date,
                            dayName: day.day_name,
                            dayIndex: dayIndex,
                            localizedName: localizedDayName,
                            parsedDate: dayDate.toDateString()
                        });

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

        if (!modal || !titleEl || !contentEl) {
            console.error("Day details modal elements not found");
            return;
        }

        modal.classList.remove('hidden');
        contentEl.innerHTML = `<div class="text-center text-gray-400 py-4">${t('loading')}</div>`;

        // Убеждаемся, что дата в правильном формате YYYY-MM-DD
        let formattedDate = date;
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        } else if (typeof date === 'string') {
            // Проверяем формат даты
            const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (!dateMatch) {
                console.error("Invalid date format:", date);
                contentEl.innerHTML = `<div class="text-center text-red-400 py-4">Неверный формат даты: ${date}</div>`;
                return;
            }
            formattedDate = dateMatch[0]; // Берем только часть YYYY-MM-DD
        }

        console.log("Loading day details for date:", formattedDate);

        const res = await fetch(`${API_BASE}/xp/day/${formattedDate}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load day details:", res.status, res.statusText, errorText, "Date:", formattedDate);
            let errorMessage = t('error_loading_data');
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.detail) {
                    errorMessage = errorJson.detail;
                }
            } catch (e) {
                // Если не JSON, используем стандартное сообщение
            }
            contentEl.innerHTML = `<div class="text-center text-red-400 py-4">${errorMessage}</div>`;
            return;
        }

        const data = await res.json();

        // ВСЕГДА используем переданную дату для отображения, чтобы избежать проблем с часовыми поясами
        // Сервер может вернуть дату в другом формате или с учетом часового пояса
        const dateToDisplay = formattedDate;
        
        // Парсим дату из строки YYYY-MM-DD напрямую, без проблем с часовыми поясами
        const [year, month, day] = dateToDisplay.split('-').map(Number);
        
        // Создаем дату в локальном времени для правильного определения дня недели
        // Используем полдень, чтобы избежать проблем с переходом через полночь
        const dateObj = new Date(year, month - 1, day, 12, 0, 0);
        
        // Проверяем, что дата парсится правильно
        if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
            console.warn("Date parsing mismatch:", { year, month, day, parsed: dateObj });
        }

        // Для украинского языка используем правильный падеж (именительный)
        let formattedDateDisplay;
        if (currentLanguage === 'uk') {
            const weekdays = ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'];
            const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
                           'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
            const weekday = weekdays[dateObj.getDay()];
            const monthName = months[dateObj.getMonth()];
            formattedDateDisplay = `${weekday}, ${day} ${monthName} ${year}`;
        } else {
            const localeMap = { 'ru': 'ru-RU', 'de': 'de-DE', 'en': 'en-US' };
            const locale = localeMap[currentLanguage] || 'ru-RU';
            formattedDateDisplay = dateObj.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        titleEl.textContent = `📅 ${formattedDateDisplay}`;
        
        // Логируем для отладки
        console.log("Displaying day details:", {
            receivedDate: formattedDate,
            serverDate: data.date,
            dateToDisplay: dateToDisplay,
            parsedDate: { year, month, day },
            dateObj: dateObj,
            dayOfWeek: dateObj.getDay(),
            formattedDisplay: formattedDateDisplay
        });

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

        // Расходы (только реальные траты, бонусы уже в заработках)
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
                                    <div class="text-red-600 font-bold">-${Math.abs(spending.xp_spent)} XP</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Добавляем кнопку создания цели внизу
        html += `
            <div class="mt-4 pt-4 border-t border-gray-200">
                <button onclick="showCreateGoalModal(); closeDayDetailsModal();"
                        class="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    <i class="fas fa-bullseye"></i>
                    <span>${t('create_goal')}</span>
                </button>
            </div>
        `;

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
let historyPeriod = 'today'; // По умолчанию показываем сегодня

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
    // Парсим дату - если она в формате ISO с timezone, JavaScript правильно её обработает
    const date = new Date(item.date);

    // Локализация даты и времени
    const localeMap = { 'ru': 'ru-RU', 'uk': 'uk-UA', 'de': 'de-DE', 'en': 'en-US' };
    const locale = localeMap[currentLanguage] || 'ru-RU';
    // Используем timeZone для правильного отображения Берлинского времени
    const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
    const dateStr = date.toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'Europe/Berlin' });

    return `
        <div class="flex items-center justify-between p-2.5 rounded-lg ${isEarn ? 'bg-emerald-50' : 'bg-red-50'} transition-all hover:bg-opacity-80">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isEarn ? 'bg-emerald-500' : 'bg-red-500'}">
                    <i class="fas ${isEarn ? 'fa-arrow-up' : 'fa-arrow-down'} text-white text-xs"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="font-medium text-gray-800 text-sm break-words">${item.description}</div>
                    <div class="text-xs text-gray-500">${dateStr} ${t('at_time')} ${timeStr}${item.duration_minutes ? ` • ${Math.round(item.duration_minutes)} ${t('min_short')}` : ''}</div>
                </div>
            </div>
            <div class="font-bold ${isEarn ? 'text-emerald-600' : 'text-red-600'} flex-shrink-0 ml-2 text-center">
                ${isEarn ? '+' : '-'}${Math.round(item.amount)} XP
            </div>
        </div>
    `;
}

// Функция для фильтрации истории по периоду
function filterHistoryByPeriod(data, period) {
    if (!data || data.length === 0) return [];

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
function setHistoryPeriod(period) {
    console.log('Setting history period:', period);
    historyPeriod = period;

    // Обновляем стили кнопок
    document.querySelectorAll('.history-period-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });

    const activeBtn = document.getElementById(`history-period-${period}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-indigo-500', 'text-white');
    }

    // Перезагружаем историю с фильтром (принудительно, без кэша)
    loadHistory();
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

        // Увеличиваем лимит для получения достаточного количества данных для фильтрации
        // Добавляем timestamp для предотвращения кэширования
        const cacheBuster = Date.now();
        const res = await fetch(`${API_BASE}/xp/full-history?limit=1000&_t=${cacheBuster}`, {
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            },
            cache: 'no-store'
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

        const allData = await res.json();

        // Сначала сортируем все данные по дате (новые сверху) перед фильтрацией
        // Это гарантирует правильный порядок
        const sortedAllData = [...allData].sort((a, b) => {
            let timestampA = 0;
            let timestampB = 0;
            
            try {
                if (a.date) {
                    const dateA = new Date(a.date);
                    timestampA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                }
                if (b.date) {
                    const dateB = new Date(b.date);
                    timestampB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                }
            } catch (e) {
                // Игнорируем ошибки парсинга
            }
            
            // Сортируем по убыванию timestamp (новые сверху)
            if (timestampB !== timestampA) {
                return timestampB - timestampA;
            }
            // Если даты равны, используем ID для стабильности (более новые ID выше)
            const idA = a.id || a.log_id || a.purchase_id || 0;
            const idB = b.id || b.log_id || b.purchase_id || 0;
            return idB - idA;
        });

        // Фильтруем уже отсортированные данные по выбранному периоду
        console.log('Filtering history:', { period: historyPeriod, totalItems: sortedAllData.length });
        let filteredData = filterHistoryByPeriod(sortedAllData, historyPeriod);
        console.log('Filtered history:', { period: historyPeriod, filteredItems: filteredData.length });

        // Применяем сортировку еще раз после фильтрации для гарантии
        filteredData.sort((a, b) => {
            let timestampA = 0;
            let timestampB = 0;
            
            try {
                if (a.date) {
                    const dateA = new Date(a.date);
                    timestampA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                }
                if (b.date) {
                    const dateB = new Date(b.date);
                    timestampB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                }
            } catch (e) {
                // Игнорируем ошибки парсинга
            }
            
            // Сортируем по убыванию timestamp (новые сверху)
            if (timestampB !== timestampA) {
                return timestampB - timestampA;
            }
            // Если даты равны, используем ID для стабильности (более новые ID выше)
            const idA = a.id || a.log_id || a.purchase_id || 0;
            const idB = b.id || b.log_id || b.purchase_id || 0;
            return idB - idA;
        });
        
        // Логируем первые несколько элементов для отладки
        console.log('Final sorted history (first 10):', filteredData.slice(0, 10).map(item => ({
            description: item.description,
            date: item.date,
            timestamp: new Date(item.date).getTime(),
            formatted: new Date(item.date).toLocaleString('ru-RU', { timeZone: 'Europe/Berlin' })
        })));

        historyListVisible.innerHTML = '';
        historyListHidden.innerHTML = '';

        if (filteredData.length === 0) {
            historyListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">История пуста</div>';
            historyAccordionBtn.classList.add('hidden');
            return;
        }

        // Создаем копию отсортированного массива для безопасности
        const sortedHistory = [...filteredData];
        
        const visibleHistory = sortedHistory.slice(0, 4);
        const hiddenHistory = sortedHistory.slice(4);

        const historyContainer = document.getElementById('history-list-container');
        const historyBlock = document.getElementById('history');

        // Очищаем перед добавлением
        historyListVisible.innerHTML = '';
        visibleHistory.forEach(item => {
            const itemHtml = renderHistoryItem(item);
            historyListVisible.innerHTML += itemHtml;
        });

        // Применяем fixed позиционирование по умолчанию (если аккордеон закрыт)
        const isExpanded = localStorage.getItem('historyAccordionExpanded') === 'true';
        if (!isExpanded) {
            if (historyListVisible) {
                historyListVisible.classList.add('history-fixed');
            }
            if (historyContainer) {
                historyContainer.classList.remove('history-expanded');
            }
        } else {
            if (historyListVisible) {
                historyListVisible.classList.remove('history-fixed');
            }
            if (historyContainer) {
                historyContainer.classList.add('history-expanded');
            }
        }

        if (hiddenHistory.length > 0) {
            // Очищаем перед добавлением
            historyListHidden.innerHTML = '';
            hiddenHistory.forEach(item => {
                const itemHtml = renderHistoryItem(item);
                historyListHidden.innerHTML += itemHtml;
            });
            historyAccordionBtn.classList.remove('hidden');
            // Загружаем состояние аккордеона из localStorage после добавления элементов
            setTimeout(() => {
                updateHistoryAccordionButton();
            }, 0);
        } else {
            historyAccordionBtn.classList.add('hidden');
            // Если нет скрытых элементов, убираем fixed позиционирование
            const historyContainer = document.getElementById('history-list-container');
            if (historyListVisible) {
                historyListVisible.classList.remove('history-fixed');
            }
            if (historyContainer) {
                historyContainer.classList.remove('history-expanded');
            }
        }
    } catch (e) {
        console.error("Error loading history", e);
    }
}

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
async function loadActivities() {
    try {
        getActivitiesElements();

        if (!authToken) {
            console.error("No auth token available");
            if (activitiesListVisible) {
                activitiesListVisible.innerHTML = '<div class="text-center text-gray-400 py-4">Требуется авторизация</div>';
            }
            return;
        }

        const res = await fetch(`${API_BASE}/activities/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load activities:", res.status, res.statusText, errorText);
            if (activitiesListVisible) {
                activitiesListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки активностей</div>';
            }
            return;
        }

        const data = await res.json();
        allActivities = data;
        
        console.log("Activities loaded:", allActivities.length, allActivities);

        // Обновляем фильтр категорий
        updateActivitiesCategoryFilter();

        // Применяем фильтры и сортировку (это отобразит активности в правильных списках)
        applyActivitiesFilters();
    } catch (e) {
        console.error("Error loading activities", e);
        getActivitiesElements();
        if (activitiesListVisible) {
            activitiesListVisible.innerHTML = '<div class="text-center text-red-400 py-4">Ошибка загрузки активностей</div>';
        }
    }
}

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
        if (!authToken) return;

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

        const res = await fetch(`${API_BASE}/timer/active`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!res.ok) {
            console.warn("Failed to load active timers:", res.status);
            return;
        }

        const activeTimersData = await res.json();

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
    left.className = "flex-grow";
    left.innerHTML = `
        <div class="flex items-center gap-2 mb-1">
            <div class="text-lg font-semibold text-gray-800">${activity.name}</div>
            <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center justify-center whitespace-normal text-center">${categoryName}</span>
        </div>
        <div class="text-sm text-gray-500">${unitType === 'quantity' ? (activity.xp_per_unit || 1) + ' ' + t('xp_per_unit') : (activity.xp_per_hour || 60) + ' ' + t('xp_per_hour')}</div>
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

            timerBtn.className = "timer-btn px-6 py-2 rounded-xl text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2 transition-all duration-300";
            timerBtn.innerHTML = `<i class="fas fa-stop text-red-500"></i> <span id="timer-${activity.id}">${minutes}:${seconds} (+${earnedXP} XP)</span>`;
        } else {
            timerBtn.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2";
            timerBtn.innerHTML = `<i class="fas fa-play text-green-500"></i> ${t('start')}`;
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
    manualTimeBtn.className = "manual-time-btn p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    manualTimeBtn.innerHTML = '<i class="fas fa-clock"></i>';
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
    deleteBtn.className = "delete-btn p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = t('delete');
    deleteBtn.draggable = false;
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteActivity(activity.id, div);
    });
    deleteBtn.addEventListener("mousedown", (e) => e.stopPropagation());

    // Иконка перетаскивания удалена - используем только сортировку через фильтры
    div.appendChild(left);
    div.appendChild(timerBtn);
    div.appendChild(manualTimeBtn);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
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
                "Authorization": `Bearer ${authToken}`
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

async function createActivity() {
    const name = activityNameInput.value.trim();
    const categoryEl = document.getElementById("activity-category");
    const category = categoryEl ? (categoryEl.value || "general") : "general";
    const unitTypeEl = document.getElementById("activity-unit-type");
    const unitType = unitTypeEl ? unitTypeEl.value : "time";

    let xpPerHour = 60;
    let xpPerUnit = null;

    if (unitType === "time") {
        xpPerHour = xpPerHourInput ? Number(xpPerHourInput.value) || 60 : 60;
    } else {
        const xpPerUnitInput = document.getElementById("xp-per-unit");
        xpPerUnit = xpPerUnitInput ? Number(xpPerUnitInput.value) || 1 : 1;
    }

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
        const activityData = {
            name,
            category: category,
            unit_type: unitType,
            xp_per_hour: unitType === "time" ? xpPerHour : null,
            xp_per_unit: unitType === "quantity" ? xpPerUnit : null
        };

        const res = await fetch(`${API_BASE}/activities/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(activityData)
        });

        if (!res.ok) {
            const error = await res.json();
            showActivityMessage(error.detail || "Ошибка создания", "error");
            return;
        }

        const created = await res.json();
        activityNameInput.value = "";
        if (xpPerHourInput) xpPerHourInput.value = "60";
        const xpPerUnitInput = document.getElementById("xp-per-unit");
        if (xpPerUnitInput) xpPerUnitInput.value = "1";
        if (unitTypeEl) unitTypeEl.value = "time";
        updateActivityXPInputs();
        allActivities.push(created);
        updateActivitiesCategoryFilter();
        applyActivitiesFilters();
        
        // Если новая активность попала в скрытый список (больше 5 активностей), открываем аккордеон
        getActivitiesElements();
        const activitiesContainer = document.getElementById('activities-list-container');
        if (allActivities.length > 5 && activitiesAccordionBtn && activitiesListHidden && activitiesContainer) {
            // Проверяем, что новая активность действительно в скрытом списке
            const newActivityElement = document.querySelector(`[data-activity-id="${created.id}"]`);
            const newActivityInHidden = newActivityElement && activitiesListHidden.contains(newActivityElement);
            
            if (newActivityInHidden) {
                // Открываем аккордеон, если он закрыт
                const isExpanded = localStorage.getItem('activitiesAccordionExpanded') === 'true' ||
                                   activitiesContainer.classList.contains('activities-expanded');
                if (!isExpanded && activitiesListHidden.classList.contains('hidden')) {
                    toggleActivitiesAccordion();
                }
                
                // Прокручиваем к новой активности
                setTimeout(() => {
                    if (newActivityElement) {
                        newActivityElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        // Подсвечиваем новую активность
                        newActivityElement.style.transition = 'background-color 0.3s';
                        newActivityElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                        setTimeout(() => {
                            newActivityElement.style.backgroundColor = '';
                        }, 2000);
                    }
                }, 200);
            } else if (newActivityElement) {
                // Если активность в видимом списке, просто подсвечиваем её
                setTimeout(() => {
                    newActivityElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    newActivityElement.style.transition = 'background-color 0.3s';
                    newActivityElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                    setTimeout(() => {
                        newActivityElement.style.backgroundColor = '';
                    }, 2000);
                }, 100);
            }
        } else if (allActivities.length <= 5) {
            // Если активностей 5 или меньше, новая активность в видимом списке - подсвечиваем её
            setTimeout(() => {
                const newActivityElement = document.querySelector(`[data-activity-id="${created.id}"]`);
                if (newActivityElement) {
                    newActivityElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    newActivityElement.style.transition = 'background-color 0.3s';
                    newActivityElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                    setTimeout(() => {
                        newActivityElement.style.backgroundColor = '';
                    }, 2000);
                }
            }, 100);
        }
        
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

    if (!unitTypeEl) return;

    const unitType = unitTypeEl.value;

    if (unitType === "quantity") {
        xpTimeContainer.classList.add("hidden");
        xpQuantityContainer.classList.remove("hidden");
    } else {
        xpTimeContainer.classList.remove("hidden");
        xpQuantityContainer.classList.add("hidden");
    }
}

function closeEditModal() {
    document.getElementById("edit-activity-modal").classList.add("hidden");
    document.getElementById("edit-activity-form").reset();
}

async function updateActivity() {
    const id = document.getElementById("edit-activity-id").value;
    const name = document.getElementById("edit-activity-name").value.trim();
    const categoryEl = document.getElementById("edit-activity-category");
    const category = categoryEl ? categoryEl.value || "general" : "general";
    const unitTypeEl = document.getElementById("edit-activity-unit-type");
    const unitType = unitTypeEl ? unitTypeEl.value : "time";

    let xpPerHour = null;
    let xpPerUnit = null;

    if (unitType === "time") {
        xpPerHour = Number(document.getElementById("edit-xp-per-hour").value) || 60;
    } else {
        const xpPerUnitInput = document.getElementById("edit-xp-per-unit");
        xpPerUnit = xpPerUnitInput ? Number(xpPerUnitInput.value) || 1 : 1;
    }

    if (!name) {
        alert(t('enter_activity_name'));
        return;
    }

    try {
        const activityData = {
            name,
            category: category,
            unit_type: unitType,
            xp_per_hour: unitType === "time" ? xpPerHour : null,
            xp_per_unit: unitType === "quantity" ? xpPerUnit : null
        };

        const res = await fetch(`${API_BASE}/activities/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(activityData)
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || t('error_updating'));
            return;
        }

        const updatedActivity = await res.json();
        const activityId = parseInt(id);
        
        // Обновляем данные активности в массиве
        const activityIndex = allActivities.findIndex(a => a.id === activityId);
        if (activityIndex !== -1) {
            allActivities[activityIndex] = updatedActivity;
        }
        
        // Обновляем фильтр категорий, если категория изменилась
        updateActivitiesCategoryFilter();
        
        // Находим карточку активности в DOM и обновляем только её содержимое
        const activityCard = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (activityCard) {
            // Обновляем название
            const nameElement = activityCard.querySelector('.text-lg.font-semibold');
            if (nameElement) {
                nameElement.textContent = updatedActivity.name;
            }
            
            // Обновляем категорию
            const categoryBadge = activityCard.querySelector('.px-2.py-0\\.5');
            if (categoryBadge) {
                const categoryNames = {
                    "general": t('category_general'),
                    "study": t('category_study'),
                    "sport": t('category_sport'),
                    "hobby": t('category_hobby'),
                    "work": t('category_work'),
                    "health": t('category_health')
                };
                if (allCategories.custom) {
                    allCategories.custom.forEach(customCat => {
                        categoryNames[customCat.id] = customCat.name;
                    });
                }
                const category = updatedActivity.category || "general";
                const categoryName = categoryNames[category] || category;
                categoryBadge.textContent = categoryName;
            }
            
            // Обновляем XP информацию
            const xpInfo = activityCard.querySelector('.text-sm.text-gray-500');
            if (xpInfo) {
                const unitType = updatedActivity.unit_type || 'time';
                xpInfo.textContent = unitType === 'quantity' 
                    ? (updatedActivity.xp_per_unit || 1) + ' ' + t('xp_per_unit')
                    : (updatedActivity.xp_per_hour || 60) + ' ' + t('xp_per_hour');
            }
        } else {
            // Если карточка не найдена (например, из-за фильтра), просто обновляем данные
            // и применяем фильтры без полной перезагрузки
            applyActivitiesFilters();
        }
        
        closeEditModal();
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
        setTimeout(() => {
            cardElement.remove();
        allActivities = allActivities.filter(a => a.id != activityId);
            updateActivitiesCategoryFilter();
            applyActivitiesFilters();
        }, 300);
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

        const intervalId = setInterval(() => {
            const timerInfo = activeTimers.get(activityId);
            if (timerInfo) {
                updateTimerDisplay(activityId, timerInfo.startTime, activity);
            }
        }, 1000);
        timerInfo.intervalId = intervalId;
    } catch (e) {
        console.error("Error starting timer:", e);
        alert("Ошибка запуска таймера");
    }
}

function updateTimerDisplay(activityId, startTime, activity) {
    // Получаем актуальный startTime из activeTimers, если таймер еще активен
    const timerInfo = activeTimers.get(activityId);
    if (!timerInfo) {
        // Таймер был остановлен, не обновляем
        return;
    }

    // Используем startTime из timerInfo, чтобы всегда иметь актуальное значение
    const actualStartTime = timerInfo.startTime;
    const elapsedMs = Date.now() - actualStartTime;

    // Проверяем, что elapsedMs не отрицательное (на случай проблем с синхронизацией времени)
    if (elapsedMs < 0) {
        console.warn(`Negative elapsed time for activity ${activityId}, startTime: ${actualStartTime}, now: ${Date.now()}`);
        return;
    }

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

        button.innerHTML = `<i class="fas fa-play text-green-500"></i> ${t('start')}`;
        button.className = "timer-btn px-4 py-2 rounded-xl text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2 transition-all duration-300";

        await loadWallet();
        loadTodayStats(); // Обновляем статистику
        loadWeekCalendar(); // Обновляем календарь
        loadStreak(); // Обновляем streak
        await loadGoals(); // Всегда обновляем список целей для проверки достижений

        let message = `✅ Таймер остановлен! Заработано ${Math.round(data.xp_earned)} XP`;
        if (data.streak_bonus && data.streak_bonus > 0) {
            message += `\n🔥 Бонус за серию: +${data.streak_bonus} XP`;
        }
        if (data.completed_goals && data.completed_goals.length > 0) {
            message += `\n🎯 Цель выполнена: ${data.completed_goals.join(", ")}`;
        }
        alert(message);
    } catch (e) {
        console.error("Error stopping timer:", e);
        alert("Ошибка остановки таймера");
    }
}


// ============= MANUAL TIME/QUANTITY =============
async function openManualTimeModal(activityId, filterByTime = true) {
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
        select.value = activityId;
        // Обновляем интерфейс в зависимости от типа активности
        updateManualModalUI(activityId);
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
    
    const modal = document.getElementById("manual-time-modal");
    if (modal) {
        modal.classList.remove("hidden");
    }
}

function updateManualModalUI(activityId) {
    const activity = allActivities.find(a => a.id == activityId);
    const unitType = activity ? (activity.unit_type || 'time') : 'time';
    const titleEl = document.getElementById("manual-modal-title");
    const timeContainer = document.getElementById("manual-time-input-container");
    const quantityContainer = document.getElementById("manual-quantity-input-container");
    const timeInput = document.getElementById("manual-minutes");
    const quantityInput = document.getElementById("manual-quantity");

    if (unitType === 'quantity') {
        titleEl.textContent = `📊 ${t('manual_quantity')}`;
        titleEl.setAttribute('data-i18n', 'manual_quantity');
        timeContainer.classList.add('hidden');
        quantityContainer.classList.remove('hidden');
        timeInput.removeAttribute('required');
        quantityInput.setAttribute('required', 'required');
    } else {
        titleEl.textContent = `⏱️ ${t('manual_time')}`;
        titleEl.setAttribute('data-i18n', 'manual_time');
        timeContainer.classList.remove('hidden');
        quantityContainer.classList.add('hidden');
        quantityInput.removeAttribute('required');
        timeInput.setAttribute('required', 'required');
    }
    applyTranslations();
}

function closeManualTimeModal() {
    document.getElementById("manual-time-modal").classList.add("hidden");
}

function updateManualPreview(activityId) {
    const activity = allActivities.find(a => a.id == activityId);
    if (!activity) return;

    const unitType = activity.unit_type || 'time';
    const preview = document.getElementById("manual-time-preview");

    if (unitType === 'quantity') {
        const quantity = document.getElementById("manual-quantity").value;
        if (activityId && quantity) {
            const xp = Math.round(quantity * (activity.xp_per_unit || 1));
            preview.textContent = `+${xp} XP`;
            preview.classList.remove("hidden");
        } else {
            preview.classList.add("hidden");
        }
    } else {
        const minutes = document.getElementById("manual-minutes").value;
        if (activityId && minutes) {
            const xp = Math.round((minutes / 60) * activity.xp_per_hour);
            preview.textContent = `+${xp} XP`;
            preview.classList.remove("hidden");
        } else {
            preview.classList.add("hidden");
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
        const res = await fetch(`${API_BASE}/timer/manual`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(requestData)
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.detail || t('error_adding'));
            return;
        }

        const data = await res.json();
        closeManualTimeModal();
        await loadWallet();
        await loadHistory();
        await loadGoals(); // Обновляем цели для проверки достижений
        if (unitType === 'quantity') {
            const quantity = Number(document.getElementById("manual-quantity").value);
            showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${quantity} ${t('units')}!`, "success");
        } else {
            const minutes = Number(document.getElementById("manual-minutes").value);
            showActivityMessage(`✅ +${Math.round(data.xp_earned)} XP за ${minutes} ${t('minutes_short')}!`, "success");
        }
    } catch (e) {
        console.error("Error:", e);
        alert(t('network_error'));
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
        
        // Сортируем награды: старые сверху (по возрастанию ID), новые внизу
        // Сначала разделяем на общие (user_id === null) и пользовательские
        // Затем сортируем каждую группу по ID
        const sortedData = [...data].sort((a, b) => {
            const idA = a.id || 0;
            const idB = b.id || 0;
            // Сортировка по возрастанию ID (старые сверху, новые внизу)
            return idA - idB;
        });
        
        allRewards = sortedData;
        
        // Логируем для отладки
        console.log('Rewards loaded and sorted:', sortedData.map(r => ({ id: r.id, name: r.name })));

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

        if (sortedData.length === 0) {
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

        const visibleRewards = sortedData.slice(0, 4);
        const hiddenRewards = sortedData.slice(4);

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

async function createReward() {
    const name = rewardNameInput.value.trim();
    const xpCost = rewardCostInput ? Number(rewardCostInput.value) : 0;

    if (!name || xpCost <= 0) {
        showRewardMessage("Введите корректное название и стоимость", "error");
        return;
    }

    // Валидация на дубликаты названий
    const duplicate = allRewards.find(r => r.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
        showRewardMessage(`❌ "${name}" уже существует!`, "error");
        rewardNameInput.focus();
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
        
        // Добавляем новую награду в массив allRewards
        allRewards.push(created);
        // Сортируем по ID (старые сверху, новые внизу)
        allRewards.sort((a, b) => (a.id || 0) - (b.id || 0));
        
        getRewardsElements();
        if (!rewardsListVisible || !rewardsListHidden) {
            // Если элементы не найдены, перезагружаем весь список
            await loadRewards();
            return;
        }
        
        // Определяем, куда добавить новую награду
        const totalRewards = allRewards.length;
        const visibleCount = Math.min(4, totalRewards);
        const newRewardIndex = allRewards.findIndex(r => r.id === created.id);
        
        // Создаем элемент новой награды
        const newRewardElement = renderRewardCard(created);
        
        if (newRewardIndex < visibleCount) {
            // Новая награда попадает в видимый список (первые 4)
            // Нужно перераспределить награды между видимым и скрытым списками
            await loadRewards();
        } else {
            // Новая награда попадает в скрытый список (больше 4 наград)
            // Добавляем её в конец скрытого списка
            if (rewardsListHidden) {
                rewardsListHidden.appendChild(newRewardElement);
            }
            
            // Показываем кнопку аккордеона, если она скрыта
            if (rewardsAccordionBtn) {
                rewardsAccordionBtn.classList.remove('hidden');
            }
            
            // Открываем аккордеон, если он закрыт
            const isExpanded = localStorage.getItem('rewardsAccordionExpanded') === 'true';
            if (!isExpanded && rewardsListHidden && rewardsListHidden.classList.contains('hidden')) {
                toggleRewardsAccordion();
            }
        }
        
        // Прокручиваем к новой награде и подсвечиваем её
        setTimeout(() => {
            const rewardElement = document.querySelector(`[data-reward-id="${created.id}"]`);
            if (rewardElement) {
                rewardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                rewardElement.style.transition = 'background-color 0.3s';
                rewardElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                setTimeout(() => {
                    rewardElement.style.backgroundColor = '';
                }, 2000);
            }
        }, newRewardIndex < visibleCount ? 100 : 200);
        
        // Обновляем состояние аккордеона
        if (rewardsAccordionBtn && totalRewards > 4) {
            setTimeout(() => {
                updateRewardsAccordionButton();
            }, 0);
        }
        
        // Показываем сообщение об успехе
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
    // Применяем переводы для всех элементов в модальном окне
    applyTranslations();
}

function closeEditRewardModal() {
    document.getElementById("edit-reward-modal").classList.add("hidden");
}

async function updateReward() {
    const id = document.getElementById("edit-reward-id").value;
    const name = document.getElementById("edit-reward-name").value.trim();
    const xpCost = Number(document.getElementById("edit-reward-cost").value) || 0;

    if (!name || xpCost <= 0) {
        alert(t('enter_correct_name_cost'));
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
            alert(error.detail || t('error_updating_reward'));
            return;
        }

        closeEditRewardModal();
        await loadRewards();
        showRewardMessage(`✅ ${t('reward_updated')}`, "success");
    } catch (e) {
        console.error("Error:", e);
        alert(t('network_error'));
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
        loadTodayStats(); // Обновляем статистику

        // Небольшая задержка перед обновлением истории, чтобы сервер успел обработать транзакцию
        setTimeout(async () => {
            await loadHistory(); // Обновляем историю транзакций
        }, 300);
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
window.showForgotPassword = showForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.requestResetCode = requestResetCode;
window.resetPassword = resetPassword;
window.openManualTimeModal = openManualTimeModal;
window.closeManualTimeModal = closeManualTimeModal;

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
        if (authToken) {
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

    // Login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");
            const submitBtn = loginForm.querySelector('button[type="submit"]');

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
        });
    }

    // Register form
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
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
        });
    }

    // Activity form
    if (newActivityForm) {
        newActivityForm.addEventListener("submit", (e) => {
            e.preventDefault();
            createActivity();
        });

        // Обработчик изменения типа единицы измерения
        const unitTypeEl = document.getElementById("activity-unit-type");
        if (unitTypeEl) {
            unitTypeEl.addEventListener("change", updateActivityXPInputs);
            updateActivityXPInputs(); // Инициализация при загрузке
        }
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
    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await updateActivity();
        });

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
        if (recordEl) {
            const daysText = t('days');
            recordEl.innerHTML = `${data.longest_streak} <span data-i18n="days">${daysText}</span>`;
        }

        if (messageEl) {
            if (data.current_streak === 0) {
                messageEl.textContent = t('start_streak_message');
            } else if (data.current_streak === 1) {
                messageEl.textContent = t('streak_1_day');
            } else if (data.current_streak < 7) {
                messageEl.textContent = t('streak_days_in_row').replace('{days}', data.current_streak);
            } else if (data.current_streak < 30) {
                messageEl.textContent = t('streak_week');
            } else {
                messageEl.textContent = t('streak_month');
            }
        }
    } catch (e) {
        console.error("Error loading streak", e);
    }
}

// ============= RECOMMENDATIONS =============
async function loadRecommendations() {
    try {
        const listVisible = document.getElementById('recommendations-list-visible');
        const listHidden = document.getElementById('recommendations-list-hidden');

        if (!listVisible || !listHidden) {
            console.warn("Recommendations list elements not found");
            return;
        }

        if (!authToken) {
            console.error("No auth token available");
            listVisible.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${t('auth_required')}</div>`;
            return;
        }

        const res = await fetch(`${API_BASE}/recommendations/`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load recommendations:", res.status, res.statusText, errorText);
            listVisible.innerHTML = `<div class="text-center text-red-400 py-4 text-xs">${t('error_loading_recommendations')}</div>`;
            return;
        }

        const data = await res.json();

        if (!data.recommendations || data.recommendations.length === 0) {
            listVisible.innerHTML = `<div class="text-center text-gray-400 py-4 text-xs">${t('no_recommendations')}</div>`;
            return;
        }

        // Сортируем рекомендации: сначала те, которые еще не делались сегодня
        // minutes_today === 0 или null/undefined означает "не делалось сегодня"
        // minutes_today > 0 означает "уже делалось сегодня"
        const sortedRecommendations = [...data.recommendations].sort((a, b) => {
            // Получаем значения minutes_today и конвертируем в число (может быть undefined, null, 0, или >0)
            const aMinutes = a.minutes_today !== undefined && a.minutes_today !== null ? Number(a.minutes_today) : null;
            const bMinutes = b.minutes_today !== undefined && b.minutes_today !== null ? Number(b.minutes_today) : null;

            // Определяем, делалась ли активность сегодня (minutes_today > 0)
            // Если minutes_today === 0 или null/undefined, значит не делалось сегодня
            const aDidToday = aMinutes !== null && aMinutes > 0;
            const bDidToday = bMinutes !== null && bMinutes > 0;

            // Если одна делалась сегодня (minutes_today > 0), а другая нет (0, null, undefined) - та, что не делалась, идет первой
            if (!aDidToday && bDidToday) return -1;
            if (aDidToday && !bDidToday) return 1;

            // Если обе не делались или обе делались, сохраняем исходный порядок (по приоритету)
            return 0;
        });

        // Отладочный вывод (можно удалить после проверки)
        console.log('Рекомендации после сортировки:', sortedRecommendations.map(r => ({
            name: r.activity_name,
            minutes_today: r.minutes_today,
            type: r.type,
            didToday: r.minutes_today !== undefined && r.minutes_today !== null && Number(r.minutes_today) > 0
        })));

        // Разделяем рекомендации на видимые (первые 3) и скрытые (остальные)
        const visibleRecommendations = sortedRecommendations.slice(0, 3);
        const hiddenRecommendations = sortedRecommendations.slice(3);

        // Очищаем списки
        listVisible.innerHTML = '';
        listHidden.innerHTML = '';

        // Функция для рендеринга одной рекомендации
        const renderRecommendation = (rec) => {
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
        };

        // Рендерим видимые рекомендации (первые 3)
        visibleRecommendations.forEach(rec => {
            listVisible.innerHTML += renderRecommendation(rec);
        });

        // Рендерим скрытые рекомендации (остальные)
        hiddenRecommendations.forEach(rec => {
            listHidden.innerHTML += renderRecommendation(rec);
        });
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
            showNotification(message, 'success');
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

    if (!unitTypeEl) return;

    const unitType = unitTypeEl.value;

    if (unitType === "quantity") {
        xpTimeContainer.classList.add("hidden");
        xpQuantityContainer.classList.remove("hidden");
    } else {
        xpTimeContainer.classList.remove("hidden");
        xpQuantityContainer.classList.add("hidden");
    }
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

async function createGoal() {
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
                    "Authorization": `Bearer ${authToken}`
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
                    "Authorization": `Bearer ${authToken}`
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