<?php

namespace App\Models;

use App\Support\ItemLabels;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'business_type',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'npwp',
        'logo',
        'website',
        'signature',
        'signature_name',
        'signature_title',
        'stamp',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
    ];

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function handoverDocuments(): HasMany
    {
        return $this->hasMany(HandoverDocument::class);
    }

    protected function logo(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value
                ? Storage::disk('public')->url($value)
                : null,
        );
    }

    protected function signature(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value
                ? Storage::disk('public')->url($value)
                : null,
        );
    }

    protected function stamp(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value
                ? Storage::disk('public')->url($value)
                : null,
        );
    }

    /**
     * business_type yang aman ditampilkan, fallback ke default kalau
     * kosong/null (mis. data lama sebelum kolom ini ada).
     */
    protected function businessType(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ?: ItemLabels::DEFAULT_TYPE,
        );
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }
}