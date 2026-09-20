<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained('categories')
                ->restrictOnDelete();

            $table->foreignId('brand_id')
                ->nullable()
                ->constrained('brands')
                ->nullOnDelete();

            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('thumbnail');
            $table->string('short_description', 500)->nullable();
            $table->longText('description')->nullable();
            $table->decimal('rental_price_per_day', 12, 2)->default(0);
            $table->integer('deposit_rate_percent')->default(70);
            $table->decimal('original_value', 12, 2)->default(0);
            $table->boolean('is_featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->enum('status', ['active', 'hidden'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
