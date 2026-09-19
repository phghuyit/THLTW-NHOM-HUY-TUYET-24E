<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 14: stock_receipt_details — Chi tiết từng biến thể trong phiếu kho (§6.3).
 *
 * quantity luôn lưu số dương; chiều tác động lấy từ
 * stock_receipts.receipt_type (ReceiptType::stockSign()).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_receipt_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_id')->constrained('stock_receipts')->cascadeOnDelete();
            $table->foreignId('product_variant_id')->constrained()->restrictOnDelete();
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_receipt_details');
    }
};
