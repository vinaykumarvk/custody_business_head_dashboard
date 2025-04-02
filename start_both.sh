#!/bin/bash
# Start server in background
cd server && npx tsx index.angular.ts &
SERVER_PID=$!
echo $SERVER_PID > server-pid.txt

# Wait a bit for server to start
sleep 5

# Start Angular client in foreground
cd ../angular-client && npx ng serve --host=0.0.0.0 --disable-host-check --port=4200