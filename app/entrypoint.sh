#!/bin/sh

set -e

echo "Waiting for frontend build to be ready..."
while [ ! -f /var/www/public/build/manifest.json ]; do
    sleep 1
done

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

if [ ! -f /var/www/.env ]; then
    cp /var/www/.env.example /var/www/.env
    echo ".env file created from .env.example"
fi

php artisan config:clear

echo "Setting correct permissions for storage and bootstrap/cache..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R ug+rwx /var/www/storage /var/www/bootstrap/cache

if grep -q '^APP_KEY=.*' /var/www/.env; then
    echo "Application key already exists in .env"
else
    echo "Generating application key..."
    php artisan key:generate --force
fi

/usr/local/bin/wait-for-it.sh php artisan migrate --force

echo "Running database migrations..."
php artisan migrate --force || echo "Some migrations may have already been run."

echo "Creating storage symlink (if it doesn't already exist)..."
php artisan storage:link || echo "Storage symlink already exists."

php artisan config:cache

echo "Starting PHP-FPM..."
exec "$@"
