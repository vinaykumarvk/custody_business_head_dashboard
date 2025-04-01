#!/bin/bash

# Kill any existing processes
pkill -f "tsx server/index.ts" || true
pkill -f "ng serve" || true
pkill -f "vite" || true
sleep 2

# Start the server
echo "Starting Express server..."
cd server && npx tsx index.ts &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"
sleep 3

# Start Angular app
echo "Starting Angular app..."
cd angular-client && npx ng serve --port 4200 --host 0.0.0.0 --disable-host-check &
ANGULAR_PID=$!
echo "Angular app started with PID: $ANGULAR_PID"
sleep 3

# Start React app
echo "Starting React app..."
cd client && npx vite --port 3000 --host 0.0.0.0 &
REACT_PID=$!
echo "React app started with PID: $REACT_PID"

echo "All services are now running"
echo "Angular app: http://localhost:4200"
echo "React app: http://localhost:3000"
echo "API server: http://localhost:5000"

# Keep the script running
wait