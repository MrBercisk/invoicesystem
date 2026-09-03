<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('handover_documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_number')->unique();

            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();

            // Opsional: kaitkan ke invoice tertentu (mis. serah terima setelah pelunasan)
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();

            $table->date('document_date');
            $table->string('location')->nullable(); // tempat serah terima dilakukan

            $table->enum('status', ['draft', 'completed', 'cancelled'])->default('draft');

            // Pihak yang menyerahkan (default dari company, bisa override)
            $table->string('handover_by_name')->nullable();
            $table->string('handover_by_title')->nullable();

            // Pihak yang menerima (default dari client, bisa override)
            $table->string('received_by_name')->nullable();
            $table->string('received_by_title')->nullable();

            $table->text('notes')->nullable();
            $table->text('terms')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('handover_documents');
    }
};