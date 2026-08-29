#!/bin/bash
set -e

# Pastikan folder cache Laravel ada (kadang hilang karena .gitignore/bind mount kosong)
mkdir -p /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/testing \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

# Fix ownership & permission tiap kali container start
# (perlu diulang tiap start karena bind mount bisa menimpa permission dari image)
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Kalau composer belum pernah dijalankan (vendor belum ada), jalankan otomatis
if [ ! -d "/var/www/html/vendor" ]; then
    composer install --no-interaction --optimize-autoloader
fi

# Generate APP_KEY otomatis kalau belum ada dan .env sudah ada
if [ -f "/var/www/html/.env" ] && ! grep -q "^APP_KEY=base64" /var/www/html/.env; then
    php artisan key:generate --force
fi

# Bersihkan cache Blade/config lama yang mungkin corrupt dari sesi sebelumnya
php artisan view:clear || true
php artisan config:clear || true

exec "$@"