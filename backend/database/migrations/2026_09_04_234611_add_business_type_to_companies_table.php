<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // Menentukan kamus label mana yang dipakai (lihat App\Support\ItemLabels).
            // Bebas ditambah nilai baru kapan saja tanpa migrasi lanjutan —
            // cukup tambah entry baru di ItemLabels & itemLabels.ts.
            $table->string('business_type')->default('general')->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('business_type');
        });
    }
};