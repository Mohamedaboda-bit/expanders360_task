#!/bin/sh

# Wait for databases to be ready
echo "Waiting for MySQL and MongoDB to be ready..."
sleep 10

# Run database migrations
echo "Running database migrations..."
npm run migration:run

# Run seeders
echo "Running database seeders..."
npm run seed

# Start the application
echo "Starting the application..."
exec node dist/src/main.js
