<?php

use App\Enums\ContactStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bảng 20: contacts — Liên hệ & góp ý của khách hàng (§6.3).
 *
 * Khách vãng lai gửi được, không cần đăng nhập (§2.2).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('fullname', 100);
            $table->string('email', 100);
            $table->string('phone', 20)->nullable();
            $table->string('title', 200);
            $table->text('content');
            $table->text('admin_reply')->nullable();
            $table->enum('status', ContactStatus::values())->default(ContactStatus::Pending->value);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
