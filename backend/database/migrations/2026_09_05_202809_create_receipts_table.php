<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number')->unique();

            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();

            $table->date('receipt_date');
            $table->decimal('amount', 15, 2);
            $table->string('payment_method')->default('transfer');
            $table->string('payment_for');
            $table->text('notes')->nullable();

            $table->string('received_by_name')->nullable();
            $table->string('received_by_title')->nullable();

            $table->boolean('requires_stamp_duty')->default(false);
            $table->string('status')->default('issued');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};