<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Trạng thái bài viết — cột posts.status (§4.4).
 *
 * Chỉ Published mới hiển thị ra ngoài.
 */
enum PostStatus: string
{
    use HasValues;

    case Published = 'published';
    case Draft = 'draft';
    case Hidden = 'hidden';

    public function label(): string
    {
        return match ($this) {
            self::Published => 'Đã đăng',
            self::Draft => 'Bản nháp',
            self::Hidden => 'Đang ẩn',
        };
    }
}
