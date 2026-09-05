<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id'     => 'sometimes|exists:companies,id',
            'client_id'      => 'sometimes|exists:clients,id',
            'invoice_id'     => 'nullable|exists:invoices,id',
            'receipt_date'   => 'sometimes|date',
            'amount'         => 'sometimes|numeric|min:0.01',
            'payment_method' => 'sometimes|in:transfer,tunai,ewallet,lainnya',
            'payment_for'    => 'sometimes|string|max:255',
            'notes'          => 'nullable|string',
            'received_by_name'  => 'nullable|string|max:255',
            'received_by_title' => 'nullable|string|max:255',
            'requires_stamp_duty' => 'nullable|boolean',
            'status'         => 'sometimes|in:issued,void',
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.exists' => 'Perusahaan tidak ditemukan.',
            'client_id.exists'  => 'Client tidak ditemukan.',
            'invoice_id.exists' => 'Invoice tidak ditemukan.',
            'amount.min'        => 'Jumlah pembayaran minimal Rp 0,01.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
            'status.in'         => 'Status tidak valid. Pilih salah satu: issued, void.',
        ];
    }
}