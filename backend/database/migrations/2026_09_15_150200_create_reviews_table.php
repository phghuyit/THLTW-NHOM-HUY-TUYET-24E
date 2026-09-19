<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 22: reviews — Đánh giá & nhận xét sản phẩm (§6.3).
 *
 * CHECK rating 1..5 có sẵn trong file SQL gốc, giữ nguyên (BR-50).
 * Điều kiện "chỉ khách có đơn completed mới được đánh giá" và "mỗi cặp
 * user + product một lần" xử lý ở tầng nghiệp vụ tại Lô 8.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        DB::statement(
            'ALTER TABLE `reviews`
             ADD CONSTRAINT `reviews_rating_range`
             CHECK (`rating` BETWEEN 1 AND 5)'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
