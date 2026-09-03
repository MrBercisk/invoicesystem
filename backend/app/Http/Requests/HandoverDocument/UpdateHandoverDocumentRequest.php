<?php

namespace App\Http\Requests\HandoverDocument;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHandoverDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['sometimes', 'integer', 'exists:companies,id'],
            'client_id' => ['sometimes', 'integer', 'exists:clients,id'],
            'invoice_id' => ['nullable', 'integer', 'exists:invoices,id'],

            'document_date' => ['sometimes', 'date'],
            'location' => ['nullable', 'string', 'max:255'],

            'handover_by_name' => ['nullable', 'string', 'max:255'],
            'handover_by_title' => ['nullable', 'string', 'max:255'],
            'received_by_name' => ['nullable', 'string', 'max:255'],
            'received_by_title' => ['nullable', 'string', 'max:255'],

            'notes' => ['nullable', 'string'],
            'terms' => ['nullable', 'string'],

            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.type' => ['required_with:items', 'in:barang,pekerjaan'],
            'items.*.name' => ['required_with:items', 'string', 'max:255'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity' => ['required_with:items', 'numeric', 'min:0.01'],
            'items.*.unit' => ['nullable', 'string', 'max:50'],
            'items.*.condition' => ['nullable', 'string', 'max:100'],
            'items.*.notes' => ['nullable', 'string'],
        ];
    }
}