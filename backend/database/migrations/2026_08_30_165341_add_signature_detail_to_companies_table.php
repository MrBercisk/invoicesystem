<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('signature')->nullable()->after('website');
            $table->string('signature_name')->nullable()->after('signature');
            $table->string('signature_title')->nullable()->after('signature_name');
            $table->string('stamp')->nullable()->after('signature_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn([
                'signature',
                'signature_name',
                'signature_title',
                'stamp',
            ]);
        });
    }
};