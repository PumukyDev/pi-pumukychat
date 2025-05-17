# Build frontend with Vite
FROM node:18 AS nodebuild

WORKDIR /app
COPY ../src/package*.json ./
RUN npm install
COPY ../src/ .
RUN npm run build

# Backend PHP
FROM php:8.2.11-fpm

RUN apt-get update && apt-get install -y \
    git zip unzip curl gnupg2 ca-certificates \
    libzip-dev libpng-dev libonig-dev libxml2-dev

RUN docker-php-ext-install pdo pdo_mysql pcntl

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www

COPY ../src /var/www

COPY --from=nodebuild /app/public/build /var/www/public/build

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
