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

    public function show($code)
    {
        $order = Order::with(['user', 'items.productSize.product'])
            ->where('order_code', $code)
            ->firstOrFail();

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
}
