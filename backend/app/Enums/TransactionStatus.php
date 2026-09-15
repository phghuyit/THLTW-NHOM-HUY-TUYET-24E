<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Trạng thái một giao dịch — cột payments.status (§4.3).
 *
 * pending → success | failed
 */
enum TransactionStatus: string
{
    use HasValues;

    case Pending = 'pending';
    case Success = 'success';
    case Failed = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Đang chờ',
            self::Success => 'Thành công',
            self::Failed => 'Thất bại',
        };
    }
}
