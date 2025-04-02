#!/bin/bash

echo "Stopping any running processes..."
pkill -f 'ng serve' || true
pkill -f 'node server/index.ts.angular' || true

# Wait for processes to stop
sleep 2

echo "Starting Angular application..."
cd angular-client && npm start &
ANGULAR_PID=$!
echo $ANGULAR_PID > ../angular-pid.txt

echo "Starting Express server..."
npx tsx server/index.ts.angular &
SERVER_PID=$!
echo $SERVER_PID > ../server-pid.txt

echo "All processes started successfully!"
echo "Angular application running at http://localhost:4200"
echo "Express server running at http://localhost:5000"

# Keep the script running
wait $ANGULAR_PID $SERVER_PID