#!/bin/bash

# Start the server
cd server
npx tsx index.ts &
SERVER_PID=$!
echo "Server started with PID $SERVER_PID"

# Give the server time to start
sleep 5

# Try to make some API requests
echo "Testing API endpoints..."
curl -s localhost:5000/api/customer-metrics
echo -e "\n"

# Keep the script running to keep the server process alive
wait $SERVER_PID
