<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 1: users — Tài khoản người dùng & phân quyền (§6.3).
 * Bảng 2: password_resets — Token quên mật khẩu (§6.3).
 *
 * Bảng sessions của Laravel bị bỏ: API dùng Sanctum Bearer token,
 * SESSION_DRIVER đã chuyển sang file.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->enum('role', UserRole::values())->default(UserRole::Member->value);
            $table->string('fullname', 100);
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->string('phone', 20)->nullable();
            $table->string('address')->nullable();
            $table->string('avatar')->nullable();
            $table->enum('status', UserStatus::values())->default(UserStatus::Active->value);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email', 100)->index();
            $table->string('token');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('users');
    }
};
