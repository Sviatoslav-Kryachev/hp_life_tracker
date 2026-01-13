"""add_display_order_to_activities

Revision ID: 0bd258a19db8
Revises: 5aef5c8de470
Create Date: 2025-12-08 00:15:57.079951

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0bd258a19db8'
down_revision: Union[str, Sequence[str], None] = '5aef5c8de470'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Проверяем существование таблицы activities
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    tables = inspector.get_table_names()
    
    if 'activities' not in tables:
        print("Таблица 'activities' не существует. Пропускаем миграцию.")
        return
    
    # Проверяем, существует ли уже колонка display_order
    columns = [col['name'] for col in inspector.get_columns('activities')]
    if 'display_order' in columns:
        print("Колонка 'display_order' уже существует. Пропускаем миграцию.")
        return
    
    # Добавляем колонку display_order в таблицу activities
    try:
        op.add_column('activities', sa.Column('display_order', sa.Integer(), nullable=True, server_default='0'))
        
        # Устанавливаем порядок для существующих активностей на основе их ID
        op.execute("""
            UPDATE activities 
            SET display_order = id 
            WHERE display_order IS NULL OR display_order = 0
        """)
    except Exception as e:
        print(f"Ошибка при добавлении колонки display_order: {e}")
        # Продолжаем выполнение, так как код уже поддерживает отсутствие этого поля


def downgrade() -> None:
    """Downgrade schema."""
    # Удаляем колонку display_order из таблицы activities
    op.drop_column('activities', 'display_order')
