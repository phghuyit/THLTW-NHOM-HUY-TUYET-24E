<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Products (Client)
Route::prefix('products')->as('products.')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/{slug}', [ProductController::class, 'show'])->name('show');
});

// Categories (Client)
Route::prefix('categories')->as('categories.')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('index');
    Route::get('/{slug}', [CategoryController::class, 'show'])->name('show');
});

// Brands (Client)
Route::prefix('brands')->as('brands.')->group(function () {
    Route::get('/', [BrandController::class, 'index'])->name('index');
    Route::get('/{slug}', [BrandController::class, 'show'])->name('show');
});

// Banners
Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');

// Authenticated User Profile
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum')->name('user.profile');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->as('admin.')->group(function () {
    // Admin Products & Trash Management
    Route::get('products/trash', [ProductController::class, 'trash'])->name('products.trash');
    Route::patch('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
    Route::delete('products/{id}/force', [ProductController::class, 'forceDelete'])->name('products.force-delete');
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Admin Categories
    Route::prefix('categories')->as('categories.')->group(function () {
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::patch('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoryController::class, 'softDelete'])->name('destroy');
        Route::delete('/{id}/force', [CategoryController::class, 'forceDelete'])->name('force-delete');
    });

    // Admin Brands
    Route::prefix('brands')->as('brands.')->group(function () {
        Route::post('/', [BrandController::class, 'store'])->name('store');
        Route::patch('/{brand}', [BrandController::class, 'update'])->name('update');
        Route::delete('/{brand}', [BrandController::class, 'softDelete'])->name('destroy');
        Route::delete('/{id}/force', [BrandController::class, 'forceDelete'])->name('force-delete');
    });
});
