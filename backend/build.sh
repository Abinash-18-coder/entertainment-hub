#!/usr/bin/env bash
# Exit on any error
set -o errexit

echo "📦 Installing backend Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🔄 Running Alembic Database Migrations against cloud PostgreSQL..."
alembic upgrade head

echo "✅ Build and database migrations completed successfully!"