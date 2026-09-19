<?php

use App\Enums\ReceiptType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 13: stock_receipts — Phiếu nhập / xuất kho (§6.3, FUNC-ADM-STOCK).
 *
 * Mọi biến động tồn kho ngoài luồng thuê đều phải có phiếu, để kiểm kê lúc
 * nào cũng giải thích được chênh lệch (BR-33).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_code', 30)->unique();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->enum('receipt_type', ReceiptType::values());
            $table->string('reason');
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_receipts');
    }
};
