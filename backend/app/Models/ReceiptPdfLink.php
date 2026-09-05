<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReceiptPdfLink extends Model
{
    protected $fillable = [
        'token', 'receipt_id', 'template', 'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function receipt(): BelongsTo
    {
        return $this->belongsTo(Receipt::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}