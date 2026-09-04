<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator; 

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('metadata_scalar', function ($attribute, $value, $parameters, $validator) {
            // Tolak array/object bersarang, terima string/number/bool/null
            return is_scalar($value) || is_null($value);
        });

        // opsional: batasi panjang string agar tetap konsisten dengan aturan lama (max:1000)
        Validator::extend('metadata_scalar_maxlen', function ($attribute, $value, $parameters, $validator) {
            if (is_string($value)) {
                return strlen($value) <= 1000;
            }
            return true; // angka/boolean tidak perlu batas panjang string
        });
    }
}
