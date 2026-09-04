<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('handover_documents', function (Blueprint $table) {
            // Jumlah hari garansi sejak document_date. Nullable = tidak ada garansi.
            // Dipakai untuk kedua bisnis (garansi bug-fix web dev, garansi retur kue, dst).
            $table->unsignedSmallInteger('warranty_days')->nullable()->after('terms');
        });
    }

    public function down(): void
    {
        Schema::table('handover_documents', function (Blueprint $table) {
            $table->dropColumn('warranty_days');
        });
    }
};