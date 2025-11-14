#!/bin/bash

# Build script for Render deployment
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create logs directory if it doesn't exist
mkdir -p logs

# Set proper permissions
chmod -R 755 .

echo "✅ Build completed successfully!"