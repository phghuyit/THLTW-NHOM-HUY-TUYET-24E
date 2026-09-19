<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Vòng đời đơn thuê — cột orders.order_status (§4.1).
 *
 *   pending → confirmed → delivering → renting → returning → completed
 *   (pending / confirmed / delivering đều có thể → cancelled)
 *
 * Enum này giữ luôn bảng chuyển trạng thái hợp lệ và tác động tồn kho kèm theo,
 * để OrderStatusService là cửa duy nhất đổi trạng thái đơn — không nơi nào
 * được gán thẳng $order->order_status.
 */
enum OrderStatus: string
{
    use HasValues;

    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Delivering = 'delivering';
    case Renting = 'renting';
    case Returning = 'returning';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /** Tồn kho không đổi. */
    public const STOCK_NONE = 0;

    /** Trừ tồn kho khi giao đồ đi (BR-03). */
    public const STOCK_DEDUCT = -1;

    /** Cộng lại tồn kho khi đồ quay về (BR-03). */
    public const STOCK_RESTORE = 1;

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ xác nhận',
            self::Confirmed => 'Đã xác nhận',
            self::Delivering => 'Đang giao',
            self::Renting => 'Đang thuê',
            self::Returning => 'Đang trả đồ',
            self::Completed => 'Hoàn tất',
            self::Cancelled => 'Đã huỷ',
        };
    }

    /**
     * Các trạng thái được phép chuyển tới từ trạng thái hiện tại (§4.1).
     *
     * @return array<int, self>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Pending => [self::Confirmed, self::Cancelled],
            self::Confirmed => [self::Delivering, self::Cancelled],
            self::Delivering => [self::Renting, self::Cancelled],
            self::Renting => [self::Returning],
            self::Returning => [self::Completed],
            self::Completed, self::Cancelled => [],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions(), true);
    }

    /** Trạng thái kết thúc, không đi tiếp được nữa. */
    public function isFinal(): bool
    {
        return $this->allowedTransitions() === [];
    }

    /** Đơn đang giữ đồ của shop ở ngoài (đã trừ kho, chưa nhận lại). */
    public function holdsStock(): bool
    {
        return in_array($this, [self::Delivering, self::Renting, self::Returning], true);
    }

    /**
     * Tác động lên stock_quantity của một bước chuyển trạng thái (BR-03).
     *
     * Trả về STOCK_DEDUCT / STOCK_RESTORE / STOCK_NONE.
     */
    public static function stockEffect(self $from, self $to): int
    {
        return match (true) {
            // Giao đồ đi: trừ kho.
            $from === self::Confirmed && $to === self::Delivering => self::STOCK_DEDUCT,

            // Giao hỏng / khách từ chối nhận: trả đồ về kho.
            $from === self::Delivering && $to === self::Cancelled => self::STOCK_RESTORE,

            // Nhận lại đồ và quyết toán xong: nhập lại phần còn dùng được.
            $from === self::Returning && $to === self::Completed => self::STOCK_RESTORE,

            default => self::STOCK_NONE,
        };
    }
}
