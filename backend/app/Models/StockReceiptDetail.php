<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bảng 14: stock_receipt_details — Chi tiết từng biến thể trong phiếu kho.
 *
 * Bảng không có cột timestamps (theo file SQL).
 */
class StockReceiptDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'receipt_id',
        'product_variant_id',
        'quantity',
        'unit_price',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
        ];
    }

    public function receipt(): BelongsTo
    {
        return $this->belongsTo(StockReceipt::class, 'receipt_id');
    }

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /** Thành tiền của dòng phiếu. */
    protected function lineTotal(): Attribute
    {
        return Attribute::get(
            fn (): float => round($this->quantity * (float) $this->unit_price, 2)
        );
    }
}
