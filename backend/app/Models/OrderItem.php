<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bảng 10: order_items — Chi tiết món đồ trong đơn thuê.
 *
 * Bảng không có cột timestamps (theo file SQL).
 * price_per_day / deposit_per_item là snapshot lúc đặt (BR-14).
 */
class OrderItem extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'product_variant_id',
        'quantity',
        'rent_start_date',
        'rent_end_date',
        'rental_days',
        'price_per_day',
        'deposit_per_item',
        'total_item_rental',
        'total_item_deposit',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'rent_start_date' => 'date',
            'rent_end_date' => 'date',
            'rental_days' => 'integer',
            'price_per_day' => 'decimal:2',
            'deposit_per_item' => 'decimal:2',
            'total_item_rental' => 'decimal:2',
            'total_item_deposit' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
