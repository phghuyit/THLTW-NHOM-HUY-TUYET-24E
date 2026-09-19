<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentType;
use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bảng 12: payments — Lịch sử thu tiền và hoàn cọc.
 *
 * Bảng chỉ có created_at (theo file SQL).
 * transaction_id UNIQUE là chốt chặn idempotent cho IPN VNPay (BR-18).
 */
class Payment extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'transaction_id',
        'payment_gateway',
        'amount',
        'type',
        'status',
    ];

    /** Khớp DEFAULT của CSDL, để instance chưa lưu cũng có enum thay vì NULL. */
    protected $attributes = [
        'type' => PaymentType::Payment->value,
        'status' => TransactionStatus::Pending->value,
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_gateway' => PaymentMethod::class,
            'type' => PaymentType::class,
            'status' => TransactionStatus::class,
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /* ---------------- Scope ---------------- */

    public function scopeSuccessful(Builder $query): Builder
    {
        return $query->where('status', TransactionStatus::Success);
    }

    /** Tiền khách đã trả (không tính các khoản hoàn cọc). */
    public function scopeIncoming(Builder $query): Builder
    {
        return $query->where('type', PaymentType::Payment);
    }

    public function scopeRefunds(Builder $query): Builder
    {
        return $query->where('type', PaymentType::DepositRefund);
    }
}
