<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Chỉ seed duy nhất một tài khoản quản trị.
 *
 * Tài khoản khách hàng không seed sẵn — đăng ký qua API ở Lô 2 để đi đúng
 * luồng thật (hash mật khẩu, validate, gửi mail xác nhận).
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin123@gmail.com'],
            [
                'role' => UserRole::Admin,
                'fullname' => 'Quản Trị Viên',
                'password' => 'Admin123@',
                'phone' => '0901234567',
                'address' => '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
                'status' => UserStatus::Active,
            ],
        );
    }
}
