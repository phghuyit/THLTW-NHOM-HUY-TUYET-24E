<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Trạng thái thanh toán của đơn — cột orders.payment_status (§4.2).
 *
 * unpaid → partially_paid → paid → refunded
 */
enum PaymentStatus: string
{
    use HasValues;

    case Unpaid = 'unpaid';
    case PartiallyPaid = 'partially_paid';
    case Paid = 'paid';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Chưa thanh toán',
            self::PartiallyPaid => 'Thanh toán một phần',
            self::Paid => 'Đã thanh toán',
            self::Refunded => 'Đã hoàn cọc',
        };
    }
}
