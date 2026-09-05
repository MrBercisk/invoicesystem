<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use App\Support\Terbilang;

class Receipt extends Model {
    use SoftDeletes;

    protected $fillable = [
        'receipt_number', 'company_id', 'client_id', 'invoice_id',
        'receipt_date', 'amount', 'payment_method', 'payment_for',
        'notes', 'received_by_name', 'received_by_title',
        'requires_stamp_duty', 'status',
    ];

    protected $casts = [
        'receipt_date'         => 'date',
        'amount'               => 'float',
        'requires_stamp_duty'  => 'boolean',
    ];

    protected $appends = ['amount_in_words'];

    public function company(): BelongsTo {
        return $this->belongsTo(Company::class);
    }

    public function client(): BelongsTo {
        return $this->belongsTo(Client::class);
    }

    public function invoice(): BelongsTo {
        return $this->belongsTo(Invoice::class);
    }

    // Nomor kwitansi terpisah dari invoice, prefix KW
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

        return sprintf('KW/%s/%s/%s/%04d', $prefix, $year, $month, $last);
    }

    /**
     * Buat kwitansi langsung dari invoice yang sudah lunas.
     * Auto-fill payment_for, amount, client, company dari invoice.
     */
    public static function createFromInvoice(Invoice $invoice, array $overrides = []): self
    {
        $description = $invoice->installment_label
            ? "Pembayaran {$invoice->installment_label}"
            : "Pelunasan Invoice {$invoice->invoice_number}";

        if ($invoice->project_code) {
            $description .= " - Proyek {$invoice->project_code}";
        }

        $amount = $overrides['amount'] ?? $invoice->total;

        return static::create(array_merge([
            'receipt_number'       => static::generateNumber($invoice->company_id),
            'company_id'           => $invoice->company_id,
            'client_id'            => $invoice->client_id,
            'invoice_id'           => $invoice->id,
            'receipt_date'         => now()->toDateString(),
            'amount'               => $amount,
            'payment_method'       => 'transfer',
            'payment_for'          => $description,
            'received_by_name'     => $invoice->company->signature_name,
            'received_by_title'    => $invoice->company->signature_title,
            'requires_stamp_duty'  => $amount >= 5000000,
            'status'               => 'issued',
        ], $overrides));
    }

    public function getAmountInWordsAttribute(): string
    {
        return Terbilang::make((int) $this->amount) . ' rupiah';
    }

    public function pdfLink(string $template = 'minimalis', int $expiresInDays = 30): array
    {
        $existing = ReceiptPdfLink::where('receipt_id', $this->id)
            ->where('template', $template)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if ($existing) {
            return [
                'url' => URL::to('/kwt/' . $existing->token),
                'expires_at' => $existing->expires_at,
            ];
        }

        $token = Str::random(24);

        $link = ReceiptPdfLink::create([
            'token'      => $token,
            'receipt_id' => $this->id,
            'template'   => $template,
            'expires_at' => now()->addDays($expiresInDays),
        ]);

        return [
            'url' => URL::to('/kwt/' . $token),
            'expires_at' => $link->expires_at,
        ];
    }

    public function pdfUrl(string $template = 'minimalis', int $expiresInDays = 30): string
    {
        return $this->pdfLink($template, $expiresInDays)['url'];
    }
}