<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $products = Product::all();
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        //
        $validated = $request->validated();
        $sizes = Arr::pull($validated, 'sizes',[]);
        $image = Arr::pull($validated, 'images', []);
        $validated['slug'] = Str::slug($validated['name']);
        $product = DB::transaction(function () use ($validated, $sizes, $image) {
            $product = Product::create($validated);
            $product->sizes()->createMany($sizes);
            $product->images()->createMany($image);
            return $product;
        });
        $product->load(['sizes','images','brand','category']);
        return response()->json(new ProductResource($product), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
