<?php

namespace App\Models;

use App\Support\ItemLabels;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HandoverDocumentItem extends Model
{
    protected $appends = [
        'section_label',
        'name_column_label',
        'condition_label', 
        'has_condition',   
    ];
    protected $fillable = [
        'handover_document_id', 'type', 'name', 'description',
        'quantity', 'unit', 'condition', 'notes', 'sort_order',
        'metadata',
    ];

    protected $casts = [
        'quantity' => 'float',
        'metadata' => 'array',
    ];

    public function handoverDocument(): BelongsTo
    {
        return $this->belongsTo(HandoverDocument::class);
    }

    /**
     * Label section (mis. "Daftar Aset/Akses") sesuai business_type company
     * pemilik dokumen ini.
     */
    public function getSectionLabelAttribute(): string
    {
        return ItemLabels::section(
            $this->handoverDocument?->company?->business_type,
            $this->type
        );
    }

    /**
     * Label kolom nama (mis. "Nama Fitur") sesuai business_type.
     */
    public function getNameColumnLabelAttribute(): string
    {
        return ItemLabels::nameColumn(
            $this->handoverDocument?->company?->business_type,
            $this->type
        );
    }

    public function getConditionLabelAttribute(): ?string
    {
        return ItemLabels::conditionLabel(
            $this->handoverDocument?->company?->business_type,
            $this->type
        );
    }

    public function getHasConditionAttribute(): bool
    {
        return ItemLabels::hasCondition(
            $this->handoverDocument?->company?->business_type,
            $this->type
        );
    }


    /**
     * Ambil satu field dari metadata JSON dengan aman (null kalau tidak ada).
     * Contoh: $item->getMeta('expiry_date')
     */
    public function getMeta(string $key, mixed $default = null): mixed
    {
        return data_get($this->metadata, $key, $default);
    }
}