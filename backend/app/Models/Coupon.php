<?php

namespace App\Models;

use App\Enums\CouponStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Bảng 8: coupons — Mã giảm giá theo số tiền cố định.
 *
 * Bảng chỉ có created_at, không có updated_at (theo file SQL).
 */
class Coupon extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'code',
        'description',
        'discount_amount',
        'min_order_value',
        'usage_limit',
        'used_count',
        'start_date',
        'end_date',
        'status',
    ];

    /** Khớp DEFAULT của CSDL, để instance chưa lưu cũng có enum thay vì NULL. */
    protected $attributes = [
        'status' => CouponStatus::Active->value,
        'min_order_value' => 0,
        'usage_limit' => 100,
        'used_count' => 0,
    ];

    protected function casts(): array
    {
        return [
            'discount_amount' => 'decimal:2',
            'min_order_value' => 'decimal:2',
            'usage_limit' => 'integer',
            'used_count' => 'integer',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'status' => CouponStatus::class,
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /* ---------------- Tiện ích ---------------- */

    public function isActive(): bool
    {
        return $this->status === CouponStatus::Active;
    }

    public function isWithinPeriod(): bool
    {
        return now()->between($this->start_date, $this->end_date);
    }

    public function hasRemainingUses(): bool
    {
        return $this->used_count < $this->usage_limit;
    }

    /** Số lượt còn lại, không âm. */
    public function remainingUses(): int
    {
        return max(0, $this->usage_limit - $this->used_count);
    }

    /* ---------------- Scope ---------------- */

    /** Mã còn dùng được về mặt trạng thái / thời hạn / lượt (3 trong 4 điều kiện BR-20). */
    public function scopeUsable(Builder $query): Builder
    {
        return $query
            ->where('status', CouponStatus::Active)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereColumn('used_count', '<', 'usage_limit');
    }
}
