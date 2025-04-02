#!/bin/bash

echo "Stopping any running Angular processes..."
pkill -f 'ng serve' || true

# Wait for processes to stop
sleep 2

echo "Starting Angular client..."
cd angular-client && npx ng serve --port 4200 --host 0.0.0.0 &
ANGULAR_PID=$!
echo $ANGULAR_PID > angular-pid.txt

echo "Angular client running at http://localhost:4200"

# Keep the script running
wait $ANGULAR_PID