<?php

use App\Http\Controllers\BannerController;
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

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

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
    // Trash Management
    Route::get('products/trash', [ProductController::class, 'trash'])->name('products.trash');
    Route::patch('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
    Route::delete('products/{id}/force', [ProductController::class, 'forceDelete'])->name('products.force-delete');

    // Admin Products
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
});
