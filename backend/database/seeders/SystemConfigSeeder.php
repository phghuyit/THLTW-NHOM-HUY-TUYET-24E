<?php

namespace Database\Seeders;

use App\Models\SystemConfig;
use Illuminate\Database\Seeder;

/**
 * 17 khoá cấu hình mặc định theo Phụ lục A của đặc tả.
 *
 * Mọi con số nghiệp vụ (phí ship, hệ số phạt trễ, giới hạn ngày thuê...)
 * đều nằm ở đây thay vì hardcode trong code.
 */
class SystemConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            // Thông tin cửa hàng
            ['site_name', 'Tiệm Thuê Đồ Xinh', 'Tên cửa hàng hiển thị trên header và email'],
            ['site_logo', '/uploads/logo.png', 'Đường dẫn logo'],
            ['site_phone', '0901234567', 'Hotline hiển thị ở header / footer'],
            ['site_email', 'lienhe@thuedoxinh.vn', 'Email liên hệ chính thức'],
            ['site_address', '123 Nguyễn Văn Cừ, Quận 5, TP.HCM', 'Địa chỉ cửa hàng, dùng cho hình thức đến shop lấy'],
            ['site_facebook', '', 'Link fanpage Facebook'],

            // Giao hàng
            ['shipping_fee_default', '50000', 'Phí giao hàng tận nơi (đồng)'],
            ['free_shipping_threshold', '2000000', 'Miễn phí giao khi tiền thuê vượt mức này (đồng)'],

            // Tiền cọc & phí phạt
            ['deposit_rate_default', '70', 'Tỷ lệ % cọc mặc định khi tạo sản phẩm mới'],
            ['late_fee_rate', '1.5', 'Hệ số phí trễ mỗi ngày (BR-30)'],
            ['special_cleaning_fee', '100000', 'Phí giặt đặc biệt gợi ý khi đồ bẩn nặng (đồng)'],

            // Giới hạn đặt thuê
            ['min_rental_days', '1', 'Số ngày thuê tối thiểu'],
            ['max_rental_days', '30', 'Số ngày thuê tối đa'],
            ['max_advance_days', '180', 'Cho phép đặt trước xa nhất bao nhiêu ngày'],

            // Vận hành
            ['unpaid_order_timeout_minutes', '30', 'Thời gian giữ đơn VNPay chưa thanh toán trước khi tự huỷ'],
            ['low_stock_threshold', '2', 'Ngưỡng cảnh báo sắp hết hàng'],
            ['password_reset_expire_minutes', '60', 'Hạn dùng token quên mật khẩu'],
        ];

        foreach ($configs as [$key, $value, $description]) {
            SystemConfig::query()->updateOrCreate(
                ['config_key' => $key],
                ['config_value' => $value, 'description' => $description],
            );
        }
    }
}
