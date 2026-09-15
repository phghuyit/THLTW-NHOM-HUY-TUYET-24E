<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 10: order_items — Chi tiết món đồ trong đơn thuê (§6.3).
 *
 * price_per_day và deposit_per_item là SNAPSHOT tại thời điểm đặt (BR-14):
 * shop đổi bảng giá sau này thì đơn cũ không bị lệch.
 *
 * rental_days tính bao gồm cả ngày đầu và ngày cuối (BR-10).
 * Biến thể đặt RESTRICT: không xoá được biến thể đã từng có người thuê.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained()->restrictOnDelete();
            $table->integer('quantity')->default(1);
            $table->date('rent_start_date');
            $table->date('rent_end_date');
            $table->integer('rental_days');
            $table->decimal('price_per_day', 12, 2);
            $table->decimal('deposit_per_item', 12, 2);
            $table->decimal('total_item_rental', 12, 2);
            $table->decimal('total_item_deposit', 12, 2);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
