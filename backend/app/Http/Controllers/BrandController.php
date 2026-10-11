<?php

namespace App\Http\Controllers;

use App\Http\Resources\Brand\BrandResource;
use App\Http\Requests\Brand\StoreBrandRequest;
use App\Http\Requests\Brand\UpdateBrandRequest;
use App\Models\Brand;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::query()
        
        ->orderByDesc('id')
        ->paginate(12);

        return BrandResource::collection($brands);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request)
    {
        $data = $request->validated();
        $logoPath = null;

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('brands', 'public');
            if ($logoPath === false) {
                abort(500, 'Không lưu được ảnh logo.');
            }
            $data['logo'] = $logoPath;
        }

        try {
            $brand = Brand::create($data);
        } catch (\Throwable $error) {
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            throw $error;
        }

        return (new BrandResource($brand))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        return new BrandResource($brand);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $data = $request->validated();
        $oldLogo = $brand->logo;
        $logoPath = null;
        unset($data['logo']);

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('brands', 'public');
            if ($logoPath === false) {
                abort(500, 'Không lưu được ảnh logo.');
            }
            $data['logo'] = $logoPath;
        }

        try {
            $brand->update($data);
        } catch (\Throwable $error) {
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            throw $error;
        }

        if ($logoPath && $oldLogo && str_starts_with($oldLogo, 'brands/')
            && !Brand::withTrashed()->where('logo', $oldLogo)->exists()) {
            Storage::disk('public')->delete($oldLogo);
        }

        return new BrandResource($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();

        return response()->json(['message' => 'Đã chuyển thương hiệu vào thùng rác.']);
    }

    public function trash()
    {
        $brands = Brand::onlyTrashed()->orderByDesc('deleted_at')->orderByDesc('id')->paginate(12);

        return BrandResource::collection($brands);
    }

    public function restore($id)
    {
        $brand = Brand::onlyTrashed()->findOrFail($id);
        $brand->restore();

        return new BrandResource($brand);
    }

    public function forceDelete($id)
    {
        $logo = DB::transaction(function () use ($id) {
            $brand = Brand::onlyTrashed()->lockForUpdate()->findOrFail($id);

            if (Product::withTrashed()->where('brand_id', $brand->id)->exists()) {
                abort(409, 'Không thể xóa vĩnh viễn vì thương hiệu còn được sản phẩm sử dụng, kể cả sản phẩm đã xóa mềm.');
            }

            $logo = $brand->logo;
            $brand->forceDelete();

            return $logo;
        });

        if ($logo && str_starts_with($logo, 'brands/')
            && !Brand::withTrashed()->where('logo', $logo)->exists()) {
            Storage::disk('public')->delete($logo);
        }

        return response()->json(['message' => 'Đã xóa vĩnh viễn thương hiệu.']);
    }
}
