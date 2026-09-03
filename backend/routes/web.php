<?php

use App\Http\Controllers\PublicInvoicePdfController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('inv/{token}', [PublicInvoicePdfController::class, 'show'])
    ->name('invoices.pdf.token')
    ->where('token', '.*');