FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install \
    pdo_mysql \
    intl \
    zip \
    opcache

RUN pecl install apcu && docker-php-ext-enable apcu

RUN a2enmod rewrite

COPY docker/php.ini /usr/local/etc/php/conf.d/app.ini

COPY docker/000-public.conf /etc/apache2/sites-available/000-public.conf
RUN a2dissite 000-default.conf && a2ensite 000-public.conf

COPY --from=composer:2.7 /usr/bin/composer /usr/local/bin/composer

RUN echo 'alias sc="php bin/console"' >> /etc/bash.bashrc

WORKDIR /var/www/html
