#!/bin/bash

# Start the Express server
cd server && npx tsx index.ts &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"
sleep 3

# Start the Angular app
cd angular-client && npx ng serve --port 4200 --host 0.0.0.0 &
ANGULAR_PID=$!
echo "Angular app started with PID: $ANGULAR_PID"

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?