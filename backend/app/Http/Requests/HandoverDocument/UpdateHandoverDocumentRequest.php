<?php

namespace App\Http\Requests\HandoverDocument;

use App\Support\ItemLabels;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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

            'warranty_days' => ['nullable', 'integer', 'min:0', 'max:65535'],

            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.type' => ['required_with:items', Rule::in(ItemLabels::availableItemTypes())],
            'items.*.name' => ['required_with:items', 'string', 'max:255'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity' => ['required_with:items', 'numeric', 'min:0.01'],
            'items.*.unit' => ['nullable', 'string', 'max:50'],
            'items.*.condition' => ['nullable', 'string', 'max:100'],
            'items.*.notes' => ['nullable', 'string'],

            'items.*.metadata' => ['nullable', 'array'],
            'items.*.metadata.*' => ['nullable', 'metadata_scalar', 'metadata_scalar_maxlen'],
        ];
    }

    public function messages(): array
    {
        return [
            'warranty_days.integer' => 'Jumlah hari garansi harus berupa angka.',
            'warranty_days.min' => 'Jumlah hari garansi tidak boleh negatif.',
            'warranty_days.max' => 'Jumlah hari garansi maksimal 65535 hari.',

            'items.*.metadata.array' => 'Format data tambahan item tidak valid.',
            'items.*.metadata.*.metadata_scalar' => 'Nilai data tambahan harus berupa teks, angka, atau boolean (tidak boleh berupa daftar/objek bersarang).',
        ];
    }
}