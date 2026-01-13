"""create streaks table

Revision ID: dpcpp6w73ey6
Revises: a1b2c3d4e5f6
Create Date: 2026-01-11 11:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dpcpp6w73ey6'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create streaks table."""
    # Проверяем, существует ли уже таблица streaks
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    tables = inspector.get_table_names()
    
    if 'streaks' in tables:
        print("Таблица 'streaks' уже существует. Пропускаем миграцию.")
        return
    
    # Создаём таблицу streaks
    op.create_table('streaks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('current_streak', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('longest_streak', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('last_activity_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('total_days_active', sa.Integer(), nullable=True, server_default='0'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_streaks_id'), 'streaks', ['id'], unique=False)


def downgrade() -> None:
    """Drop streaks table."""
    op.drop_index(op.f('ix_streaks_id'), table_name='streaks')
    op.drop_table('streaks')
