<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoicePdfLink extends Model
{
    protected $fillable = [
        'token', 'invoice_id', 'template', 'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}