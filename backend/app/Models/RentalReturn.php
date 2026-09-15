<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bảng 11: rental_returns — Biên bản kiểm tra & trả đồ.
 *
 * Bảng chỉ có created_at (theo file SQL).
 * Mỗi đơn đúng một biên bản, ràng buộc UNIQUE ở CSDL (BR-35).
 */
class RentalReturn extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'staff_id',
        'actual_return_date',
        'penalty_fee',
        'penalty_reason',
        'deposit_refund_amount',
        'return_note',
    ];

    /** Khớp DEFAULT của CSDL. */
    protected $attributes = [
        'penalty_fee' => 0,
    ];

    protected function casts(): array
    {
        return [
            'actual_return_date' => 'date',
            'penalty_fee' => 'decimal:2',
            'deposit_refund_amount' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** Tài khoản admin đã nhận và kiểm tra đồ. */
    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    /** Có phạt thì bắt buộc phải ghi lý do (BR-34). */
    public function hasPenalty(): bool
    {
        return (float) $this->penalty_fee > 0;
    }
}
