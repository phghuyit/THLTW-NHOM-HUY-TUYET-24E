<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 11: rental_returns — Biên bản kiểm tra & trả đồ (§6.3).
 *
 * order_id UNIQUE là ràng buộc bổ sung ngoài file SQL gốc — thực thi BR-35:
 * mỗi đơn chỉ một biên bản. Không có nó thì lập biên bản hai lần sẽ hoàn cọc
 * hai lần cho cùng một đơn.
 *
 * staff_id nullable + SET NULL: xoá tài khoản admin không làm mất biên bản.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('staff_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('actual_return_date');
            $table->decimal('penalty_fee', 12, 2)->default(0);
            $table->string('penalty_reason')->nullable();
            $table->decimal('deposit_refund_amount', 12, 2);
            $table->text('return_note')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_returns');
    }
};
