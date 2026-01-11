#!/bin/bash
# Simple deploy script - Git pull and rebuild

cd /opt/hp-life-tracker

echo "🔄 Pulling latest changes from Git..."
git pull

echo "🔨 Rebuilding Docker containers..."
docker compose up -d --build

echo "✅ Deploy complete!"
echo "📋 Checking container status..."
docker compose ps

echo ""
echo "📝 To view logs: docker compose logs -f app"
