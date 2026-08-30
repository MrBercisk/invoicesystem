<?php

namespace App\Http\Requests\Invoice;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id'   => 'sometimes|exists:companies,id',
            'client_id'    => 'sometimes|exists:clients,id',
            'invoice_date' => 'sometimes|date',
            'due_date'     => 'sometimes|date',
            'status'       => 'sometimes|in:draft,sent,paid,cancelled',
            'tax_rate'     => 'nullable|numeric',
            'discount'     => 'nullable|numeric|min:0',
            'notes'        => 'nullable|string',
            'terms'        => 'nullable|string',
            'items'        => 'sometimes|array|min:1',
            'items.*.name'         => 'required_with:items|string',
            'items.*.quantity'     => 'required_with:items|numeric|min:0.01',
            'items.*.price'        => 'required_with:items|numeric|min:0',
            'items.*.unit'         => 'nullable|string',
            'items.*.description'  => 'nullable|string',
            'items.*.product_id'   => 'nullable|exists:products,id',
        ];
    }

    public function messages(): array
    {
        return [
            'company_id.exists' => 'Perusahaan tidak ditemukan.',
            'client_id.exists'  => 'Client tidak ditemukan.',
            'status.in'         => 'Status tidak valid.',
            'items.min'         => 'Invoice harus memiliki minimal 1 item.',
            'items.*.name.required_with'     => 'Nama item wajib diisi.',
            'items.*.quantity.required_with' => 'Jumlah item wajib diisi.',
            'items.*.price.required_with'    => 'Harga item wajib diisi.',
        ];
    }
}