<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();
        $adminId = $admin?->id;

        $categories = [
            [
                'name' => 'Xu hướng thời trang',
                'slug' => 'xu-huong-thoi-trang',
                'description' => 'Cập nhật những xu hướng thời trang và phong cách hot nhất mùa này.',
                'status' => 'active',
            ],
            [
                'name' => 'Bí quyết phối đồ',
                'slug' => 'bi-quyet-phoi-do',
                'description' => 'Mẹo phối đồ dạ hội, công sở và chụp ảnh ngoại cảnh cực tôn dáng.',
                'status' => 'active',
            ],
            [
                'name' => 'Tin tức & Ưu đãi',
                'slug' => 'tin-tuc-uu-dai',
                'description' => 'Các sự kiện đặc biệt, cẩm nang dịch vụ và ưu đãi độc quyền tại StyleRent.',
                'status' => 'active',
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[$cat['slug']] = PostCategory::updateOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
        }

        $posts = [
            [
                'category_id' => $createdCategories['xu-huong-thoi-trang']->id,
                'user_id' => $adminId,
                'title' => 'Xu Hướng Thời Trang 2026: Tối Giản Nhưng Đầy Quyến Rũ',
                'slug' => 'xu-huong-thoi-trang-2026-toi-gian-quyen-ru',
                'thumbnail' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Khám phá các tông màu trung tính sang trọng và phom dáng cut-out tinh tế đang thống trị sàn diễn thời trang năm nay.',
                'content' => '<p>Thời trang năm 2026 chứng kiến sự trở lại mạnh mẽ của phong cách Quiet Luxury kết hợp cùng đường nét hiện đại. Những chiếc đầm lụa trơn, blazer dáng suông mềm mại hay chân váy xẻ tà tinh tế trở thành sự lựa chọn hàng đầu cho các quý cô khi tham dự sự kiện.</p><p>Tại StyleRent, chúng tôi luôn tuyển chọn những bộ sưu tập đón đầu xu hướng để bạn luôn tự tin tỏa sáng mà không cần đầu tư tủ đồ đắt đỏ.</p>',
                'is_hot' => true,
                'views' => 1420,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['bi-quyet-phoi-do']->id,
                'user_id' => $adminId,
                'title' => 'Top 5 Chiếc Đầm Dạ Hội Được Yêu Thích Nhất Mùa Tiệc Tùng',
                'slug' => 'top-5-chiec-dam-da-hoi-duoc-yeu-thich-nhat',
                'thumbnail' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Điểm danh 5 mẫu thiết kế dạ hội sang trọng, tôn dáng hoàn hảo giúp bạn trở thành tâm điểm của mọi ánh nhìn.',
                'content' => '<p>Chọn đầm dự tiệc luôn đòi hỏi sự cân nhắc kỹ lưỡng về vóc dáng và tính chất của bữa tiệc. Dưới đây là top 5 thiết kế dạ hội đắt khách nhất tại showroom StyleRent:</p><ul><li>Đầm dạ hội đuôi cá cúp ngực sang trọng</li><li>Đầm lụa satin lệch vai quý phái</li><li>Váy xòe công chúa đính kết pha lê</li><li>Set vest dạ hội cách điệu cá tính</li><li>Đầm đen body cổ yếm thanh lịch</li></ul>',
                'is_hot' => true,
                'views' => 2680,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['bi-quyet-phoi-do']->id,
                'user_id' => $adminId,
                'title' => 'Kinh Nghiệm Thuê Đồ Dự Tiệc: Đẹp Chuẩn Gu, Tiết Kiệm Đến 80%',
                'slug' => 'kinh-nghiem-thue-do-du-tiec-tiet-kiem-chi-phi',
                'thumbnail' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Bí quyết chọn size chuẩn xác, bảo quản trang phục thuê và lên kế hoạch đặt lịch trước ngày tiệc.',
                'content' => '<p>Thuê đồ sự kiện ngày nay đã trở thành phong cách sống hiện đại và thông minh của giới trẻ. Bạn có thể xuất hiện trong một chiếc đầm hàng hiệu giá 20 triệu chỉ với chi phí thuê vài trăm nghìn đồng. Hãy lưu ý chọn size dựa trên bảng số đo 3 vòng và đặt đồ trước ngày tiệc 1-2 ngày để thử đồ vừa vặn nhất.</p>',
                'is_hot' => false,
                'views' => 950,
                'status' => 'published',
            ],
            [
                'category_id' => $createdCategories['tin-tuc-uu-dai']->id,
                'user_id' => $adminId,
                'title' => 'StyleRent Ra Mắt Gói Thuê Đồng Hành Cho Mùa Kỷ Yếu & Sự Kiện',
                'slug' => 'stylerent-ra-mat-goi-thue-dong-hanh-ky-yeu',
                'thumbnail' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
                'summary' => 'Ưu đãi nhóm lên đến 25% kèm dịch vụ miễn phí giặt là và giao nhận tận nơi cho các bạn sinh viên.',
                'content' => '<p>Đồng hành cùng các bạn học sinh - sinh viên trong các dịp prom, kỷ yếu và thuyết trình tốt nghiệp, StyleRent chính thức triển khai chương trình ưu đãi đặc biệt: Giảm 20% khi thuê từ 3 bộ và tặng voucher phụ kiện đi kèm.</p>',
                'is_hot' => true,
                'views' => 1890,
                'status' => 'published',
            ],
        ];

        foreach ($posts as $post) {
            Post::updateOrCreate(
                ['slug' => $post['slug']],
                $post
            );
        }
    }
}
