#!/bin/bash

# Initialize server
echo "Starting Custody Dashboard API Server..."

# Kill any existing node process for this server
pkill -f "node server.mjs" || true

# Start server
node server.mjs > server_api.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > api-server-pid.txt

echo "API Server started with PID $SERVER_PID"
echo "Server running on port 5000"
echo "Try visiting http://localhost:5000 to see the API endpoints"
echo "Log file: server_api.log"
echo ""
echo "Testing server connectivity..."
sleep 2
curl -s http://localhost:5000/api/test || echo "Could not connect to server"