#!/bin/bash

MAX_RETRIES=30
RETRIES=0

until nc -z "$DB_HOST" 3306; do
  echo "⏳ Esperando a que MySQL esté disponible..."
  sleep 2
  RETRIES=$((RETRIES + 1))

  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "❌ MySQL no está disponible después de $((MAX_RETRIES * 2)) segundos. Abortando..."
    exit 1
  fi
done

exec "$@"
