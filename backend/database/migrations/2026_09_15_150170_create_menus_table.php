<?php

use App\Enums\ContentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 19: menus — Thanh điều hướng header / footer (§6.3).
 *
 * parent_id tự tham chiếu cho menu dropdown đa cấp; xoá menu cha thì
 * xoá luôn menu con (CASCADE) vì menu con không đứng riêng được (BR-53).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->string('link');
            $table->unsignedInteger('parent_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->enum('position', ['header', 'footer'])->default('header');
            $table->enum('status', ContentStatus::values())->default(ContentStatus::Active->value);

            $table->foreign('parent_id')->references('id')->on('menus')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
