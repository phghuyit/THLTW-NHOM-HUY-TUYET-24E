<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = $this->productSize?->product;

        return [
            'id' => $this->id,
            'productNameSnapshot' => $product?->name ?? 'Sản phẩm',
            'image' => $product?->thumbnail ?? 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
            'variantSnapshot' => [
                'size' => $this->productSize?->size ?? 'FreeSize',
                'color' => 'Mặc định',
            ],
            'quantity' => (int) $this->quantity,
            'rentalDays' => (int) $this->rental_days,
            'pricePerDay' => (float) $this->price_per_day,
            'depositPerItem' => (float) $this->deposit_per_item,
            'lineRentalTotal' => (float) $this->total_item_rental,
        ];
    }
}
