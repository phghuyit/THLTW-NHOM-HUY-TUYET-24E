<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Bảng 1: users — Admin và khách hàng dùng chung một bảng, phân biệt bằng role.
 *
 * @property UserRole $role
 * @property UserStatus $status
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'role',
        'fullname',
        'email',
        'password',
        'phone',
        'address',
        'avatar',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** Khớp DEFAULT của CSDL, để instance chưa lưu cũng có enum thay vì NULL. */
    protected $attributes = [
        'role' => UserRole::Member->value,
        'status' => UserStatus::Active->value,
    ];

    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'status' => UserStatus::class,
            'password' => 'hashed',
        ];
    }

    /* ---------------- Quan hệ ---------------- */

    /** Đơn thuê do người dùng này đặt. */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /** Biên bản trả đồ do tài khoản admin này lập (rental_returns.staff_id). */
    public function handledReturns(): HasMany
    {
        return $this->hasMany(RentalReturn::class, 'staff_id');
    }

    /** Phiếu nhập / xuất kho do tài khoản admin này lập. */
    public function stockReceipts(): HasMany
    {
        return $this->hasMany(StockReceipt::class);
    }

    /* ---------------- Tiện ích ---------------- */

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::Active;
    }
}
