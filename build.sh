#!/bin/bash
set -e

echo " Installing npm dependencies..."
npm install

echo "🏗️  Building task app with pre-rendering..."
npm run build:task

echo "📋 Copying SEO files (robots.txt, sitemap.xml, ads.txt)..."
cp apps/task/public/robots.txt dist/apps/task/robots.txt
cp apps/task/public/sitemap.xml dist/apps/task/sitemap.xml
cp apps/task/public/ads.txt dist/apps/task/ads.txt

echo "✅ Build complete!"
echo "📁 Dist folder contents:"
ls -la dist/apps/task/ | head -15