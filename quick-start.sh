#!/bin/bash

# AgriQCert - Quick Start Script
# This script sets up and runs the complete Inji integration

set -e

echo "🚀 AgriQCert - Inji Integration Quick Start"
echo "============================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your Supabase credentials"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Start Inji Certify
echo "🐳 Starting Inji Certify..."
docker-compose up -d inji-certify

echo "⏳ Waiting for Inji Certify to be ready..."
sleep 5

# Health check
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Inji Certify is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "   Attempt $RETRY_COUNT/$MAX_RETRIES..."
    sleep 3
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "⚠️  Inji Certify health check failed, but continuing..."
    echo "   The app will use fallback mock VC generation"
fi

echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Start the app
echo "🎯 Starting AgriQCert app..."
echo ""
echo "============================================"
echo "🌐 App will be available at: http://localhost:5173"
echo "🔧 Inji Certify API: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop"
echo "============================================"
echo ""

npm run dev
