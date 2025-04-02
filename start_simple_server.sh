#!/bin/bash

echo "Starting simple Express server..."

# Kill any existing node processes using this server file
pkill -f "node server.mjs" || true

# Start server
node server.mjs > server_output.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > simple-server-pid.txt

echo "Server started with PID $SERVER_PID"
echo "Server running on port 5000"
echo "API endpoints available at: http://localhost:5000/api/*"
echo "Log file: server_output.log"
echo ""
echo "Testing server connectivity..."
sleep 2
curl -s http://localhost:5000/api/test || echo "Could not connect to server"
echo ""
echo "Press Ctrl+C to stop"