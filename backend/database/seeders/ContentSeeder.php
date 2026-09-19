<?php

namespace Database\Seeders;

use App\Enums\PostStatus;
use App\Models\Banner;
use App\Models\Menu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Nội dung website: menu, banner, trang tĩnh, chủ đề và bài viết.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        /* ---------- Menu header ---------- */
        $header = [
            ['Trang chủ', '/', 1],
            ['Sản phẩm', '/products', 2],
            ['Bảng giá & Chính sách', '/pages/chinh-sach-thue-hoan-coc', 3],
            ['Cẩm nang', '/posts', 4],
            ['Liên hệ', '/contact', 5],
        ];

        foreach ($header as [$name, $link, $order]) {
            Menu::query()->updateOrCreate(
                ['name' => $name, 'position' => 'header'],
                ['link' => $link, 'sort_order' => $order],
            );
        }

        $products = Menu::query()->where('name', 'Sản phẩm')->where('position', 'header')->first();

        foreach ([
            ['Váy Dạ Hội', '/products?category=vay-da-hoi-du-tiec', 1],
            ['Áo Dài', '/products?category=ao-dai', 2],
            ['Vest & Suit', '/products?category=vest-suit-nam', 3],
        ] as [$name, $link, $order]) {
            Menu::query()->updateOrCreate(
                ['name' => $name, 'position' => 'header'],
                ['link' => $link, 'parent_id' => $products?->id, 'sort_order' => $order],
            );
        }

        /* ---------- Menu footer ---------- */
        foreach ([
            ['Giới thiệu', '/pages/gioi-thieu', 1],
            ['Chính sách thuê & hoàn cọc', '/pages/chinh-sach-thue-hoan-coc', 2],
            ['Hướng dẫn chọn size', '/pages/huong-dan-chon-size', 3],
        ] as [$name, $link, $order]) {
            Menu::query()->updateOrCreate(
                ['name' => $name, 'position' => 'footer'],
                ['link' => $link, 'sort_order' => $order],
            );
        }

        /* ---------- Banner ---------- */
        foreach ([
            ['Mùa cưới 2026 — Giảm đến 200.000đ', '/uploads/banners/mua-cuoi.jpg', '/products?category=ao-dai', 'home_main_slider', 1],
            ['Bộ sưu tập dạ hội mới', '/uploads/banners/da-hoi.jpg', '/products?category=vay-da-hoi-du-tiec', 'home_main_slider', 2],
            ['Miễn phí giao hàng đơn từ 2 triệu', '/uploads/banners/freeship.jpg', null, 'home_sub_banner', 1],
        ] as [$title, $image, $link, $position, $order]) {
            Banner::query()->updateOrCreate(
                ['image_url' => $image],
                ['title' => $title, 'link_url' => $link, 'position' => $position, 'sort_order' => $order],
            );
        }

        /* ---------- Trang tĩnh ---------- */
        $pages = [
            [
                'Giới Thiệu',
                '<p>Tiệm Thuê Đồ Xinh cung cấp dịch vụ cho thuê trang phục dạ hội, áo dài, vest và cosplay tại TP.HCM.</p>',
            ],
            [
                'Chính Sách Thuê & Hoàn Cọc',
                '<h3>Tiền cọc</h3><p>Tiền cọc bằng 70% giá trị bộ đồ, được hoàn lại đầy đủ khi khách trả đồ đúng hạn và nguyên vẹn.</p>'
                .'<h3>Phí trễ hạn</h3><p>Mỗi ngày trả trễ tính phí bằng 1,5 lần giá thuê ngày, trừ trực tiếp vào tiền cọc.</p>'
                .'<h3>Hư hỏng</h3><p>Đồ hư hỏng nhẹ tính 10–30% giá trị; hư hỏng nặng hoặc mất tính 100% giá trị bộ đồ.</p>',
            ],
            [
                'Hướng Dẫn Chọn Size',
                '<p>Vui lòng đo vòng ngực, vòng eo, vòng hông và chiều cao trước khi chọn size. Liên hệ hotline nếu cần tư vấn thêm.</p>',
            ],
        ];

        foreach ($pages as [$title, $content]) {
            Page::query()->updateOrCreate(
                ['slug' => Str::slug($title)],
                ['title' => $title, 'content' => $content],
            );
        }

        /* ---------- Chủ đề & bài viết ---------- */
        $postCategories = [];
        foreach (['Kinh Nghiệm Phối Đồ', 'Cẩm Nang Chụp Ảnh', 'Tin Tức & Sự Kiện'] as $name) {
            $postCategories[$name] = PostCategory::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name],
            );
        }

        $posts = [
            ['5 cách phối áo dài cách tân cho ngày Tết', 'Kinh Nghiệm Phối Đồ', 'Gợi ý phối áo dài cách tân với phụ kiện tối giản mà vẫn nổi bật.'],
            ['Chọn váy dạ hội theo dáng người', 'Kinh Nghiệm Phối Đồ', 'Dáng quả lê, đồng hồ cát hay chữ nhật đều có kiểu váy phù hợp riêng.'],
            ['Kinh nghiệm chụp ảnh cưới với áo dài thuê', 'Cẩm Nang Chụp Ảnh', 'Lưu ý về thời gian thuê, bảo quản và di chuyển khi chụp ngoại cảnh.'],
        ];

        foreach ($posts as [$title, $category, $summary]) {
            Post::query()->updateOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'category_id' => $postCategories[$category]->id,
                    'title' => $title,
                    'thumbnail' => '/uploads/posts/'.Str::slug($title).'.jpg',
                    'summary' => $summary,
                    'content' => '<p>'.$summary.'</p><p>Nội dung chi tiết đang được cập nhật.</p>',
                    'status' => PostStatus::Published,
                ],
            );
        }
    }
}
