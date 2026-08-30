<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                => 'sometimes|required|string|max:255',
            'email'               => 'nullable|email',
            'phone'               => 'nullable|string',
            'address'             => 'nullable|string',
            'city'                => 'nullable|string',
            'state'               => 'nullable|string',
            'postal_code'         => 'nullable|string',
            'country'             => 'nullable|string',
            'npwp'                => 'nullable|string',
            'bank_name'           => 'nullable|string',
            'bank_account_name'   => 'nullable|string',
            'bank_account_number' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama perusahaan wajib diisi.',
            'name.max'       => 'Nama perusahaan maksimal 255 karakter.',
            'email.email'    => 'Format email tidak valid.',
        ];
    }
}