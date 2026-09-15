<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Trạng thái tài khoản — cột users.status (§4.4).
 *
 * Tài khoản Locked không đăng nhập và không đặt đơn được.
 */
enum UserStatus: string
{
    use HasValues;

    case Active = 'active';
    case Locked = 'locked';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Đang hoạt động',
            self::Locked => 'Đã khoá',
        };
    }
}
