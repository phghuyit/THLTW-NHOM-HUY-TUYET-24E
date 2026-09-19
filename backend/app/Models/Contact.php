<?php

namespace App\Models;

use App\Enums\ContactStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Bảng 20: contacts — Liên hệ & góp ý của khách hàng.
 *
 * Bảng chỉ có created_at (theo file SQL).
 */
class Contact extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'fullname',
        'email',
        'phone',
        'title',
        'content',
        'admin_reply',
        'status',
    ];

    /** Khớp DEFAULT của CSDL, để instance chưa lưu cũng có enum thay vì NULL. */
    protected $attributes = [
        'status' => ContactStatus::Pending->value,
    ];

    protected function casts(): array
    {
        return [
            'status' => ContactStatus::class,
        ];
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', ContactStatus::Pending);
    }
}
