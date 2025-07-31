"""minor change

Revision ID: f517aaa89540
Revises: ccc0986cab9c
Create Date: 2025-07-26 22:24:33.336632

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f517aaa89540'
down_revision = 'ccc0986cab9c'
branch_labels = None
depends_on = None


def upgrade():
    # Check if table exists before trying to drop it
    conn = op.get_bind()
    result = conn.execute(
        sa.text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'playing_with_neon'
            )
        """)
    )
    if result.scalar():
        op.drop_table('playing_with_neon')


def downgrade():
    # Recreate the table on downgrade
    op.create_table(
        'playing_with_neon',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('name', sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column('value', sa.REAL(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint('id', name='playing_with_neon_pkey')
    )
