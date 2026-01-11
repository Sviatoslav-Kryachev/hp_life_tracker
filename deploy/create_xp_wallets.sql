-- Создание таблицы xp_wallets
-- Этот скрипт создает таблицу xp_wallets, если она не существует

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'xp_wallets') THEN
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
        
        RAISE NOTICE 'Таблица xp_wallets успешно создана';
    ELSE
        RAISE NOTICE 'Таблица xp_wallets уже существует';
    END IF;
END $$;
