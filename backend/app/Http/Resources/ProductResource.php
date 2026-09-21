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
            'id'=> $this->id,
            'category_id'=> $this->category_id,
            'brand_id'=> $this->brand_id,
            'name'=> $this->name,
            'slug'=> $this->slug,
            'short_description'=> $this->short_description,
            'description'=> $this->description,
            'rental_price_per_day'=> $this->rental_price_per_day,
            'deposit_rate_percent'=> $this->deposit_rate_percent,
            'original_value'=> $this->original_value,
            'is_featured'=> $this->is_featured,
            'view_count'=> $this->view_count,
            'status'=> $this->status,
            'category'=> new CategoryResource($this->whenLoaded('category')),
            'brand'=> new BrandResource($this->whenLoaded('brand')),
            
        ];
    }
}
