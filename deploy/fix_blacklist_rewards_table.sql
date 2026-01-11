-- Создание таблицы blacklist_rewards
DO $$
BEGIN
    -- Проверяем, существует ли таблица
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blacklist_rewards') THEN
        -- Создаем таблицу
        CREATE TABLE blacklist_rewards (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            reward_name_pattern VARCHAR NOT NULL,
            is_active INTEGER DEFAULT 1,
            CONSTRAINT fk_blacklist_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        );
        
        -- Создаем индексы
        CREATE INDEX ix_blacklist_rewards_id ON blacklist_rewards(id);
        CREATE INDEX ix_blacklist_rewards_user_id ON blacklist_rewards(user_id);
        
        RAISE NOTICE 'Таблица blacklist_rewards успешно создана.';
    ELSE
        RAISE NOTICE 'Таблица blacklist_rewards уже существует.';
    END IF;
END $$;
