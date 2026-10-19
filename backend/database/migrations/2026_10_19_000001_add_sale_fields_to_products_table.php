<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('products', 'sale_rental_price')) {
            Schema::table('products', function (Blueprint $table) {
                $table->decimal('sale_rental_price', 12, 2)->nullable();
            });
        }

        if (!Schema::hasColumn('products', 'is_sale')) {
            Schema::table('products', function (Blueprint $table) {
                $table->boolean('is_sale')->default(false);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'is_sale')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('is_sale');
            });
        }

        if (Schema::hasColumn('products', 'sale_rental_price')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('sale_rental_price');
            });
        }
    }
};
