<?php

use App\Enums\ContentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 5: products — Sản phẩm trang phục gốc (§6.3).
 *
 * original_value và deposit_rate_percent là cơ sở tính tiền cọc (BR-11)
 * và tiền bồi thường khi mất / hỏng nặng (BR-31).
 *
 * Danh mục đặt RESTRICT: không cho xoá danh mục còn sản phẩm (BR-54).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('category_id');
            $table->unsignedInteger('brand_id')->nullable();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('thumbnail');
            $table->string('short_description', 500)->nullable();
            $table->longText('description')->nullable();
            $table->decimal('rental_price_per_day', 12, 2)->default(0);
            $table->integer('deposit_rate_percent')->default(70);
            $table->decimal('original_value', 12, 2)->default(0);
            $table->boolean('is_featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->enum('status', ContentStatus::values())->default(ContentStatus::Active->value);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->restrictOnDelete();
            $table->foreign('brand_id')->references('id')->on('brands')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
