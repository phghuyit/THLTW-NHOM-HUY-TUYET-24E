<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Danh mục, thương hiệu, sản phẩm + biến thể + ảnh.
 *
 * Dữ liệu mẫu bám sát đề tài: váy dạ hội, áo dài, vest, cosplay.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        /* ---------- Danh mục ---------- */
        $categories = [];
        foreach ([
            'Váy Dạ Hội & Dự Tiệc' => 'Đầm dạ hội, đầm dự tiệc cao cấp cho sự kiện trang trọng.',
            'Áo Dài' => 'Áo dài truyền thống và cách tân cho cưới hỏi, lễ Tết.',
            'Vest & Suit Nam' => 'Vest, suit nam cho chú rể, dự tiệc, sự kiện công sở.',
            'Trang Phục Cosplay' => 'Trang phục hoá trang, cosplay nhân vật, lễ hội.',
        ] as $name => $description) {
            $categories[$name] = Category::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'description' => $description],
            );
        }

        // Một danh mục con để minh hoạ quan hệ cha - con.
        Category::query()->updateOrCreate(
            ['slug' => Str::slug('Áo Dài Cưới')],
            [
                'name' => 'Áo Dài Cưới',
                'parent_id' => $categories['Áo Dài']->id,
                'description' => 'Áo dài cô dâu chú rể, áo dài bưng quả.',
            ],
        );

        /* ---------- Thương hiệu ---------- */
        $brands = [];
        foreach ([
            'Tiệm May ABC' => 'Xưởng may áo dài thủ công tại TP.HCM.',
            'Elegant Studio' => 'Thương hiệu đầm dạ hội thiết kế.',
            'Gentleman House' => 'Vest và suit nam cao cấp.',
        ] as $name => $description) {
            $brands[$name] = Brand::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'description' => $description],
            );
        }

        /* ---------- Sản phẩm ---------- */
        $products = [
            [
                'name' => 'Áo Dài Cách Tân Đỏ Thêu Sen',
                'category' => 'Áo Dài',
                'brand' => 'Tiệm May ABC',
                'price' => 350000,
                'value' => 2000000,
                'deposit' => 70,
                'featured' => true,
                'short' => 'Áo dài lụa tơ tằm thêu tay hoạ tiết sen, form dáng cách tân trẻ trung.',
                'variants' => [
                    ['AD-CT-DO-S', 'S', 'Đỏ Ruby', '99% New', 5],
                    ['AD-CT-DO-M', 'M', 'Đỏ Ruby', '99% New', 3],
                    ['AD-CT-DO-L', 'L', 'Đỏ Ruby', '98% New', 0],
                ],
            ],
            [
                'name' => 'Váy Dạ Hội Đính Đá Cúp Ngực',
                'category' => 'Váy Dạ Hội & Dự Tiệc',
                'brand' => 'Elegant Studio',
                'price' => 500000,
                'value' => 4500000,
                'deposit' => 70,
                'featured' => true,
                'short' => 'Đầm dạ hội cúp ngực đính đá thủ công, chân váy xoè tùng lưới.',
                'variants' => [
                    ['VAY-DH-TR-S', 'S', 'Trắng Kem', 'Mới 100%', 4],
                    ['VAY-DH-TR-M', 'M', 'Trắng Kem', 'Mới 100%', 8],
                    ['VAY-DH-DO-M', 'M', 'Đỏ Đô', '99% New', 2],
                ],
            ],
            [
                'name' => 'Vest Nam Đen Ôm Body',
                'category' => 'Vest & Suit Nam',
                'brand' => 'Gentleman House',
                'price' => 250000,
                'value' => 3000000,
                'deposit' => 70,
                'featured' => false,
                'short' => 'Vest nam hai khuy, form ôm body, kèm quần tây đồng bộ.',
                'variants' => [
                    ['VS-DEN-M', 'M', 'Đen Tuyền', '99% New', 6],
                    ['VS-DEN-L', 'L', 'Đen Tuyền', '99% New', 1],
                    ['VS-XAM-L', 'L', 'Xám Khói', '98% New', 3],
                ],
            ],
            [
                'name' => 'Trang Phục Cosplay Chiến Binh',
                'category' => 'Trang Phục Cosplay',
                'brand' => null,
                'price' => 180000,
                'value' => 1200000,
                'deposit' => 60,
                'featured' => false,
                'short' => 'Bộ cosplay chiến binh kèm phụ kiện áo giáp, phù hợp lễ hội Halloween.',
                'variants' => [
                    ['COS-CB-FREE', 'FreeSize', 'Bạc', '95% New', 7],
                ],
            ],
        ];

        foreach ($products as $data) {
            $slug = Str::slug($data['name']);

            $product = Product::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $categories[$data['category']]->id,
                    'brand_id' => $data['brand'] ? $brands[$data['brand']]->id : null,
                    'name' => $data['name'],
                    'thumbnail' => "/uploads/products/{$slug}.jpg",
                    'short_description' => $data['short'],
                    'description' => '<p>'.$data['short'].'</p><p>Vui lòng tham khảo bảng size trước khi đặt thuê. Đồ được giặt hấp sạch sẽ trước mỗi lượt cho thuê.</p>',
                    'rental_price_per_day' => $data['price'],
                    'deposit_rate_percent' => $data['deposit'],
                    'original_value' => $data['value'],
                    'is_featured' => $data['featured'],
                ],
            );

            foreach ($data['variants'] as [$sku, $size, $color, $condition, $stock]) {
                ProductVariant::query()->updateOrCreate(
                    ['sku' => $sku],
                    [
                        'product_id' => $product->id,
                        'size' => $size,
                        'color' => $color,
                        'condition_note' => $condition,
                        'stock_quantity' => $stock,
                    ],
                );
            }

            foreach (range(1, 3) as $i) {
                ProductImage::query()->updateOrCreate(
                    ['product_id' => $product->id, 'image_url' => "/uploads/products/{$slug}-{$i}.jpg"],
                    ['sort_order' => $i],
                );
            }
        }
    }
}
