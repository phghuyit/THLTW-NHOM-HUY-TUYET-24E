<?php

use App\Enums\ContentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 18: banners — Banner & slider quảng cáo (§6.3).
 *
 * position là chuỗi tự do (home_main_slider, footer_banner...) để thêm vị trí
 * mới không phải sửa schema.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 100)->nullable();
            $table->string('image_url');
            $table->string('link_url')->nullable();
            $table->string('position', 50)->default('home_main_slider');
            $table->integer('sort_order')->default(0);
            $table->enum('status', ContentStatus::values())->default(ContentStatus::Active->value);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
