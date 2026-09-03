<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HandoverDocumentItem extends Model
{
    protected $fillable = [
        'handover_document_id', 'type', 'name', 'description',
        'quantity', 'unit', 'condition', 'notes', 'sort_order',
    ];

    protected $casts = [
        'quantity' => 'float',
    ];

    public function handoverDocument(): BelongsTo
    {
        return $this->belongsTo(HandoverDocument::class);
    }
}