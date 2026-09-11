# Multi-stage Dockerfile for AeroTwin Backend + Digital Twin Engine
FROM python:3.11-slim

WORKDIR /app

# Install build dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY digital_twin/ ./digital_twin/
COPY backend/ ./backend/
COPY data/ ./data/

# Environment settings
ENV PYTHONPATH=/app
ENV REPLAY_MODE=true
ENV PORT=8000

EXPOSE 8000

# Start command
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
