<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Phương thức / kênh thanh toán (BR-17).
 *
 * Dùng chung cho hai cột cùng tập giá trị:
 *   - orders.payment_method
 *   - payments.payment_gateway
 */
enum PaymentMethod: string
{
    use HasValues;

    case Cash = 'cash';
    case Vnpay = 'vnpay';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Tiền mặt',
            self::Vnpay => 'VNPay',
        };
    }

    /** Thanh toán online thì tiền phải vào trước khi shop xác nhận đơn. */
    public function isOnline(): bool
    {
        return $this === self::Vnpay;
    }
}
