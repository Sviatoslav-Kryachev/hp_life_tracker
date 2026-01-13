-- Исправление таблицы xp_wallets
-- Миграция создала таблицу xp_wallet, но код ожидает xp_wallets
-- Проверяем и переименовываем, если нужно

DO $$ 
BEGIN
    -- Если таблица xp_wallet существует, но xp_wallets нет - переименовываем
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'xp_wallet') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'xp_wallets') THEN
        ALTER TABLE xp_wallet RENAME TO xp_wallets;
        RAISE NOTICE 'Таблица xp_wallet переименована в xp_wallets';
    -- Если xp_wallets уже существует - ничего не делаем
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'xp_wallets') THEN
        RAISE NOTICE 'Таблица xp_wallets уже существует';
    -- Если ни одна из таблиц не существует - создаем xp_wallets
    ELSE
        CREATE TABLE xp_wallets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL,
            balance FLOAT DEFAULT 0.0,
            level INTEGER DEFAULT 1,
            total_earned FLOAT DEFAULT 0.0,
            total_spent FLOAT DEFAULT 0.0,
            CONSTRAINT xp_wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE INDEX ix_xp_wallets_id ON xp_wallets(id);
        CREATE INDEX ix_xp_wallets_user_id ON xp_wallets(user_id);
        
        RAISE NOTICE 'Таблица xp_wallets создана';
    END IF;
END $$;
