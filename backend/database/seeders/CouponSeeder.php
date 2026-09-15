<?php

namespace Database\Seeders;

use App\Enums\CouponStatus;
use App\Models\Coupon;
use Illuminate\Database\Seeder;

/**
 * Mã giảm giá mẫu, phủ đủ các nhánh kiểm tra của BR-20:
 * còn hiệu lực, đã hết hạn, hết lượt, đang tắt.
 */
class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'THUEHE50K',
                'description' => 'Giảm 50.000đ cho đơn thuê từ 300.000đ',
                'discount_amount' => 50000,
                'min_order_value' => 300000,
                'usage_limit' => 100,
                'used_count' => 12,
                'start_date' => now()->subDays(10),
                'end_date' => now()->addDays(30),
                'status' => CouponStatus::Active,
            ],
            [
                'code' => 'CUOI200K',
                'description' => 'Giảm 200.000đ cho đơn thuê từ 1.500.000đ',
                'discount_amount' => 200000,
                'min_order_value' => 1500000,
                'usage_limit' => 50,
                'used_count' => 3,
                'start_date' => now()->subDays(5),
                'end_date' => now()->addDays(60),
                'status' => CouponStatus::Active,
            ],
            [
                'code' => 'HETHAN100K',
                'description' => 'Mã đã hết hạn — dùng để thử nhánh từ chối',
                'discount_amount' => 100000,
                'min_order_value' => 500000,
                'usage_limit' => 100,
                'used_count' => 40,
                'start_date' => now()->subDays(60),
                'end_date' => now()->subDays(5),
                'status' => CouponStatus::Active,
            ],
            [
                'code' => 'HETLUOT30K',
                'description' => 'Mã đã dùng hết lượt — dùng để thử nhánh từ chối',
                'discount_amount' => 30000,
                'min_order_value' => 0,
                'usage_limit' => 10,
                'used_count' => 10,
                'start_date' => now()->subDays(3),
                'end_date' => now()->addDays(30),
                'status' => CouponStatus::Active,
            ],
            [
                'code' => 'DANGTAT80K',
                'description' => 'Mã đang tắt — dùng để thử nhánh từ chối',
                'discount_amount' => 80000,
                'min_order_value' => 0,
                'usage_limit' => 100,
                'used_count' => 0,
                'start_date' => now()->subDays(3),
                'end_date' => now()->addDays(30),
                'status' => CouponStatus::Inactive,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::query()->updateOrCreate(['code' => $coupon['code']], $coupon);
        }
    }
}
