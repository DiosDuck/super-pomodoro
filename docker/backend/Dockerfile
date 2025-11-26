FROM php:8.2-fpm-alpine

RUN apk add --no-cache bash curl ca-certificates

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

ARG ENABLE_XDEBUG=0

RUN apk add --no-cache icu-dev libzig-dev openssl $PHPIZE_DEPS; \
    docker-php-ext-install -j"$(nproc)" pdo pdo_mysql intl zip opcache openssl; \
    pecl install redis; docker-php-ext-enable redis; \
    if [ "$ENABLE_XDEBUG" = "1" ]; then pecl install xdebug && docker-php-ext-enable xdebug; fi; \
    apk del $PHPIZE_DEPS

WORKDIR /var/www/backend

CMD ["php-fpm", "-F"]
