#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")"
echo "========================================="
echo "  Church2Connect — Installing..."
echo "========================================="
echo ""
npm install
echo ""
echo "========================================="
echo "  Done! You can close this window."
echo "  Now double-click 2-start.command"
echo "========================================="
read -p "Press Enter to close..."
