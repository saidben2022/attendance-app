#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

composer install --no-dev --optimize-autoloader

php artisan migrate --force
