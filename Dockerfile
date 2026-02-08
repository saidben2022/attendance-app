# Build frontend assets
FROM node:20 as frontend
WORKDIR /app
COPY package*.json vite.config.js ./
RUN npm install
COPY resources ./resources
COPY public ./public
# Copy other necessary config files for build
COPY jsconfig.json tailwind.config.js postcss.config.js ./
RUN npm run build

# Build PHP app
FROM php:8.3-apache
WORKDIR /var/www/html

# Install dependencies for Postgres and standard Laravel env
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    libicu-dev \
 && docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    zip \
    intl \
    bcmath

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Configure Apache DocumentRoot to /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy app files
COPY . .
# Copy compiled assets from frontend stage
COPY --from=frontend /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Custom entrypoint to run migrations on startup
RUN echo "#!/bin/sh\nphp artisan migrate --force\napache2-foreground" > /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

CMD ["start-container"]
