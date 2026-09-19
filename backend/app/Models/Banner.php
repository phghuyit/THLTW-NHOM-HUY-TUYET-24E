<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Bảng 18: banners — Banner & slider quảng cáo.
 *
 * Bảng chỉ có created_at (theo file SQL).
 */
class Banner extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'title',
        'image_url',
        'link_url',
        'position',
        'sort_order',
        'status',
    ];

    /** Khớp DEFAULT của CSDL, để instance chưa lưu cũng có enum thay vì NULL. */
    protected $attributes = [
        'status' => ContentStatus::Active->value,
        'position' => 'home_main_slider',
        'sort_order' => 0,
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'status' => ContentStatus::class,
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ContentStatus::Active);
    }

    public function scopeAtPosition(Builder $query, string $position): Builder
    {
        return $query->where('position', $position)->orderBy('sort_order');
    }
}
