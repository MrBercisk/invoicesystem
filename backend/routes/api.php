<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\HandoverDocumentController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReceiptController;

Route::prefix('v1')->group(function () {

    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);

        Route::apiResource('companies', CompanyController::class);
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('products', ProductController::class);

        Route::get(
            'invoices/projects',
            [InvoiceController::class, 'projects']
        );

        Route::get(
            'invoices/{invoice}/pdf-url',
            [InvoiceController::class, 'pdfUrl']
        );

        Route::patch(
            'invoices/{invoice}/status',
            [InvoiceController::class, 'updateStatus']
        );

        Route::apiResource('invoices', InvoiceController::class);

        Route::patch(
            'handover-documents/{handoverDocument}/status',
            [HandoverDocumentController::class, 'updateStatus']
        );

        Route::get(
            'handover-documents/{handoverDocument}/pdf-url',
            [HandoverDocumentController::class, 'pdfUrl']
        );

        Route::apiResource('handover-documents', HandoverDocumentController::class);


        Route::post(
            'invoices/{invoice}/receipt',
            [ReceiptController::class, 'storeFromInvoice']
        );

        Route::patch(
            'receipts/{receipt}/void',
            [ReceiptController::class, 'void']
        );

        Route::get(
            'receipts/{receipt}/pdf-url',
            [ReceiptController::class, 'pdfUrl']
        );

        Route::apiResource('receipts', ReceiptController::class);
    });
});