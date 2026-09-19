<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Bảng 7: product_variants — Biến thể size × màu, đơn vị tồn kho của hệ thống (BR-01).
 */
class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'size',
        'color',
        'condition_note',
        'stock_quantity',
    ];

    /** Khớp DEFAULT của CSDL. */
    protected $attributes = [
        'condition_note' => '99% New',
        'stock_quantity' => 0,
    ];

    protected function casts(): array
    {
        return [
            'stock_quantity' => 'integer',
        ];
    }

    /* ---------------- Quan hệ ---------------- */

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function stockReceiptDetails(): HasMany
    {
        return $this->hasMany(StockReceiptDetail::class);
    }

    /* ---------------- Tiện ích ---------------- */

    /** Tên hiển thị đầy đủ, ví dụ "Áo dài cách tân đỏ · M · Đỏ Ruby". */
    public function displayName(): string
    {
        return trim(($this->product?->name ?? '').' · '.$this->size.' · '.$this->color, ' ·');
    }

    public function hasStock(int $quantity = 1): bool
    {
        return $this->stock_quantity >= $quantity;
    }

    /* ---------------- Scope ---------------- */

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /** Biến thể sắp hết hàng — ngưỡng lấy từ system_configs.low_stock_threshold (BR-06). */
    public function scopeLowStock(Builder $query, int $threshold = 2): Builder
    {
        return $query->where('stock_quantity', '<=', $threshold);
    }
}
