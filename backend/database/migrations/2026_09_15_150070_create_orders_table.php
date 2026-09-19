<?php

use App\Enums\DeliveryType;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 9: orders — Đơn đặt thuê trang phục (§6.3).
 *
 * user_id NOT NULL: bắt buộc đăng nhập mới thuê được (§2.2).
 * RESTRICT trên user và RESTRICT ngầm qua coupon SET NULL để đơn cũ luôn
 * tra cứu được người thuê.
 *
 * Ba index bổ sung ngoài file SQL gốc, phục vụ màn hình danh sách đơn
 * của khách và của admin (§6.3 bảng 9).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 30)->unique();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('coupon_id')->nullable();

            $table->string('customer_name', 100);
            $table->string('customer_phone', 20);
            $table->string('customer_email', 100)->nullable();

            $table->enum('delivery_type', DeliveryType::values())->default(DeliveryType::Delivery->value);
            $table->string('shipping_address')->nullable();
            $table->text('customer_note')->nullable();

            $table->decimal('total_rental_fee', 12, 2)->default(0);
            $table->decimal('total_deposit_fee', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('shipping_fee', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);
            $table->decimal('refunded_deposit', 12, 2)->default(0);

            $table->enum('payment_method', PaymentMethod::values())->default(PaymentMethod::Cash->value);
            $table->enum('payment_status', PaymentStatus::values())->default(PaymentStatus::Unpaid->value);
            $table->enum('order_status', OrderStatus::values())->default(OrderStatus::Pending->value);

            $table->timestamps();

            $table->foreign('coupon_id')->references('id')->on('coupons')->nullOnDelete();

            $table->index(['user_id', 'created_at']);
            $table->index('order_status');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
