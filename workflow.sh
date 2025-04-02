#!/bin/bash

# Function to check if server is running
check_server() {
  if pgrep -f "tsx index.angular.ts" > /dev/null; then
    return 0  # Server is running
  fi
  return 1  # Server is not running
}

# Function to start server
start_server() {
  echo "Starting server..."
  cd server && npx tsx index.angular.ts > ../server_debug.log 2>&1 &
  echo "Server started"
  cd ..
}

# Function to stop server
stop_server() {
  if check_server; then
    echo "Stopping server..."
    pkill -f "tsx index.angular.ts"
    echo "Server stopped"
  else
    echo "Server is not running"
  fi
}

# Start server if it's not running
if ! check_server; then
  start_server
fi

echo "Server started"
echo "Server logs: server_debug.log"
echo "Server running on port 5000"
echo "API endpoints available at: http://localhost:5000/api/*"

# Keep the script running to maintain the process
trap "stop_server; exit" SIGINT SIGTERM
echo "Press Ctrl+C to stop the server"
while true; do
  sleep 60
done