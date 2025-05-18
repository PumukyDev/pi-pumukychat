#!/bin/sh

set -e

echo "🧩 Esperando a que se genere el build de frontend..."
while [ ! -f /var/www/public/build/manifest.json ]; do
    sleep 1
done

echo "📦 Instalando dependencias PHP..."
composer install --no-dev --optimize-autoloader

if [ ! -f /var/www/.env ]; then
    cp /var/www/.env.example /var/www/.env
    echo "📄 Archivo .env generado desde .env.example"
fi

php artisan config:clear

echo "🔧 Corrigiendo permisos en storage y bootstrap/cache..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R ug+rwx /var/www/storage /var/www/bootstrap/cache

if grep -q '^APP_KEY=.*' /var/www/.env; then
    echo "🔑 Clave de aplicación ya existe en .env"
else
    echo "🔑 Generando clave de aplicación..."
    php artisan key:generate --force
fi

/usr/local/bin/wait-for-it.sh php artisan migrate --force

echo "🗄️ Ejecutando migraciones..."
php artisan migrate --force || echo "⚠️ Algunas migraciones ya fueron ejecutadas."

echo "🔗 Creando enlace de storage (ignorando si ya existe)..."
php artisan storage:link || echo "⚠️ El enlace de storage ya existe."

php artisan config:cache

echo "🚀 Iniciando PHP-FPM..."
exec "$@"
