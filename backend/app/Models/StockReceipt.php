<?php

namespace App\Models;

use App\Enums\ReceiptType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Bảng 13: stock_receipts — Phiếu nhập / xuất kho.
 *
 * Bảng chỉ có created_at (theo file SQL).
 */
class StockReceipt extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'receipt_code',
        'user_id',
        'receipt_type',
        'reason',
        'total_amount',
    ];

    /** Khớp DEFAULT của CSDL. */
    protected $attributes = [
        'total_amount' => 0,
    ];

    protected function casts(): array
    {
        return [
            'receipt_type' => ReceiptType::class,
            'total_amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(StockReceiptDetail::class, 'receipt_id');
    }

    /** Chiều tác động lên tồn kho: nhập +1, xuất -1. */
    public function stockSign(): int
    {
        return $this->receipt_type->stockSign();
    }
}
