<?php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
 
class Company extends Model {
    use SoftDeletes;
 
    protected $fillable = [
        'name', 'email', 'phone', 'address', 'city', 'state',
        'postal_code', 'country', 'npwp', 'logo', 'website',
        'bank_name', 'bank_account_name', 'bank_account_number',
    ];
 
    public function invoices(): HasMany {
        return $this->hasMany(Invoice::class);
    }
}
