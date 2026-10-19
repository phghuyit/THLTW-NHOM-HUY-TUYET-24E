<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;



class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_code',
        'user_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
