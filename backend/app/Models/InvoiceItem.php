<?php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
 
class InvoiceItem extends Model {
    protected $fillable = [
        'invoice_id', 'product_id', 'name', 'description',
        'quantity', 'unit', 'price', 'total',
    ];
 
    protected $casts = [
        'quantity' => 'float',
        'price'    => 'float',
        'total'    => 'float',
    ];
 
    public function invoice(): BelongsTo {
        return $this->belongsTo(Invoice::class);
    }
 
    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }
}
