<?php

use App\Enums\PostStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 16: posts — Bài viết & blog tin tức (§6.3).
 *
 * Chỉ status = published mới trả về ở API public (§4.4).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('category_id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('thumbnail')->nullable();
            $table->string('summary', 500)->nullable();
            $table->longText('content');
            $table->enum('status', PostStatus::values())->default(PostStatus::Published->value);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('post_categories')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
