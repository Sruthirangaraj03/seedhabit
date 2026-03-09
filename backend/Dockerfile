# Multi-stage Python Dockerfile for SeedHabit backend
FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target=/install

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*
RUN addgroup --system app && adduser --system --group app

COPY --from=builder /install /install
ENV PYTHONPATH=/install

COPY ./app ./app
COPY alembic.ini .
COPY alembic ./alembic

RUN chown -R app:app /app

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8000
USER app

CMD ["bash", "start.sh"]