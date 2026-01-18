#!/bin/bash
# Simple deploy script - Git pull and rebuild

cd /opt/hp-life-tracker

echo "🔄 Pulling latest changes from Git..."
git pull

echo "📁 Checking directory structure..."
if [ ! -d "Frontend" ] || [ ! -d "Backend" ]; then
    echo "❌ ERROR: Frontend/ or Backend/ directories not found!"
    echo "Current structure:"
    ls -la
    exit 1
fi

echo "✅ Directory structure OK"

echo "🔨 Stopping containers..."
docker compose down

echo "🔨 Rebuilding Docker containers (no cache)..."
docker compose build --no-cache app

echo "🚀 Starting containers..."
docker compose up -d

echo "✅ Deploy complete!"
echo "📋 Checking container status..."
docker compose ps

echo ""
echo "📝 To view logs: docker compose logs -f app"
echo ""
echo "🔍 Verifying files in container:"
docker exec hp-life-tracker_app ls -la /app/Frontend/static/js/app.js 2>/dev/null || echo "⚠️  Container not ready yet"