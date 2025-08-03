#!/bin/bash

# Deploy Script for CV Website
echo "🚀 Starting deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build and deploy
echo "🔨 Building project..."
npm run build

echo "📤 Deploying to Netlify..."
netlify deploy --prod --dir=.

echo "✅ Deployment completed!"
echo "🌐 Your site is live at: https://your-site.netlify.app"