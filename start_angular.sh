#!/bin/bash

echo "Starting Angular application..."

# Kill any existing Angular processes
pkill -f "ng serve" || true

# Create log file
touch angular_debug.log

# Change to Angular client directory
cd "$(dirname "$0")/angular-client"

# Start Angular application
npx ng serve --host=0.0.0.0 --disable-host-check --port=4200 > ../angular_debug.log 2>&1 &
ANGULAR_PID=$!
echo $ANGULAR_PID > ../angular-pid.txt

echo "Angular application building on port 4200"
echo "Angular logs: angular_debug.log"
echo "Angular UI available at: http://localhost:4200"
echo "Press Ctrl+C to stop the Angular application"

# Keep the script running
tail -f ../angular_debug.log