<?php

use App\Enums\PaymentMethod;
use App\Enums\PaymentType;
use App\Enums\TransactionStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 12: payments — Lịch sử thu tiền và hoàn cọc (§6.3).
 *
 * transaction_id UNIQUE là ràng buộc bổ sung ngoài file SQL gốc — thực thi
 * BR-18: VNPay có thể gọi IPN lại nhiều lần, UNIQUE là chốt chặn để cùng một
 * mã giao dịch không bao giờ ghi nhận thành hai lần thu tiền.
 *
 * NULL không bị tính vào UNIQUE trong MySQL/MariaDB, nên nhiều phiếu thu tiền
 * mặt chưa có mã vẫn lưu được bình thường.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('transaction_id', 100)->nullable()->unique();
            $table->enum('payment_gateway', PaymentMethod::values());
            $table->decimal('amount', 12, 2);
            $table->enum('type', PaymentType::values())->default(PaymentType::Payment->value);
            $table->enum('status', TransactionStatus::values())->default(TransactionStatus::Pending->value);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
