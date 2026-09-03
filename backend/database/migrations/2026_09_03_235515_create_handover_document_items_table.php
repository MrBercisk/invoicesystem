<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('handover_document_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('handover_document_id')->constrained()->cascadeOnDelete();

            $table->enum('type', ['barang', 'pekerjaan']);
            $table->string('name');
            $table->text('description')->nullable();

            $table->decimal('quantity', 12, 2)->default(1);
            $table->string('unit')->nullable(); // pcs, unit, paket, dll — kosong kalau type=pekerjaan

            $table->string('condition')->nullable(); // Baik/Rusak/dll — relevan untuk type=barang
            $table->text('notes')->nullable();

            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('handover_document_items');
    }
};