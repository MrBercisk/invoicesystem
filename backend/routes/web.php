<?php

use App\Http\Controllers\PublicHandoverPdfController;
use App\Http\Controllers\PublicInvoicePdfController;
use App\Http\Controllers\PublicReceiptPdfController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('inv/{token}', [PublicInvoicePdfController::class, 'show'])
    ->name('invoices.pdf.token')
    ->where('token', '.*');

Route::get('doc/{token}', [PublicHandoverPdfController::class, 'show']);

Route::get('kwt/{token}', [PublicReceiptPdfController::class, 'show'])
    ->name('receipts.pdf.token')
    ->where('token', '.*');