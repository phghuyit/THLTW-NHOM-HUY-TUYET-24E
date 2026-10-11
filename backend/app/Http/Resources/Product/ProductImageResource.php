<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ProductImageResource extends JsonResource
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
            'product_id' => $this->product_id,
            'image_url' => $this->image_url && !Str::startsWith($this->image_url, ['http://', 'https://'])
                ? url('storage/'.ltrim($this->image_url, '/')) : $this->image_url,
            'sort_order' => $this->sort_order
        ];
    }
}
