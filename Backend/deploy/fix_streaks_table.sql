-- Создание таблицы streaks для PostgreSQL
-- Проверяем, существует ли таблица, и создаём только если её нет
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'streaks') THEN
        CREATE TABLE streaks (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL,
            current_streak INTEGER DEFAULT 0,
            longest_streak INTEGER DEFAULT 0,
            last_activity_date TIMESTAMP WITH TIME ZONE,
            total_days_active INTEGER DEFAULT 0,
            CONSTRAINT streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        -- Создание индексов
        CREATE INDEX ix_streaks_id ON streaks(id);
        CREATE INDEX ix_streaks_user_id ON streaks(user_id);
        
        RAISE NOTICE 'Таблица streaks успешно создана';
    ELSE
        RAISE NOTICE 'Таблица streaks уже существует';
    END IF;
END $$;
