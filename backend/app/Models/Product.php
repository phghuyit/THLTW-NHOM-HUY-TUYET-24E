<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $category_id
 * @property int|null $brand_id
 * @property string $name
 * @property string $slug
 * @property string $thumbnail
 * @property string|null $short_description
 * @property string|null $description
 * @property numeric $rental_price_per_day
 * @property int $deposit_rate_percent
 * @property numeric $original_value
 * @property bool $is_featured
 * @property int $view_count
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property numeric|null $sale_rental_price
 * @property bool $is_sale
 * @property-read float $effective_price
 * @property-read int $discount_percent
 * @property-read numeric|null $sale_price
 * @property-read \App\Models\Brand|null $brand
 * @property-read \App\Models\Category|null $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductImage> $images
 * @property-read int|null $images_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProductSize> $sizes
 * @property-read int|null $sizes_count
 * @method static Builder<static>|Product active()
 * @method static Builder<static>|Product onSale()
 * @method static Builder<static>|Product newModelQuery()
 * @method static Builder<static>|Product newQuery()
 * @method static Builder<static>|Product onlyTrashed()
 * @method static Builder<static>|Product query()
 * @method static Builder<static>|Product whereBrandId($value)
 * @method static Builder<static>|Product whereCategoryId($value)
 * @method static Builder<static>|Product whereCreatedAt($value)
 * @method static Builder<static>|Product whereDeletedAt($value)
 * @method static Builder<static>|Product whereDepositRatePercent($value)
 * @method static Builder<static>|Product whereDescription($value)
 * @method static Builder<static>|Product whereId($value)
 * @method static Builder<static>|Product whereIsFeatured($value)
 * @method static Builder<static>|Product whereIsSale($value)
 * @method static Builder<static>|Product whereName($value)
 * @method static Builder<static>|Product whereOriginalValue($value)
 * @method static Builder<static>|Product whereRentalPricePerDay($value)
 * @method static Builder<static>|Product whereSaleRentalPrice($value)
 * @method static Builder<static>|Product whereShortDescription($value)
 * @method static Builder<static>|Product whereSlug($value)
 * @method static Builder<static>|Product whereStatus($value)
 * @method static Builder<static>|Product whereThumbnail($value)
 * @method static Builder<static>|Product whereUpdatedAt($value)
 * @method static Builder<static>|Product whereViewCount($value)
 * @method static Builder<static>|Product withTrashed(bool $withTrashed = true)
 * @method static Builder<static>|Product withoutTrashed()
 * @mixin \Eloquent
 */
class Product extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'thumbnail',
        'short_description',
        'description',
        'rental_price_per_day',
        'sale_rental_price',
        'deposit_rate_percent',
        'original_value',
        'is_featured',
        'is_sale',
        'view_count',
        'status',
    ];

    protected $casts = [
        'rental_price_per_day' => 'integer',
        'sale_rental_price' => 'integer',
        'deposit_rate_percent' => 'integer',
        'original_value' => 'integer',
        'is_featured' => 'boolean',
        'is_sale' => 'boolean',
        'view_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function sizes(): HasMany
    {
        return $this->hasMany(ProductSize::class);
    }
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeOnSale(Builder $query): Builder
    {
        return $query->where('is_sale', true);
    }

    /**
     * Lấy giá thuê khuyến mãi nếu sản phẩm đang bật chế độ sale (nguyên số VND).
     */
    public function saleRentalPrice(): ?int
    {
        return ($this->is_sale && $this->sale_rental_price !== null) ? (int) $this->sale_rental_price : null;
    }

    /**
     * Alias salePrice() để tương thích ngược.
     */
    public function salePrice(): ?int
    {
        return $this->saleRentalPrice();
    }

    /**
     * Alias getSalePrice() để tương thích ngược.
     */
    public function getSalePrice(): ?int
    {
        return $this->saleRentalPrice();
    }

    /**
     * Alias accessor sale_price.
     */
    public function getSalePriceAttribute(): ?int
    {
        return $this->sale_rental_price !== null ? (int) $this->sale_rental_price : null;
    }

    /**
     * Lấy giá áp dụng thực tế (nếu is_sale = true và có sale_rental_price hợp lệ thì lấy sale_rental_price, ngược lại lấy rental_price_per_day).
     */
    public function getEffectivePriceAttribute(): int
    {
        if ($this->is_sale && !is_null($this->sale_rental_price) && (int) $this->sale_rental_price > 0) {
            return (int) $this->sale_rental_price;
        }

        return (int) $this->rental_price_per_day;
    }

    /**
     * Kiểm tra sản phẩm có đang trong chương trình sale hợp lệ không.
     */
    public function isOnSale(): bool
    {
        return (bool) $this->is_sale 
            && !is_null($this->sale_rental_price) 
            && (int) $this->sale_rental_price <= (int) $this->rental_price_per_day;
    }

    /**
     * Tính tỷ lệ phần trăm giảm giá (nếu có).
     */
    public function getDiscountPercentAttribute(): int
    {
        if ($this->isOnSale() && (int) $this->rental_price_per_day > 0) {
            $discount = (((int) $this->rental_price_per_day - (int) $this->sale_rental_price) / (int) $this->rental_price_per_day) * 100;
            return (int) round($discount);
        }

        return 0;
    }

    /**
     * Định dạng tiền tệ VND (tương đương toLocaleString('vi-VN')).
     */
    public function getFormattedEffectivePriceAttribute(): string
    {
        return number_format($this->effective_price, 0, ',', '.') . '₫';
    }

    public function getFormattedRentalPriceAttribute(): string
    {
        return number_format((int) $this->rental_price_per_day, 0, ',', '.') . '₫';
    }

    public function getFormattedSaleRentalPriceAttribute(): ?string
    {
        return $this->sale_rental_price !== null ? number_format((int) $this->sale_rental_price, 0, ',', '.') . '₫' : null;
    }
}
