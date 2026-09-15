<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Vai trò tài khoản — cột users.role (§2.1).
 *
 * Hệ thống chỉ có 2 vai trò cố định nên kiểm tra quyền trực tiếp trên cột này,
 * không dùng bảng role trung gian.
 */
enum UserRole: string
{
    use HasValues;

    case Admin = 'admin';
    case Member = 'member';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Quản trị viên',
            self::Member => 'Khách hàng',
        };
    }
}
