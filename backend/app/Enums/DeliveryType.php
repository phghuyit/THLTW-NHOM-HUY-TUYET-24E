<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Hình thức nhận đồ — cột orders.delivery_type (§6.3 bảng 9).
 *
 * StorePickup thì shipping_fee = 0 và shipping_address được phép NULL (BR-12).
 */
enum DeliveryType: string
{
    use HasValues;

    case StorePickup = 'store_pickup';
    case Delivery = 'delivery';

    public function label(): string
    {
        return match ($this) {
            self::StorePickup => 'Đến shop lấy trực tiếp',
            self::Delivery => 'Giao hàng tận nơi',
        };
    }

    /** Hình thức này có bắt buộc nhập địa chỉ giao hàng không? */
    public function requiresAddress(): bool
    {
        return $this === self::Delivery;
    }
}
