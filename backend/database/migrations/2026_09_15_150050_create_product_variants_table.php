<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 7: product_variants — Biến thể size × màu & tồn kho thực tế (§6.3).
 *
 * Đây là đơn vị tồn kho của toàn hệ thống (BR-01).
 *
 * Hai ràng buộc bổ sung ngoài file SQL gốc:
 *   - UNIQUE (product_id, size, color): không tạo trùng biến thể.
 *   - CHECK (stock_quantity >= 0): chốt chặn cuối cùng cho BR-04, phòng khi
 *     khoá bi quan ở tầng ứng dụng bị bỏ sót thì CSDL vẫn chặn tồn kho âm.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku', 50)->unique();
            $table->string('size', 20);
            $table->string('color', 50);
            $table->string('condition_note', 100)->default('99% New');
            $table->integer('stock_quantity')->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'size', 'color'], 'product_variants_combo_unique');
        });

        DB::statement(
            'ALTER TABLE `product_variants`
             ADD CONSTRAINT `product_variants_stock_non_negative`
             CHECK (`stock_quantity` >= 0)'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
