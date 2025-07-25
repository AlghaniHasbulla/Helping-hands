"""initial

Revision ID: 50629c7cebaa
Revises: 
Create Date: 2025-07-24 16:15:04.650633

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '50629c7cebaa'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=False),
    sa.Column('role', sa.String(length=20), nullable=True),
    sa.Column('is_verified', sa.Boolean(), nullable=True),
    sa.Column('avatar_url', sa.String(length=255), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('donation_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ngo_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('amount_requested', sa.Float(), nullable=False),
    sa.Column('is_approved', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['ngo_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('donations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('donor_id', sa.Integer(), nullable=False),
    sa.Column('donation_request_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('donated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['donation_request_id'], ['donation_requests.id'], ),
    sa.ForeignKeyConstraint(['donor_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('donations')
    op.drop_table('donation_requests')
    op.drop_table('users')
    op.drop_table('categories')
    # ### end Alembic commands ###
