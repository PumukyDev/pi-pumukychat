#!/bin/bash

MAX_RETRIES=30
RETRIES=0

echo "Waiting for MySQL to become available at $DB_HOST:3306..."

until nc -z "$DB_HOST" 3306; do
  echo "MySQL is not yet available. Retrying..."
  sleep 2
  RETRIES=$((RETRIES + 1))

  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "MySQL is still unavailable after $((MAX_RETRIES * 2)) seconds. Aborting."
    exit 1
  fi
done

echo "MySQL is now available. Continuing..."
exec "$@"
