"""add_telegram_fields_to_users

Revision ID: a1b2c3d4e5f6
Revises: 0bd258a19db8
Create Date: 2025-01-10 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '0bd258a19db8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    # Проверяем существование таблицы users
    tables = inspector.get_table_names()
    if 'users' not in tables:
        print("Таблица 'users' не существует. Пропускаем миграцию.")
        return
    
    # Получаем список существующих колонок
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    # Добавляем telegram_id, если его нет
    if 'telegram_id' not in columns:
        op.add_column('users', sa.Column('telegram_id', sa.Integer(), nullable=True))
        op.create_index('ix_users_telegram_id', 'users', ['telegram_id'], unique=True)
    
    # Добавляем telegram_username, если его нет
    if 'telegram_username' not in columns:
        op.add_column('users', sa.Column('telegram_username', sa.String(), nullable=True))
    
    # Добавляем parent_id, если его нет
    if 'parent_id' not in columns:
        op.add_column('users', sa.Column('parent_id', sa.Integer(), nullable=True))
        op.create_foreign_key('fk_users_parent_id', 'users', 'users', ['parent_id'], ['id'])
    
    # Добавляем is_admin, если его нет
    if 'is_admin' not in columns:
        op.add_column('users', sa.Column('is_admin', sa.Integer(), nullable=True, server_default='0'))
    
    # Добавляем invite_code, если его нет
    if 'invite_code' not in columns:
        op.add_column('users', sa.Column('invite_code', sa.String(), nullable=True))
        op.create_index('ix_users_invite_code', 'users', ['invite_code'], unique=True)
    
    # Добавляем username index, если его нет
    indexes = [idx['name'] for idx in inspector.get_indexes('users')]
    if 'ix_users_username' not in indexes:
        try:
            op.create_index('ix_users_username', 'users', ['username'], unique=True)
        except Exception:
            pass  # Индекс может уже существовать


def downgrade() -> None:
    """Downgrade schema."""
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    # Проверяем существование таблицы
    tables = inspector.get_table_names()
    if 'users' not in tables:
        return
    
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    # Удаляем индексы и колонки в обратном порядке
    if 'invite_code' in columns:
        try:
            op.drop_index('ix_users_invite_code', table_name='users')
        except Exception:
            pass
        op.drop_column('users', 'invite_code')
    
    if 'is_admin' in columns:
        op.drop_column('users', 'is_admin')
    
    if 'parent_id' in columns:
        try:
            op.drop_constraint('fk_users_parent_id', 'users', type_='foreignkey')
        except Exception:
            pass
        op.drop_column('users', 'parent_id')
    
    if 'telegram_username' in columns:
        op.drop_column('users', 'telegram_username')
    
    if 'telegram_id' in columns:
        try:
            op.drop_index('ix_users_telegram_id', table_name='users')
        except Exception:
            pass
        op.drop_column('users', 'telegram_id')
