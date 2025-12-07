"""add_category_to_activities

Revision ID: 0dcd9d03e3a9
Revises: 72597b7e67e8
Create Date: 2025-12-07 09:25:54.403922

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0dcd9d03e3a9'
down_revision: Union[str, Sequence[str], None] = '72597b7e67e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Добавляем колонку category в таблицу activities
    op.add_column('activities', sa.Column('category', sa.String(length=50), nullable=True, server_default='general'))


def downgrade() -> None:
    """Downgrade schema."""
    # Удаляем колонку category из таблицы activities
    op.drop_column('activities', 'category')
