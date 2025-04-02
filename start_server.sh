#!/bin/bash

echo "Starting server..."

# Kill any existing node processes
pkill -f "tsx index.angular.ts" || true

# Start server
cd "$(dirname "$0")/server"
touch ../server_debug.log
npx tsx index.angular.ts > ../server_debug.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ../server-pid.txt
cd ..

echo "Server started"
echo "Server logs: server_debug.log"
echo "Server running on port 5000"
echo "API endpoints available at: http://localhost:5000/api/*"
echo "Press Ctrl+C to stop the server"

# Keep script running by watching the logs
tail -f server_debug.log