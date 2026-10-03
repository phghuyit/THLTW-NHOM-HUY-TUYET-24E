<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\CheckAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Public
Route::prefix('products')->as('products.')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/{slug}', [ProductController::class, 'show'])->name('show');
});

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
Route::prefix('categories')->as('categories.')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('index');
    Route::get('/{slug}', [CategoryController::class, 'show'])->name('show');
});

Route::prefix('brands')->as('brands.')->group(function () {
    Route::get('/', [BrandController::class, 'index'])->name('index');
    Route::get('/{slug}', [BrandController::class, 'show'])->name('show');
});

Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1')
    ->name('register');

// Admin
Route::prefix('admin')->as('admin.')->group(function () {
    Route::post('login', [AuthController::class, 'adminLogin'])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', CheckAdmin::class])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('products/trash', [ProductController::class, 'trash'])->name('products.trash');
        Route::patch('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
        Route::delete('products/{id}/force', [ProductController::class, 'forceDelete'])->name('products.force-delete');
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);

        Route::prefix('categories')->as('categories.')->group(function () {
            Route::post('/', [CategoryController::class, 'store'])->name('store');
            Route::patch('/{category}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [CategoryController::class, 'softDelete'])->name('destroy');
            Route::delete('/{id}/force', [CategoryController::class, 'forceDelete'])->name('force-delete');
        });

        Route::prefix('brands')->as('brands.')->group(function () {
            Route::post('/', [BrandController::class, 'store'])->name('store');
            Route::patch('/{brand}', [BrandController::class, 'update'])->name('update');
            Route::delete('/{brand}', [BrandController::class, 'softDelete'])->name('destroy');
            Route::delete('/{id}/force', [BrandController::class, 'forceDelete'])->name('force-delete');
        });
    });
});
