<?php

namespace App\Models;

use App\Enums\DeliveryType;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Bảng 9: orders — Đơn đặt thuê, bảng trung tâm của hệ thống.
 *
 * @property OrderStatus $order_status
 * @property PaymentStatus $payment_status
 */
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'user_id',
        'coupon_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_type',
        'shipping_address',
        'customer_note',
        'total_rental_fee',
        'total_deposit_fee',
        'discount_amount',
        'shipping_fee',
        'grand_total',
        'refunded_deposit',
        'payment_method',
        'payment_status',
        'order_status',
    ];

    /**
     * Giá trị mặc định ở tầng model, khớp với DEFAULT của CSDL.
     *
     * Cần thiết vì DEFAULT của CSDL chỉ áp lúc INSERT: nếu không khai báo ở đây
     * thì một Order vừa new() sẽ có order_status = NULL, và mọi lời gọi kiểu
     * $order->order_status->canTransitionTo(...) ở Lô 5 sẽ lỗi ngay.
     */
    protected $attributes = [
        'delivery_type' => DeliveryType::Delivery->value,
        'payment_method' => PaymentMethod::Cash->value,
        'payment_status' => PaymentStatus::Unpaid->value,
        'order_status' => OrderStatus::Pending->value,
        'total_rental_fee' => 0,
        'total_deposit_fee' => 0,
        'discount_amount' => 0,
        'shipping_fee' => 0,
        'grand_total' => 0,
        'refunded_deposit' => 0,
    ];

    protected function casts(): array
    {
        return [
            'total_rental_fee' => 'decimal:2',
            'total_deposit_fee' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'shipping_fee' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'refunded_deposit' => 'decimal:2',
            'delivery_type' => DeliveryType::class,
            'payment_method' => PaymentMethod::class,
            'payment_status' => PaymentStatus::class,
            'order_status' => OrderStatus::class,
        ];
    }

    /** Route model binding theo order_code thay vì id. */
    public function getRouteKeyName(): string
    {
        return 'order_code';
    }

    /* ---------------- Quan hệ ---------------- */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /** Mỗi đơn chỉ một biên bản trả đồ (BR-35). */
    public function rentalReturn(): HasOne
    {
        return $this->hasOne(RentalReturn::class);
    }

    /* ---------------- Tiện ích ---------------- */

    /** Hạn trả đồ của cả đơn = ngày trả muộn nhất trong các dòng. */
    public function dueDate(): ?string
    {
        return $this->items->max('rent_end_date');
    }

    /** Số ngày trễ so với hạn trả, tính tới hôm nay (BR-30). */
    public function overdueDays(): int
    {
        $due = $this->dueDate();

        if ($due === null || ! $this->order_status->holdsStock()) {
            return 0;
        }

        return max(0, now()->startOfDay()->diffInDays($due, false) * -1);
    }

    public function isOverdue(): bool
    {
        return $this->overdueDays() > 0;
    }

    /* ---------------- Scope ---------------- */

    public function scopeStatus(Builder $query, OrderStatus $status): Builder
    {
        return $query->where('order_status', $status);
    }

    /** Đơn đang thuê mà đã quá hạn trả. */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query
            ->where('order_status', OrderStatus::Renting)
            ->whereHas('items', fn (Builder $q) => $q->whereDate('rent_end_date', '<', now()));
    }
}
