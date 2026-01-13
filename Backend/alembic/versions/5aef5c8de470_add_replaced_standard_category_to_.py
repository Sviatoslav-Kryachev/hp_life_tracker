"""add_replaced_standard_category_to_custom_categories

Revision ID: 5aef5c8de470
Revises: ddba72f32f9a
Create Date: 2025-12-07 11:20:43.093089

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5aef5c8de470'
down_revision: Union[str, Sequence[str], None] = 'ddba72f32f9a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('custom_categories', sa.Column('replaced_standard_category', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('custom_categories', 'replaced_standard_category')
