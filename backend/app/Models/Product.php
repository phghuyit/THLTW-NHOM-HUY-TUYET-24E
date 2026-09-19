<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Bảng 5: products — Sản phẩm trang phục gốc.
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'thumbnail',
        'short_description',
        'description',
        'rental_price_per_day',
        'deposit_rate_percent',
        'original_value',
        'is_featured',
        'view_count',
        'status',
    ];

    /** Khớp DEFAULT của CSDL, để instance chưa lưu cũng có enum thay vì NULL. */
    protected $attributes = [
        'status' => ContentStatus::Active->value,
        'rental_price_per_day' => 0,
        'original_value' => 0,
        'deposit_rate_percent' => 70,
        'is_featured' => false,
        'view_count' => 0,
    ];

    protected function casts(): array
    {
        return [
            'rental_price_per_day' => 'decimal:2',
            'original_value' => 'decimal:2',
            'deposit_rate_percent' => 'integer',
            'is_featured' => 'boolean',
            'view_count' => 'integer',
            'status' => ContentStatus::class,
        ];
    }

    /* ---------------- Quan hệ ---------------- */

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /* ---------------- Thuộc tính tính toán ---------------- */

    /**
     * Tiền cọc của một món (BR-11): original_value × deposit_rate_percent / 100.
     *
     * Đây là nguồn duy nhất tính cọc — PricingService ở Lô 4 gọi lại accessor này
     * để công thức chỉ tồn tại một chỗ.
     */
    protected function depositAmount(): Attribute
    {
        return Attribute::get(
            fn (): float => round((float) $this->original_value * $this->deposit_rate_percent / 100, 2)
        );
    }

    /** Tổng tồn kho của mọi biến thể — dùng để biết sản phẩm còn hàng không (BR-01). */
    protected function totalStock(): Attribute
    {
        return Attribute::get(
            fn (): int => (int) $this->variants->sum('stock_quantity')
        );
    }

    /* ---------------- Scope ---------------- */

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ContentStatus::Active);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /** Chỉ sản phẩm còn ít nhất một biến thể có hàng. */
    public function scopeInStock(Builder $query): Builder
    {
        return $query->whereHas('variants', fn (Builder $q) => $q->where('stock_quantity', '>', 0));
    }
}
