<?php

namespace App\Http\Resources\Cart;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $rentalDays = 1;
        if ($this->rent_start_date && $this->rent_end_date) {
            $start = Carbon::parse($this->rent_start_date);
            $end = Carbon::parse($this->rent_end_date);
            $rentalDays = max(1, $start->diffInDays($end) + 1);
        }

        $pricePerDay = $this->product ? (float) $this->product->rental_price_per_day : 0;
        $depositRate = $this->product ? (int) $this->product->deposit_rate_percent : 70;
        $originalValue = $this->product ? (float) $this->product->original_value : 0;
        $depositPerItem = ($originalValue * $depositRate) / 100;

        $totalRental = $pricePerDay * $this->quantity * $rentalDays;
        $totalDeposit = $depositPerItem * $this->quantity;

        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'product_thumbnail' => $this->product?->thumbnail,
            'product_size_id' => $this->product_size_id,
            'size' => $this->productSize?->size ?? 'FreeSize',
            'quantity' => $this->quantity,
            'rent_start_date' => $this->rent_start_date ? Carbon::parse($this->rent_start_date)->format('Y-m-d') : null,
            'rent_end_date' => $this->rent_end_date ? Carbon::parse($this->rent_end_date)->format('Y-m-d') : null,
            'rental_days' => $rentalDays,
            'rental_price_per_day' => $pricePerDay,
            'deposit_per_item' => $depositPerItem,
            'total_rental' => $totalRental,
            'total_deposit' => $totalDeposit,
            'subtotal' => $totalRental + $totalDeposit,
        ];
    }
}
