#!/bin/bash

# Function to check if server is running
check_server() {
  if pgrep -f "tsx index.angular.ts" > /dev/null; then
    return 0  # Server is running
  fi
  return 1  # Server is not running
}

# Function to check if Angular app is running
check_angular() {
  if pgrep -f "ng serve" > /dev/null; then
    return 0  # Angular is running
  fi
  return 1  # Angular is not running
}

# Function to start server
start_server() {
  echo "Starting server..."
  cd server && npx tsx index.angular.ts > ../server_debug.log 2>&1 &
  echo "Server started"
  cd ..
}

# Function to start Angular
start_angular() {
  echo "Starting Angular application..."
  cd angular-client
  # Create the angular_debug.log file if it doesn't exist
  touch ../angular_debug.log
  npx ng serve --host=0.0.0.0 --disable-host-check --port=4200 > ../angular_debug.log 2>&1 &
  echo "Angular application starting"
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

# Function to stop Angular
stop_angular() {
  if check_angular; then
    echo "Stopping Angular application..."
    pkill -f "ng serve"
    echo "Angular application stopped"
  else
    echo "Angular application is not running"
  fi
}

# Start server if it's not running
if ! check_server; then
  start_server
fi

# Start Angular if it's not running
if ! check_angular; then
  start_angular
fi

echo "Server started"
echo "Angular application starting"
echo "Server logs: server_debug.log"
echo "Angular logs: angular_debug.log"
echo "Server running on port 5000"
echo "Angular running on port 4200"
echo "API endpoints available at: http://localhost:5000/api/*"
echo "Angular UI available at: http://localhost:4200"

# Keep the script running to maintain the process
trap "stop_server; stop_angular; exit" SIGINT SIGTERM
echo "Press Ctrl+C to stop all services"
while true; do
  sleep 60
done