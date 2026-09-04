<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class HandoverDocument extends Model
{
    use SoftDeletes;
    protected $appends = ['warranty_expires_at', 'is_under_warranty'];

    protected $fillable = [
        'document_number', 'company_id', 'client_id', 'invoice_id',
        'document_date', 'location', 'status',
        'handover_by_name', 'handover_by_title',
        'received_by_name', 'received_by_title',
        'notes', 'terms', 'warranty_days',
    ];

    protected $casts = [
        'document_date' => 'date',
        'warranty_days' => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(HandoverDocumentItem::class)->orderBy('sort_order');
    }

    public static function generateNumber(int $companyId): string
    {
        $year = date('Y');
        $month = date('m');

        $company = Company::findOrFail($companyId);

        $prefix = strtoupper(substr(
            preg_replace('/[^A-Za-z]/', '', $company->name),
            0,
            3
        ));

        $last = static::where('company_id', $companyId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('BAST/%s/%s/%s/%04d', $prefix, $year, $month, $last);
    }

    /**
     * Tanggal berakhirnya garansi (document_date + warranty_days).
     * Null kalau tidak ada garansi (warranty_days null) atau document_date belum diisi.
     */
    public function getWarrantyExpiresAtAttribute(): ?Carbon
    {
        if (!$this->warranty_days || !$this->document_date) {
            return null;
        }

        return $this->document_date->copy()->addDays($this->warranty_days);
    }

    /**
     * Apakah garansi masih berlaku hari ini.
     */
    public function getIsUnderWarrantyAttribute(): bool
    {
        $expiresAt = $this->warranty_expires_at;

        return $expiresAt !== null && $expiresAt->isFuture();
    }

    public function pdfLink(string $template = 'minimalis', int $expiresInDays = 30): array
    {
        $existing = HandoverPdfLink::where('handover_document_id', $this->id)
            ->where('template', $template)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if ($existing) {
            return [
                'url' => URL::to('/doc/' . $existing->token),
                'expires_at' => $existing->expires_at,
            ];
        }

        $token = Str::random(24);

        $link = HandoverPdfLink::create([
            'token'                => $token,
            'handover_document_id' => $this->id,
            'template'             => $template,
            'expires_at'           => now()->addDays($expiresInDays),
        ]);

        return [
            'url' => URL::to('/doc/' . $token),
            'expires_at' => $link->expires_at,
        ];
    }
}