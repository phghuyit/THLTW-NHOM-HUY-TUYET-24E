<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;
use Illuminate\Validation\Rule;
use Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('status', 'active')
            ->orderBy('parent_id')
            ->orderBy('name')
            ->paginate(12);
        return CategoryResource::collection($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);
        validator($data, [
            'slug' => 'required|string|max:120|unique:categories,slug',
        ])->validate();
        $categories = Category::create($data);
        $categories->refresh();
        return (new CategoryResource($categories))
            ->response()
            ->setStatusCode(201);
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
            ])->validate();
        }
        $category->update($data);
        return new CategoryResource($category);

    }

    public function softDelete(Category $category)
    {
        if (
            $category->children()->exists() || $category->products()->exists()
        ) {
            return response()->json([
                'message' => 'Hãy chuyển danh mục con và sản phẩm sang danh mục khác trước khi xóa',
            ], 409);
        }
        $category->delete();
        return response()->noContent();
    }
    public function forceDelete(string $id)
    {
        $category = Category::onlyTrashed()->findOrFail($id);

        if (
            $category->children()->withTrashed()->exists() ||
            $category->products()->exists()
        ) {
            return response()->json([
                'message' => 'Không thể xóa vĩnh viễn khi còn danh mục con hoặc sản phẩm.',
            ], 409);
        }

        $category->forceDelete();

        return response()->noContent();
    }
}

