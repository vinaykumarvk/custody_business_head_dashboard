#!/bin/bash

# Start both the API server and Angular application

echo "Starting Custody Dashboard Application..."

# Kill any existing node processes
pkill -f "node server.mjs" || true
pkill -f "ng serve" || true

# Start the API server
echo "Starting API server..."
node server.mjs > server_api.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > api-server-pid.txt

echo "API Server started with PID $SERVER_PID"
echo "Server running on port 5000"
echo "Log file: server_api.log"

# Wait a moment for the API server to initialize
sleep 2

# Test server connection
echo "Testing server connectivity..."
curl -s http://localhost:5000/api/test || echo "Could not connect to server"

# Start the Angular application
echo "Starting Angular application..."
cd "$(dirname "$0")/angular-client" || exit
touch ../angular_debug.log
npx ng serve --host=0.0.0.0 --disable-host-check --port=4200 --proxy-config proxy.conf.json > ../angular_debug.log 2>&1 &
ANGULAR_PID=$!
echo $ANGULAR_PID > ../angular-pid.txt

echo "Angular application building on port 4200"
echo "Angular logs: angular_debug.log"
echo "Both services started! You can access the Angular dashboard at http://localhost:4200"

# Wait for both processes
wait