<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 21: system_configs — Cấu hình website động (§6.3, Phụ lục A).
 *
 * Dạng key-value để admin sửa tên shop, hotline, phí ship, hệ số phạt trễ...
 * qua form mà không phải sửa code.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_configs', function (Blueprint $table) {
            $table->increments('id');
            $table->string('config_key', 50)->unique();
            $table->text('config_value')->nullable();
            $table->string('description')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_configs');
    }
};
