<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use App\Http\Resources\Category\CategoryResource;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('status', 'active')
            ->orderBy('parent_id')
            ->orderBy('name')
            ->paginate(2);
        return CategoryResource::collection($categories);
    }

    public function adminIndex()
    {
        $categories = Category::query()
            ->with('parent:id,name')
            ->withCount('products')
            ->orderByDesc('id')
            ->paginate(12);

        return CategoryResource::collection($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);
        validator($data, [
            'slug' => 'required|string|max:120|unique:categories,slug',
        ], [
            'slug.required' => 'Tên danh mục phải có chữ hoặc số để tạo slug.',
            'slug.max' => 'Slug tạo từ tên quá dài. Hãy nhập tên ngắn hơn.',
            'slug.unique' => 'Tên này tạo ra slug đã tồn tại. Hãy chọn tên danh mục khác.',
        ])->validate();
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
            if ($imagePath === false) {
                abort(500, 'Không lưu được ảnh danh mục.');
            }
            $data['image'] = $imagePath;
        }

        try {
            $categories = Category::create($data);
        } catch (\Throwable $error) {
            if ($imagePath) Storage::disk('public')->delete($imagePath);
            throw $error;
        }
        $categories->refresh();
        return (new CategoryResource($categories))
            ->response()
            ->setStatusCode(201);
    }

    public function parentOptions()
    {
        return response()->json([
            'data' => Category::query()->orderBy('name')->get(['id', 'name', 'parent_id']),
        ]);
    }

    public function show(string $slug)
    {
        $categories = Category::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return new CategoryResource($categories);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $data = $request->validated();
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);

            validator($data, [
                'slug' => [
                    'required',
                    'string',
                    'max:120',
                    Rule::unique('categories', 'slug')->ignore($category->id),
                ],
            ], [
                'slug.required' => 'Tên danh mục phải có chữ hoặc số để tạo slug.',
                'slug.max' => 'Slug tạo từ tên quá dài. Hãy nhập tên ngắn hơn.',
                'slug.unique' => 'Tên này tạo ra slug đã tồn tại. Hãy chọn tên danh mục khác.',
            ])->validate();
        }
        $oldImage = $category->image;
        $imagePath = null;
        unset($data['image']);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
            if ($imagePath === false) abort(500, 'Không lưu được ảnh danh mục.');
            $data['image'] = $imagePath;
        }

        try {
            $category->update($data);
        } catch (\Throwable $error) {
            if ($imagePath) Storage::disk('public')->delete($imagePath);
            throw $error;
        }

        if ($imagePath && $oldImage && str_starts_with($oldImage, 'categories/')
            && !Category::withTrashed()->where('image', $oldImage)->exists()) {
            Storage::disk('public')->delete($oldImage);
        }

        return new CategoryResource($category);
    }

    public function adminShow(Category $category)
    {
        return new CategoryResource($category);
    }

    public function softDelete(Category $category)
    {
        DB::transaction(function () use ($category) {
            $category = Category::query()->lockForUpdate()->findOrFail($category->id);
            if ($category->children()->exists() || $category->products()->exists()) {
                abort(409, 'Hãy chuyển danh mục con và sản phẩm sang danh mục khác trước khi xóa.');
            }
            $category->delete();
        });

        return response()->json(['message' => 'Đã chuyển danh mục vào thùng rác.']);
    }

    public function trash()
    {
        $categories = Category::onlyTrashed()->orderByDesc('deleted_at')->orderByDesc('id')->paginate(12);

        return CategoryResource::collection($categories);
    }

    public function restore(string $id)
    {
        $category = DB::transaction(function () use ($id) {
            $category = Category::onlyTrashed()->lockForUpdate()->findOrFail($id);
            if ($category->parent_id && !Category::whereKey($category->parent_id)->exists()) {
                abort(409, 'Hãy khôi phục danh mục cha trước khi khôi phục danh mục này.');
            }
            $category->restore();

            return $category;
        });

        return new CategoryResource($category);
    }

    public function forceDelete(string $id)
    {
        $image = DB::transaction(function () use ($id) {
            $category = Category::onlyTrashed()->lockForUpdate()->findOrFail($id);
            if ($category->children()->withTrashed()->exists() || $category->products()->withTrashed()->exists()) {
                abort(409, 'Không thể xóa vĩnh viễn khi còn danh mục con hoặc sản phẩm, kể cả dữ liệu đã xóa mềm.');
            }
            $image = $category->image;
            $category->forceDelete();

            return $image;
        });

        if ($image && str_starts_with($image, 'categories/')
            && !Category::withTrashed()->where('image', $image)->exists()) {
            Storage::disk('public')->delete($image);
        }

        return response()->json(['message' => 'Đã xóa vĩnh viễn danh mục.']);
    }
}
