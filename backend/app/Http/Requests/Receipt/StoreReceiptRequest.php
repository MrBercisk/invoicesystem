<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;

class StoreReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id'     => 'required|exists:companies,id',
            'client_id'      => 'required|exists:clients,id',
            'invoice_id'     => 'nullable|exists:invoices,id',
            'receipt_date'   => 'required|date',
            'amount'         => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:transfer,tunai,ewallet,lainnya',
            'payment_for'    => 'required|string|max:255',
            'notes'          => 'nullable|string',
            'received_by_name'  => 'nullable|string|max:255',
            'received_by_title' => 'nullable|string|max:255',
            'requires_stamp_duty' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required' => 'Perusahaan wajib dipilih.',
            'company_id.exists'   => 'Perusahaan tidak ditemukan.',

            'client_id.required' => 'Client wajib dipilih.',
            'client_id.exists'   => 'Client tidak ditemukan.',

            'invoice_id.exists' => 'Invoice tidak ditemukan.',

            'receipt_date.required' => 'Tanggal kwitansi wajib diisi.',

            'amount.required' => 'Jumlah pembayaran wajib diisi.',
            'amount.min'      => 'Jumlah pembayaran minimal Rp 0,01.',

            'payment_method.required' => 'Metode pembayaran wajib diisi.',
            'payment_method.in'       => 'Metode pembayaran tidak valid.',

            'payment_for.required' => 'Keterangan pembayaran wajib diisi.',
            'payment_for.max'      => 'Keterangan pembayaran maksimal 255 karakter.',
        ];
    }
}