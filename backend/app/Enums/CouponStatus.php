<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Trạng thái mã giảm giá — cột coupons.status (§4.4).
 *
 * Inactive thì không áp được dù còn hạn và còn lượt (BR-20 điều kiện 1).
 */
enum CouponStatus: string
{
    use HasValues;

    case Active = 'active';
    case Inactive = 'inactive';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Đang bật',
            self::Inactive => 'Đã tắt',
        };
    }
}
