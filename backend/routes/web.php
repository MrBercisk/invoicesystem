<?php

use App\Http\Controllers\PublicInvoicePdfController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/invoices/{invoice}/pdf', [PublicInvoicePdfController::class, 'show'])
    ->name('invoices.pdf.public')
    ->middleware('signed');