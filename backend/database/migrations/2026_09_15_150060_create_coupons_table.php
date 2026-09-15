<?php

use App\Enums\CouponStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 8: coupons — Mã giảm giá trực tiếp theo số tiền cố định (§6.3).
 *
 * min_order_value so với total_rental_fee, KHÔNG so với grand_total (BR-13).
 * used_count tăng bằng câu lệnh nguyên tử có điều kiện (BR-23).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 50)->unique();
            $table->string('description')->nullable();
            $table->decimal('discount_amount', 12, 2);
            $table->decimal('min_order_value', 12, 2)->default(0);
            $table->integer('usage_limit')->default(100);
            $table->integer('used_count')->default(0);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->enum('status', CouponStatus::values())->default(CouponStatus::Active->value);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
