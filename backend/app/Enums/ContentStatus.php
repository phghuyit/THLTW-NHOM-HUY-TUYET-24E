<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Trạng thái hiển thị dùng chung — cột status của categories, brands, products,
 * post_categories, pages, banners, menus (§4.4).
 *
 * Hidden thì không trả về ở API public.
 */
enum ContentStatus: string
{
    use HasValues;

    case Active = 'active';
    case Hidden = 'hidden';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Hiển thị',
            self::Hidden => 'Đang ẩn',
        };
    }
}
