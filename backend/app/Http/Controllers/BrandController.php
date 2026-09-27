<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use App\Http\Resources\BrandResource;
use App\Http\Requests\StoreBrandRequest;
use Illuminate\Support\Str;
use App\Http\Requests\UpdateBrandRequest;
use Illuminate\Validation\Rule;
class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::where('status', 'active')
            ->orderByDesc('id')
            ->paginate(12);

        return BrandResource::collection($brands);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);
        validator($data, [
            'slug' => 'required|string|max:120|unique:brands,slug',
        ])->validate();
        $brand = Brand::create($data);
        $brand->refresh();
        return (new BrandResource($brand))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $brand = Brand::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return new BrandResource($brand);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $data = $request->validated();
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);

            validator($data, [
                'slug' => [
                    'required',
                    'string',
                    'max:120',
                    Rule::unique('brands', 'slug')->ignore($brand->id),
                ],
            ])->validate();
        }
        $brand->update($data);
        return new BrandResource($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function softDelete(Brand $brand)
    {
        $brand->delete();

        return response()->noContent();
    }

    public function forceDelete(string $id){
        $brand = Brand::onlyTrashed()->findOrFail($id);
        $brand->forceDelete();
        return response()->noContent();
    }

    public function trash(){
        $brand = Brand::onlyTrashed()
        ->orderByDesc('deleted_at')
        ->paginate(12);
        return BrandResource::collection($brand);
    }

}
