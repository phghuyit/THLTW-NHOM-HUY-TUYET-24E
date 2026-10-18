<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'brand_id' => $this->brand_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'rental_price_per_day' => (int) $this->rental_price_per_day,
            'sale_rental_price' => $this->sale_rental_price !== null ? (int) $this->sale_rental_price : null,
            'sale_price' => $this->sale_rental_price !== null ? (int) $this->sale_rental_price : null,
            'is_sale' => (bool) $this->is_sale,
            'effective_price' => (int) $this->effective_price,
            'discount_percent' => (int) $this->discount_percent,
            'formatted_rental_price' => number_format((int) $this->rental_price_per_day, 0, ',', '.') . '₫',
            'formatted_sale_rental_price' => $this->sale_rental_price !== null ? number_format((int) $this->sale_rental_price, 0, ',', '.') . '₫' : null,
            'formatted_effective_price' => number_format((int) $this->effective_price, 0, ',', '.') . '₫',
            'deposit_rate_percent' => (int) $this->deposit_rate_percent,
            'original_value' => (int) $this->original_value,
            'formatted_original_value' => number_format((int) $this->original_value, 0, ',', '.') . '₫',
            'is_featured' => (bool) $this->is_featured,
            'view_count' => (int) $this->view_count,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'brand' => BrandResource::make($this->whenLoaded('brand')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'sizes' => ProductSizesResource::collection($this->whenLoaded('sizes'))
        ];
    }
}
