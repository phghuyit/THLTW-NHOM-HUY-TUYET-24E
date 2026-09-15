<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Chiều của dòng tiền — cột payments.type (§6.3 bảng 12).
 *
 * Payment: thu tiền của khách.
 * DepositRefund: chi tiền cọc trả lại cho khách sau khi quyết toán (BR-32).
 */
enum PaymentType: string
{
    use HasValues;

    case Payment = 'payment';
    case DepositRefund = 'deposit_refund';

    public function label(): string
    {
        return match ($this) {
            self::Payment => 'Thu tiền khách',
            self::DepositRefund => 'Hoàn cọc cho khách',
        };
    }

    /** Dấu của giao dịch khi cộng dồn sổ quỹ: thu (+1) hay chi (-1). */
    public function sign(): int
    {
        return $this === self::Payment ? 1 : -1;
    }
}
