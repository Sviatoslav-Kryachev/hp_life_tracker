-- Создание таблицы timer_logs для PostgreSQL
CREATE TABLE IF NOT EXISTS timer_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_minutes DOUBLE PRECISION DEFAULT 0,
    CONSTRAINT timer_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT timer_logs_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS ix_timer_logs_id ON timer_logs(id);
CREATE INDEX IF NOT EXISTS ix_timer_logs_user_id ON timer_logs(user_id);
CREATE INDEX IF NOT EXISTS ix_timer_logs_activity_id ON timer_logs(activity_id);
