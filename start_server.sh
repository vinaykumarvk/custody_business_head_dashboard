#!/bin/bash

echo "Stopping any running server processes..."
pkill -f 'node server/index.angular.ts' || true

# Wait for processes to stop
sleep 2

echo "Starting Express server..."
npx tsx server/index.angular.ts &
SERVER_PID=$!
echo $SERVER_PID > server-pid.txt

echo "Express server running at http://localhost:5000"

# Keep the script running
wait $SERVER_PID