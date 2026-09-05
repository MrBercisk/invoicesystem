<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipt_pdf_links', function (Blueprint $table) {
            $table->id();
            $table->string('token')->unique();
            $table->foreignId('receipt_id')->constrained()->cascadeOnDelete();
            $table->string('template')->default('minimalis');
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipt_pdf_links');
    }
};