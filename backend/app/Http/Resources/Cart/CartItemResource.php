<?php

namespace App\Http\Resources\Cart;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cart_id' => $this->cart_id,
            'product_id'=>$this->product_id,
            'product_size_id'=>$this->product_size_id,
            'quantity'=>$this->quantity,
            'rent_start_date'=>$this->rent_start_date,
            'rent_end_date'=>$this->rent_end_date
        ];
    }
}
