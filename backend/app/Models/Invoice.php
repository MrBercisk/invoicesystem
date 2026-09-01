<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model {
    use SoftDeletes;

    protected $fillable = [
        'invoice_number', 'company_id', 'client_id',
        'invoice_date', 'due_date', 'status',
        'subtotal', 'tax_rate', 'tax_amount', 'discount', 'total',
        'notes', 'terms',
        'project_code', 'installment_label',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date'     => 'date',
        'subtotal'     => 'float',
        'tax_rate'     => 'float',
        'tax_amount'   => 'float',
        'discount'     => 'float',
        'total'        => 'float',
    ];

    public function company(): BelongsTo {
        return $this->belongsTo(Company::class);
    }

    public function client(): BelongsTo {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany {
        return $this->hasMany(InvoiceItem::class);
    }

    // Auto-generate invoice number
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

        return sprintf('%s/%s/%s/%04d', $prefix, $year, $month, $last);
    }
    // Recalculate totals from items
    public function recalculate(): void {
        $subtotal         = $this->items->sum('total');
        $tax_amount       = $subtotal * ($this->tax_rate / 100);
        $this->subtotal   = $subtotal;
        $this->tax_amount = $tax_amount;
        $this->total      = $subtotal + $tax_amount - $this->discount;
        $this->save();
    }

    /**
     * Invoice lain yang satu proyek (mis. termin DP & pelunasan).
     */
    public function siblingInvoices()
    {
        if (!$this->project_code) {
            return static::query()->whereRaw('1 = 0'); // query kosong, aman untuk ->get()/->sum()
        }
        return static::where('project_code', $this->project_code)
                      ->where('id', '!=', $this->id);
    }

    /**
     * Total nilai seluruh proyek (semua termin dijumlah, termasuk invoice ini).
     */
    public function getProjectTotalAttribute(): float {
        if (!$this->project_code) {
            return $this->total;
        }
        return $this->total + $this->siblingInvoices()->sum('total');
    }

    /**
     * Sudah dibayar dari termin LAIN yang statusnya paid (tidak termasuk invoice ini sendiri).
     */
    public function getAlreadyPaidAttribute(): float {
        if (!$this->project_code) {
            return 0;
        }
        return $this->siblingInvoices()->where('status', 'paid')->sum('total');
    }

    /**
     * Sisa yang belum tertagih dari seluruh proyek, dihitung setelah invoice ini juga lunas.
     */
    public function getRemainingAttribute(): float {
        $paidIncludingSelf = $this->already_paid + ($this->status === 'paid' ? $this->total : 0);
        return $this->project_total - $paidIncludingSelf;
    }
}