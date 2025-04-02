#!/bin/bash

# This script is used by Replit workflows to start the application

echo "Starting Custody Dashboard Application..."

# Kill any existing node processes
pkill -f "node server.mjs" || true
pkill -f "ng serve" || true

# Start the API server first
echo "Starting API server..."
node server.mjs > server_api.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > api-server-pid.txt

echo "API Server started with PID $SERVER_PID"
echo "Server running on port 5000"
echo "API Log file: server_api.log"

# Wait a moment for the API server to initialize
sleep 3

# Test server connection
echo "Testing server connectivity..."
curl -s http://localhost:5000/api/test || echo "Could not connect to server"

# Start the Angular application
echo "Starting Angular application..."
cd angular-client
touch ../angular_debug.log
npx ng serve --host=0.0.0.0 --disable-host-check --port=4200 --proxy-config proxy.conf.json > ../angular_debug.log 2>&1

# Note: We don't use & here to keep the workflow running