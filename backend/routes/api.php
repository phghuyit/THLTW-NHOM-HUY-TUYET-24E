<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;

use App\Http\Controllers\ProductController;

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{slug}', [ProductController::class, 'show']);
});


Route::get('/banners', [BannerController::class, 'index']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/admin/categories', [CategoryController::class, 'store']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::patch('/admin/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/admin/categories/{category}', [CategoryController::class, 'softDelete']);
Route::delete('/admin/categories/{id}/force', [CategoryController::class,'forceDelete',]);

Route::get('/brands', [BrandController::class, 'index']);
Route::post('/admin/brands', [BrandController::class, 'store']);
Route::get('/brands/{slug}', [BrandController::class, 'show']);
Route::patch('/admin/brands/{brand}', [BrandController::class, 'update']);
Route::delete('/admin/brands/{brand}', [BrandController::class, 'softDelete']);
Route::delete('/admin/brands/{id}/force', [BrandController::class, 'forceDelete']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('admin')->group(function () {
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
});
