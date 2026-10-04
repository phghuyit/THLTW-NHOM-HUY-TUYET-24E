<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $products = Product::with(['category:id,name', 'brand:id,name',])
            ->active();
            if($request->boolean('featured')){
                $products->where('is_featured',true);
            }
              $products = $products->latest()->paginate(12);
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        //
        $validated = $request->validated();
        $sizes = Arr::pull($validated, 'sizes', []);
        $image = Arr::pull($validated, 'images', []);
        $validated['slug'] = Str::slug($validated['name']);
        $product = DB::transaction(function () use ($validated, $sizes, $image) {
            $product = Product::create($validated);
            $product->sizes()->createMany($sizes);
            $product->images()->createMany($image);
            return $product;
        });
        $product->load(['sizes', 'images', 'brand', 'category']);
        return response()->json(new ProductResource($product), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        //
        $product = Product::with(['category', 'brand', 'images', 'sizes'])->where('slug', $slug)->where('status', 'active')->firstOrFail();
        return response()->json(new ProductResource($product));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        //
        $validated = $request->validated();
        $images = Arr::pull($validated, 'images', []);
        $sizes = Arr::pull($validated, 'sizes', []);
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        };
        $product = DB::transaction(function () use ($validated, $images, $sizes, $product) {
            $product->update($validated);
            $now = now();

            if (!empty($images)) {
                $product->images()->forceDelete();

                $imagePayload = [];
                foreach ($images as $index => $image) {
                    $imagePayload[] = [
                        'product_id' => $product->id,
                        'image_url'  => $image['image_url'],
                        'sort_order' => $image['sort_order'] ?? $index,
                    ];
                }
                $product->images()->createMany($imagePayload);
            }

            if (!empty($sizes)) {
                $activeSize = [];
                $payLoadSize = [];
                foreach ($sizes as $size) {
                    $payLoadSize[] = [
                        'product_id'     => $product->id,
                        'size'           => $size['size'],
                        'stock_quantity' => $size['stock_quantity'],
                        'deleted_at'     => null,
                        'created_at'     => $now,
                        'updated_at'     => $now,
                    ];
                    $activeSize[] = $size['size'];
                }

                ProductSize::upsert(
                    $payLoadSize,
                    ['product_id', 'size'],
                    ['stock_quantity', 'deleted_at', 'updated_at']
                );

                $product->sizes()->whereNotIn('size', $activeSize)->delete();
            }

            return $product;
        });
        $product->refresh()->load(['sizes', 'images', 'brand', 'category']);
        return response()->json(new ProductResource($product));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
        $product->delete();
        return response()->json([
            'message' => 'Chuyển sản phẩm vào thùng rác thành công',
            'code' => 200
        ]);
    }
    public function forceDelete(string $id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->sizes()->forceDelete();
        $product->images()->forceDelete();
        $product->forceDelete();
        return response()->json([
            'message' => 'Xóa sản phẩm vĩnh viễn thành công',
            'code' => 200
        ]);
    }

    public function trash()
    {
        $products = Product::onlyTrashed()->latest()->paginate(12);
        return ProductResource::collection($products);
    }

    public function restore(string $id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();
        return response()->json([
            'message' => 'Hoàn tác sản phẩm thành công',
            'code' => 200
        ]);
    }
}
