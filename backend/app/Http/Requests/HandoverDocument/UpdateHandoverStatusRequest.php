<?php

namespace App\Http\Requests\HandoverDocument;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHandoverStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:draft,completed,cancelled'],
        ];
    }
}