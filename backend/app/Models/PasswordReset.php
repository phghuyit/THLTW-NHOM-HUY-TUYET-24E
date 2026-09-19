<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Bảng 2: password_resets — Token quên mật khẩu.
 *
 * Bảng không có khoá chính và chỉ có created_at (theo file SQL).
 * Laravel password broker thao tác thẳng vào bảng này; model ở đây phục vụ
 * job dọn token hết hạn (BR-56) và các truy vấn kiểm tra.
 */
class PasswordReset extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'password_resets';

    public $incrementing = false;

    protected $primaryKey = null;

    protected $keyType = 'string';

    protected $fillable = [
        'email',
        'token',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /** Token quá hạn theo cấu hình auth.passwords.users.expire (mặc định 60 phút). */
    public function scopeExpired(Builder $query, ?int $minutes = null): Builder
    {
        $minutes ??= (int) config('auth.passwords.users.expire', 60);

        return $query->where('created_at', '<', now()->subMinutes($minutes));
    }
}
