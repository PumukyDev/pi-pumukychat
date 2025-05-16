FROM php:8.2.11-fpm

RUN apt-get update && apt-get install -y \
    git zip unzip curl gnupg2 ca-certificates \
    libzip-dev libpng-dev libonig-dev libxml2-dev

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN docker-php-ext-install pdo pdo_mysql pcntl

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www

COPY php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
