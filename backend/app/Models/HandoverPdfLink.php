<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HandoverPdfLink extends Model
{
    protected $fillable = [
        'token', 'handover_document_id', 'template', 'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function handoverDocument(): BelongsTo
    {
        return $this->belongsTo(HandoverDocument::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}