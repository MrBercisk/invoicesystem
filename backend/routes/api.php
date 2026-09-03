<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ProductController;
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
    });
});