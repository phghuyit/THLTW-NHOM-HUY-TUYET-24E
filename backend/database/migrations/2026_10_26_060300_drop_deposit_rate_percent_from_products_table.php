<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('products', 'deposit_rate_percent')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('deposit_rate_percent');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('products', 'deposit_rate_percent')) {
            Schema::table('products', function (Blueprint $table) {
                $table->integer('deposit_rate_percent')->default(70);
            });
        }
    }
};
