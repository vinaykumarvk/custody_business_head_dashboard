#!/bin/bash

# Start the Express server
./start_server.sh &
SERVER_PID=$!

# Wait briefly for server to initialize
sleep 2

# Start the Angular client
./start_angular.sh &
ANGULAR_PID=$!

# Wait for both processes to complete
wait $SERVER_PID
wait $ANGULAR_PID