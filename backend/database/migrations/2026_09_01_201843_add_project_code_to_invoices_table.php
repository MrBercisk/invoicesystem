<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->string('project_code')->nullable()->after('client_id')->index();
            $table->string('installment_label')->nullable()->after('status'); // ex: Uang Muka (50%)
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['project_code', 'installment_label']);
        });
    }
};