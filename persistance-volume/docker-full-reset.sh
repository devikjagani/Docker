#!/bin/bash

echo "🛑 Stopping all running containers..."
docker stop $(docker ps -aq) 2>/dev/null

echo "🗑️ Removing all containers..."
docker rm $(docker ps -aq) 2>/dev/null

echo "🗑️ Removing all images..."
docker rmi -f $(docker images -aq) 2>/dev/null

echo "🗑️ Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null

echo "🔗 Removing all Docker networks (including default ones — will ignore errors)..."
docker network rm $(docker network ls -q) 2>/dev/null

echo "🧹 Pruning build cache..."
docker builder prune -af

echo "✅ Docker environment fully cleaned."
echo "📦 Remaining volumes:"
docker volume ls

echo "🔗 Remaining networks:"
docker network ls

echo "🐳 Docker reset complete."
