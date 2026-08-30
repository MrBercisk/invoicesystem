<?php

namespace App\Http\Requests\Invoice;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id'   => 'required|exists:companies,id',
            'client_id'    => 'required|exists:clients,id',
            'invoice_date' => 'required|date',
            'due_date'     => 'required|date|after_or_equal:invoice_date',
            'tax_rate'     => 'nullable|numeric|min:0|max:100',
            'discount'     => 'nullable|numeric|min:0',
            'notes'        => 'nullable|string',
            'terms'        => 'nullable|string',
            'items'        => 'required|array|min:1',
            'items.*.name'         => 'required|string',
            'items.*.quantity'     => 'required|numeric|min:0.01',
            'items.*.price'        => 'required|numeric|min:0',
            'items.*.unit'         => 'nullable|string',
            'items.*.description'  => 'nullable|string',
            'items.*.product_id'   => 'nullable|exists:products,id',
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.required'   => 'Perusahaan wajib dipilih.',
            'company_id.exists'     => 'Perusahaan tidak ditemukan.',
            'client_id.required'    => 'Client wajib dipilih.',
            'client_id.exists'      => 'Client tidak ditemukan.',
            'invoice_date.required' => 'Tanggal invoice wajib diisi.',
            'due_date.required'     => 'Tanggal jatuh tempo wajib diisi.',
            'due_date.after_or_equal' => 'Tanggal jatuh tempo tidak boleh sebelum tanggal invoice.',
            'items.required'        => 'Invoice harus memiliki minimal 1 item.',
            'items.min'             => 'Invoice harus memiliki minimal 1 item.',
            'items.*.name.required'     => 'Nama item wajib diisi.',
            'items.*.quantity.required' => 'Jumlah item wajib diisi.',
            'items.*.quantity.min'      => 'Jumlah item minimal 0.01.',
            'items.*.price.required'    => 'Harga item wajib diisi.',
            'items.*.price.min'         => 'Harga item tidak boleh negatif.',
        ];
    }
}