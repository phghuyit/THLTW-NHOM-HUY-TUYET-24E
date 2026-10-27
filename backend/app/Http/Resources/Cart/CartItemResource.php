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

        $pricePerDay = $this->product ? (int) $this->product->effective_price : 0;
        $depositPerItem = 0;

        $totalRental = (int) ($pricePerDay * $this->quantity * $rentalDays);
        $totalDeposit = (int) ($depositPerItem * $this->quantity);
        $subtotal = $totalRental + $totalDeposit;

        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'product_thumbnail' => $this->product?->thumbnail,
            'product_size_id' => $this->product_size_id,
            'size' => $this->productSize?->size ?? 'FreeSize',
            'quantity' => (int) $this->quantity,
            'rent_start_date' => $this->rent_start_date ? Carbon::parse($this->rent_start_date)->format('Y-m-d') : null,
            'rent_end_date' => $this->rent_end_date ? Carbon::parse($this->rent_end_date)->format('Y-m-d') : null,
            'rental_days' => $rentalDays,
            'original_price_per_day' => $this->product ? (int) $this->product->rental_price_per_day : 0,
            'sale_rental_price' => $this->product?->sale_rental_price !== null ? (int) $this->product->sale_rental_price : null,
            'rental_price_per_day' => $pricePerDay,
            'is_sale' => (bool) ($this->product?->is_sale ?? false),
            'deposit_per_item' => $depositPerItem,
            'total_rental' => $totalRental,
            'total_deposit' => $totalDeposit,
            'subtotal' => $subtotal,
            'formatted_rental_price_per_day' => number_format($pricePerDay, 0, ',', '.') . '₫',
            'formatted_deposit_per_item' => number_format($depositPerItem, 0, ',', '.') . '₫',
            'formatted_total_rental' => number_format($totalRental, 0, ',', '.') . '₫',
            'formatted_total_deposit' => number_format($totalDeposit, 0, ',', '.') . '₫',
            'formatted_subtotal' => number_format($subtotal, 0, ',', '.') . '₫',
        ];
    }
}
