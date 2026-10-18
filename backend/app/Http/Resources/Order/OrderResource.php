<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $firstItem = $this->items?->first();
        $totalRental = (float) $this->items?->sum('total_item_rental');
        $totalDeposit = (float) $this->items?->sum('total_item_deposit');
        $grandTotal = $totalRental + $totalDeposit;

        return [
            'id' => $this->id,
            'code' => $this->order_code,
            'status' => $this->status ?? 'confirmed',
            'channel' => 'online',
            'createdAt' => $this->user?->created_at?->toIso8601String() ?? now()->toIso8601String(),
            'receiverName' => $this->user?->fullname ?? 'Khách vãng lai',
            'receiverPhone' => $this->user?->phone ?? '',
            'pickupDate' => $firstItem?->rent_start_date,
            'returnDate' => $firstItem?->rent_end_date,
            'subtotalRental' => $totalRental,
            'totalDeposit' => $totalDeposit,
            'grandTotal' => $grandTotal,
            'paidAmount' => $grandTotal,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
