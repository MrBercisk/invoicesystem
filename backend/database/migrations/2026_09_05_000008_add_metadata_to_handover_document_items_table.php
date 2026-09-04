<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('handover_document_items', function (Blueprint $table) {
            // Tempat field spesifik-bisnis yang sifatnya opsional & berubah-ubah
            // (expiry_date, access_url, demo_url, berat, tanggal_kadaluwarsa, dst)
            // tanpa perlu nambah kolom baru tiap kali ada bisnis/kebutuhan baru.
            $table->json('metadata')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('handover_document_items', function (Blueprint $table) {
            $table->dropColumn('metadata');
        });
    }
};