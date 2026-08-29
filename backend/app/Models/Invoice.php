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
    public static function generateNumber(): string {
        $prefix = 'INV';
        $year   = date('Y');
        $month  = date('m');
        $last   = static::whereYear('created_at', $year)
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
}
