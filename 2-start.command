#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")"
echo "========================================="
echo "  Church2Connect — Starting..."
echo "========================================="
echo ""
echo "  The app will open in your browser."
echo "  To STOP: close this window."
echo ""

# Kill any leftovers
lsof -ti:5174 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start backend
node server/index.js &

# Start frontend
sleep 1
npm run client &

# Open browser
sleep 4
open http://localhost:3000

# Keep window open
wait
