#!/bin/bash

echo "Starting services..."

# Kill any existing processes
pkill -f "ng serve" || true
pkill -f "node server.js" || true

# Create log files
touch angular.log
touch server.log

# Start backend server
echo "Starting backend server..."
cd "$(dirname "$0")"
node server.js > server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > server.pid

# Wait for server to start
echo "Waiting for server to start..."
sleep 2

# Start Angular application
echo "Starting Angular application..."
cd "$(dirname "$0")/angular-client"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start Angular application
ng serve --host=0.0.0.0 --disable-host-check --port=4200 > ../angular.log 2>&1 &
ANGULAR_PID=$!
echo $ANGULAR_PID > ../angular.pid

echo "Backend server running on http://localhost:5000"
echo "Angular application running on http://localhost:4200"
echo "Server logs: server.log"
echo "Angular logs: angular.log"
echo "Press Ctrl+C to stop all services"

# Keep the script running and show logs
tail -f ../server.log ../angular.log 