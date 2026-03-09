#!/bin/bash
set -e

echo "Running database migrations..."
python -m alembic upgrade head

echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT
