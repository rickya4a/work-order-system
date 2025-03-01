#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Run seed
echo "Running database seed..."
npm run seed

echo "Database initialization completed!"