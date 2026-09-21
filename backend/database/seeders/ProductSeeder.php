<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryIds = DB::table('categories')
            ->whereIn('slug', ['ao-dai-truyen-thong', 'vay-du-tiec'])
            ->pluck('id', 'slug');

        if ($categoryIds->count() !== 2) {
            throw new RuntimeException('Hãy chạy CategorySeeder trước khi chạy ProductSeeder.');
        }

        $now = now();

        $products = [
            [
                'category_id' => $categoryIds['ao-dai-truyen-thong'],
                'brand_id' => null,
                'name' => 'Áo dài truyền thống hoa sen',
                'slug' => 'ao-dai-truyen-thong-hoa-sen',
                'thumbnail' => '/images/products/ao-dai-hoa-sen.jpg',
                'short_description' => 'Áo dài truyền thống thêu hoa sen, phù hợp lễ hội và sự kiện.',
                'description' => 'Thiết kế áo dài thanh lịch với họa tiết hoa sen, chất liệu mềm mại và thoải mái khi mặc.',
                'rental_price_per_day' => 350000,
                'deposit_rate_percent' => 70,
                'original_value' => 2500000,
                'is_featured' => true,
                'view_count' => 0,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryIds['vay-du-tiec'],
                'brand_id' => null,
                'name' => 'Váy dự tiệc đỏ sang trọng',
                'slug' => 'vay-du-tiec-do-sang-trong',
                'thumbnail' => '/images/products/vay-du-tiec-do.jpg',
                'short_description' => 'Váy dự tiệc màu đỏ nổi bật, phù hợp tiệc cưới và dạ hội.',
                'description' => 'Mẫu váy dáng dài thanh lịch, tôn dáng và phù hợp với các buổi tiệc trang trọng.',
                'rental_price_per_day' => 450000,
                'deposit_rate_percent' => 70,
                'original_value' => 3200000,
                'is_featured' => true,
                'view_count' => 0,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('products')->upsert(
            $products,
            ['slug'],
            [
                'category_id',
                'brand_id',
                'name',
                'thumbnail',
                'short_description',
                'description',
                'rental_price_per_day',
                'deposit_rate_percent',
                'original_value',
                'is_featured',
                'view_count',
                'status',
                'updated_at',
            ],
        );
    }
}
