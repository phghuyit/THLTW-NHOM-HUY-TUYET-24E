<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Thứ tự seed phải tôn trọng khoá ngoại:
 * cấu hình → tài khoản → catalog → khuyến mãi → nội dung.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SystemConfigSeeder::class,
            UserSeeder::class,
            CatalogSeeder::class,
            CouponSeeder::class,
            ContentSeeder::class,
        ]);
    }
}
