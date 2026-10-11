<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        return ProductResource::collection(Product::with(['category:id,name', 'brand:id,name'])->active()->latest()->paginate(12));
    }

    public function show(string $slug)
    {
        $product = Product::with(['category', 'brand', 'images', 'sizes'])->where('slug', $slug)->active()->firstOrFail();
        return response()->json(new ProductResource($product));
    }

    public function adminIndex(Request $request)
    {
        $request->validate(['per_page' => ['sometimes', 'integer', 'in:5,12,24,48']]);
        return ProductResource::collection(Product::with(['category', 'brand', 'sizes'])->orderByDesc('id')->paginate($request->integer('per_page', 12)));
    }

    public function adminShow(Product $product)
    {
        return new ProductResource($product->load(['category', 'brand', 'images', 'sizes']));
    }

    public function formOptions()
    {
        return response()->json(['data' => [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'brands' => Brand::orderBy('name')->get(['id', 'name']),
        ]]);
    }

    public function store(StoreProductRequest $request)
    {
        return (new ProductResource($this->saveProduct($request->validated())))->response()->setStatusCode(201);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        return new ProductResource($this->saveProduct($request->validated(), $product));
    }

    private function saveProduct(array $data, ?Product $product = null): Product
    {
        $sizes = Arr::pull($data, 'sizes');
        $images = Arr::pull($data, 'images');
        $gallery = Arr::pull($data, 'gallery_files', []);
        $newPaths = [];
        $oldPaths = [];

        try {
            if (isset($data['thumbnail'])) {
                $path = $data['thumbnail']->store('products', 'public');
                abort_unless($path, 500, 'Không lưu được ảnh sản phẩm.');
                $newPaths[] = $path;
                if ($product) $oldPaths[] = $product->thumbnail;
                $data['thumbnail'] = $path;
            }
            if ($gallery) {
                $images = [];
                foreach ($gallery as $index => $file) {
                    $path = $file->store('products', 'public');
                    abort_unless($path, 500, 'Không lưu được ảnh sản phẩm.');
                    $newPaths[] = $path;
                    $images[] = ['image_url' => $path, 'sort_order' => $index];
                }
            }
            $product = DB::transaction(function () use ($data, $sizes, $images, $product, &$oldPaths) {
                if ($product) $product->update($data);
                else $product = Product::create($data);

                if ($sizes !== null) {
                    $payload = [];
                    foreach ($sizes as $size) {
                        $payload[] = [
                            'product_id' => $product->id, 'size' => $size['size'],
                            'stock_quantity' => $size['stock_quantity'], 'deleted_at' => null,
                            'created_at' => now(), 'updated_at' => now(),
                        ];
                    }
                    ProductSize::upsert($payload, ['product_id', 'size'], ['stock_quantity', 'deleted_at', 'updated_at']);
                    $product->sizes()->whereNotIn('size', array_column($sizes, 'size'))->delete();
                }
                if ($images !== null) {
                    $oldPaths = array_merge($oldPaths, $product->images()->withTrashed()->pluck('image_url')->all());
                    $product->images()->withTrashed()->forceDelete();
                    $product->images()->createMany($images);
                }
                return $product->refresh()->load(['category', 'brand', 'sizes', 'images']);
            });
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($newPaths);
            throw $exception;
        }
        $this->deleteUnusedImages($oldPaths);
        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Chuyển sản phẩm vào thùng rác thành công.']);
    }

    public function trash()
    {
        return ProductResource::collection(Product::onlyTrashed()->with(['category', 'brand'])->orderByDesc('deleted_at')->orderByDesc('id')->paginate(12));
    }

    public function restore(string $id)
    {
        $product = DB::transaction(function () use ($id) {
            $product = Product::onlyTrashed()->lockForUpdate()->findOrFail($id);
            abort_unless(Category::whereKey($product->category_id)->exists(), 409, 'Hãy khôi phục danh mục trước khi khôi phục sản phẩm.');
            if ($product->brand_id) {
                abort_unless(Brand::whereKey($product->brand_id)->exists(), 409, 'Hãy khôi phục thương hiệu trước khi khôi phục sản phẩm.');
            }
            $product->restore();
            return $product->load(['category', 'brand', 'images', 'sizes']);
        });
        return new ProductResource($product);
    }

    public function forceDelete(string $id)
    {
        $paths = DB::transaction(function () use ($id) {
            $product = Product::onlyTrashed()->lockForUpdate()->findOrFail($id);
            abort_if(CartItem::where('product_id', $id)->exists(), 409, 'Sản phẩm còn trong giỏ hàng, không thể xóa vĩnh viễn.');
            $paths = array_merge([$product->thumbnail], $product->images()->withTrashed()->pluck('image_url')->all());
            $product->sizes()->withTrashed()->forceDelete();
            $product->images()->withTrashed()->forceDelete();
            $product->forceDelete();
            return $paths;
        });
        $this->deleteUnusedImages($paths);
        return response()->json(['message' => 'Xóa sản phẩm vĩnh viễn thành công.']);
    }

    private function deleteUnusedImages(array $paths): void
    {
        foreach (array_unique($paths) as $path) {
            if (!$path || !Str::startsWith($path, 'products/') || str_contains($path, '..')) continue;
            if (Product::withTrashed()->where('thumbnail', $path)->exists()) continue;
            if (ProductImage::withTrashed()->where('image_url', $path)->exists()) continue;
            Storage::disk('public')->delete($path);
        }
    }
}
