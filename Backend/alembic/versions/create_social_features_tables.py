"""create social features tables

Revision ID: social_features_001
Revises: dpcpp6w73ey6
Create Date: 2025-01-12 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'social_features_001'
down_revision = 'dpcpp6w73ey6'
branch_labels = None
depends_on = None


def upgrade():
    # Создаем таблицу groups
    op.create_table(
        'groups',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('invite_code', sa.String(), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_groups_id'), 'groups', ['id'], unique=False)
    op.create_index(op.f('ix_groups_invite_code'), 'groups', ['invite_code'], unique=True)

    # Создаем таблицу group_members
    op.create_table(
        'group_members',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('group_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('role', sa.String(), nullable=True),
        sa.Column('joined_at', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_group_members_id'), 'group_members', ['id'], unique=False)

    # Создаем таблицу challenges
    op.create_table(
        'challenges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('group_id', sa.Integer(), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('target_xp', sa.Float(), nullable=False),
        sa.Column('challenge_type', sa.String(), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('end_date', sa.DateTime(), nullable=False),
        sa.Column('reward_xp', sa.Float(), nullable=True),
        sa.Column('is_active', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_challenges_id'), 'challenges', ['id'], unique=False)

    # Создаем таблицу challenge_participants
    op.create_table(
        'challenge_participants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('challenge_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('current_progress', sa.Float(), nullable=True),
        sa.Column('is_completed', sa.Integer(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('joined_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['challenge_id'], ['challenges.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_challenge_participants_id'), 'challenge_participants', ['id'], unique=False)

    # Создаем таблицу achievements
    op.create_table(
        'achievements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('achievement_type', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('earned_at', sa.DateTime(), nullable=True),
        sa.Column('is_shared', sa.Integer(), nullable=True),
        sa.Column('shared_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_achievements_id'), 'achievements', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_achievements_id'), table_name='achievements')
    op.drop_table('achievements')
    op.drop_index(op.f('ix_challenge_participants_id'), table_name='challenge_participants')
    op.drop_table('challenge_participants')
    op.drop_index(op.f('ix_challenges_id'), table_name='challenges')
    op.drop_table('challenges')
    op.drop_index(op.f('ix_group_members_id'), table_name='group_members')
    op.drop_table('group_members')
    op.drop_index(op.f('ix_groups_invite_code'), table_name='groups')
    op.drop_index(op.f('ix_groups_id'), table_name='groups')
    op.drop_table('groups')
