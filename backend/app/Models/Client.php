<?php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
 
class Client extends Model {
    use SoftDeletes;
 
    protected $fillable = [
        'name', 'email', 'phone', 'address', 'city',
        'country', 'npwp', 'pic_name',
    ];
 
    public function invoices(): HasMany {
        return $this->hasMany(Invoice::class);
    }
}
 
