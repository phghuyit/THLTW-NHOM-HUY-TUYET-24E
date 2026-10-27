<?php

namespace App\Http\Controllers;

use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.productSize.product'])
            ->where('status', '!=', 'cancelled')
            ->latest('id')
            ->get();

        return OrderResource::collection($orders);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $orderCode = $request->input('order_code') ?? ('SR' . strtoupper(substr(uniqid(), -6)));

        $order = Order::create([
            'order_code' => $orderCode,
            'user_id' => $user->id,
            'status' => 'pending_payment',
            'receiver_name' => $request->input('receiver_name') ?? $user->fullname,
            'receiver_phone' => $request->input('receiver_phone') ?? $user->phone,
            'address' => $request->input('address') ?? $user->address,
            'payment_method' => $request->input('payment_method', 'cod'),
            'total_amount' => $request->input('total_amount', 0),
            'note' => $request->input('note'),
        ]);

        $items = $request->input('items', []);
        foreach ($items as $item) {
            $order->items()->create([
                'product_size_id' => $item['product_size_id'] ?? 1,
                'quantity' => $item['quantity'] ?? 1,
                'rent_start_date' => $item['pickupDate'] ?? now()->addDay(),
                'rent_end_date' => $item['returnDate'] ?? now()->addDays(4),
                'rental_days' => $item['days'] ?? 3,
                'price_per_day' => $item['price_per_day'] ?? 250000,
                'deposit_per_item' => $item['deposit_per_item'] ?? 500000,
                'total_item_rental' => $item['rentalTotal'] ?? 750000,
                'total_item_deposit' => $item['depositTotal'] ?? 500000,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'order' => new OrderResource($order->load(['user', 'items.productSize.product'])),
            'order_code' => $orderCode,
        ], 201);
    }

    public function show(Request $request, $code)
    {
        $user = $request->user();
        $query = Order::with(['user', 'items.productSize.product'])
            ->where('order_code', $code);

        if ($user && $user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $order = $query->firstOrFail();

        return new OrderResource($order);
    }

    public function updateStatus(Request $request, $code)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $order = Order::where('order_code', $code)->firstOrFail();
        $order->status = $request->status;
        $order->save();

        return new OrderResource($order->load(['user', 'items.productSize.product']));
    }

    public function trash()
    {
        $orders = Order::with(['user', 'items.productSize.product'])
            ->where('status', 'cancelled')
            ->latest('updated_at')
            ->get();

        return OrderResource::collection($orders);
    }

    public function restore($id)
    {
        $order = Order::findOrFail($id);
        $order->status = 'confirmed';
        $order->save();

        return response()->json([
            'message' => 'Khôi phục đơn hàng thành công',
            'code' => 200,
        ]);
    }

    public function forceDelete($id)
    {
        $order = Order::findOrFail($id);
        $order->items()->delete();
        $order->forceDelete();

        return response()->json([
            'message' => 'Xóa vĩnh viễn đơn hàng thành công',
            'code' => 200,
        ]);
    }

    public function myOrders(Request $request)
    {
        $user = $request->user('sanctum') ?? auth('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $orders = Order::with(['user', 'items.productSize.product'])
            ->where('user_id', $user->id)
            ->latest('id')
            ->get();

        return OrderResource::collection($orders);
    }
}
