<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_pdf_links', function (Blueprint $table) {
            $table->id();
            $table->string('token', 32)->unique();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->string('template', 20)->default('minimalis');
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['token', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_pdf_links');
    }
};