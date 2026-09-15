<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Trạng thái xử lý liên hệ — cột contacts.status (§4.4).
 */
enum ContactStatus: string
{
    use HasValues;

    case Pending = 'pending';
    case Replied = 'replied';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ xử lý',
            self::Replied => 'Đã phản hồi',
        };
    }
}
