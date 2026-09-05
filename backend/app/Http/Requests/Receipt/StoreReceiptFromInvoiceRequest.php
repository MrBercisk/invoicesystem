<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;

class StoreReceiptFromInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receipt_date'   => 'nullable|date',
            'amount'         => 'nullable|numeric|min:0.01',
            'payment_method' => 'nullable|in:transfer,tunai,ewallet,lainnya',
            'notes'          => 'nullable|string',
            'received_by_name'  => 'nullable|string|max:255',
            'received_by_title' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'amount.min' => 'Jumlah pembayaran minimal Rp 0,01.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
        ];
    }
}