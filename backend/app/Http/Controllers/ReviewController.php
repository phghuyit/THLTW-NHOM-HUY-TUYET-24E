<?php

namespace App\Http\Controllers;

use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product:id,name,slug'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->whereIn('status', ['approved', 'pending']);
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('product_slug')) {
            $product = Product::where('slug', $request->product_slug)->first();
            if ($product) {
                $query->where('product_id', $product->id);
            }
        }

        $reviews = $query->paginate($request->integer('per_page', 20));

        return ReviewResource::collection($reviews);
    }

    public function store(StoreReviewRequest $request)
    {
        $user = $request->user('sanctum') ?? auth('sanctum')->user();
        $validated = $request->validated();

        if (empty($validated['product_id']) && !empty($validated['product_slug'])) {
            $product = Product::where('slug', $validated['product_slug'])->first();
            if ($product) {
                $validated['product_id'] = $product->id;
            }
        }

        $validated['user_id'] = $user?->id;
        $validated['author_name'] = $validated['author_name'] ?? $user?->fullname ?? 'Khách hàng';
        $validated['status'] = $validated['status'] ?? 'pending';

        $review = Review::create($validated);

        return (new ReviewResource($review->load('product')))
            ->response()
            ->setStatusCode(201);
    }

    public function adminIndex(Request $request)
    {
        $reviews = Review::with(['user', 'product:id,name,slug'])
            ->latest()
            ->paginate(15);

        return ReviewResource::collection($reviews);
    }

    public function updateStatus(Request $request, Review $review)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,hidden',
        ]);

        $review->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Cập nhật trạng thái đánh giá thành công',
            'data' => new ReviewResource($review),
        ]);
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json([
            'message' => 'Xóa đánh giá thành công',
            'code' => 200,
        ]);
    }
}
