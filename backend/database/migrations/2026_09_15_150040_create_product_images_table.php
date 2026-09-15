<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 6: product_images — Bộ sưu tập ảnh sản phẩm (§6.3).
 *
 * Không có timestamps: ảnh phụ thuộc hoàn toàn vào sản phẩm,
 * xoá sản phẩm là xoá theo (CASCADE).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('image_url');
            $table->integer('sort_order')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
