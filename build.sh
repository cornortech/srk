#!/bin/bash
set -e

echo "🔧 Installing system dependencies for Puppeteer..."
sudo apt-get update -qq
sudo apt-get install -y -qq \
  libglibmm-1.4-1v5 \
  libcupsimage2 \
  libcups2 \
  libxkbcommon0 \
  libcanberra0 \
  libcanberra-gtk0 \
  libnss3 \
  libatk1.0-0 \
  libgtk-3-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxrandr2 \
  libxss1 \
  libxtst6 \
  libnspr4 \
  libnss3 \
  fonts-liberation \
  xdg-utils \
  libappindicator1 \
  libindicator7 \
  libu2f-udev \
  libvulkan1

echo "✅ System dependencies installed"

echo "📦 Installing npm dependencies..."
npm install

echo "🏗️  Building task app with pre-rendering..."
npm run build:task

echo "✅ Build complete!"
