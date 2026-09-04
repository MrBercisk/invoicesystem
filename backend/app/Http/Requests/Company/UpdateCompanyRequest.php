<?php

namespace App\Http\Requests\Company;

use App\Support\ItemLabels;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'business_type' => ['nullable', 'string', Rule::in(ItemLabels::available())],
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'npwp' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',

            // Logo (sebelumnya hilang di sini — bug: upload logo saat update
            // tidak tervalidasi sama sekali, padahal controller memprosesnya)
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            // Signature
            'signature' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'signature_name' => 'nullable|string|max:255',
            'signature_title' => 'nullable|string|max:255',

            // Stamp
            'stamp' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            // Bank
            'bank_name' => 'nullable|string|max:255',
            'bank_account_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama perusahaan wajib diisi.',
            'name.max' => 'Nama perusahaan maksimal 255 karakter.',
            'business_type.in' => 'Jenis bisnis tidak valid.',

            'email.email' => 'Format email tidak valid.',

            'website.url' => 'Format website tidak valid.',

            'logo.image' => 'File logo harus berupa gambar.',
            'logo.mimes' => 'Logo harus berformat JPG, JPEG, PNG, atau WebP.',
            'logo.max' => 'Ukuran logo maksimal 5 MB.',

            'signature.image' => 'File tanda tangan harus berupa gambar.',
            'signature.mimes' => 'Tanda tangan harus berformat JPG, JPEG, PNG, atau WebP.',
            'signature.max' => 'Ukuran tanda tangan maksimal 5 MB.',

            'stamp.image' => 'File stempel harus berupa gambar.',
            'stamp.mimes' => 'Stempel harus berformat JPG, JPEG, PNG, atau WebP.',
            'stamp.max' => 'Ukuran stempel maksimal 5 MB.',
        ];
    }
}