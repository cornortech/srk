#!/bin/bash
set -e

echo " Installing npm dependencies..."
npm install

echo "🏗️  Building task app with pre-rendering..."
npm run build:task

echo "✅ Build complete!"
