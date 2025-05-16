#!/bin/sh

chown -R www-data:www-data /var/www/storage
chmod -R 775 /var/www/storage

npm run build

# Opcional: migrate si lo necesitas
php artisan migrate --force

# Arranca los listeners en background (puedes omitir si no los necesitas ahora)
php artisan queue:listen &
php artisan reverb:start --debug &

# PHP-FPM en foreground, mantiene el contenedor vivo y Nginx podrá conectar
exec php-fpm
