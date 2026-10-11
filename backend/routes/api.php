<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
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

Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');

Route::prefix('cart')->as('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/', [CartController::class, 'store'])->name('store');
    Route::post('/add', [CartController::class, 'store'])->name('add');
    Route::put('/{id}', [CartController::class, 'update'])->name('update');
    Route::delete('/clear', [CartController::class, 'clear'])->name('clear');
    Route::delete('/{id}', [CartController::class, 'destroy'])->name('destroy');
});

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1')
    ->name('register');

// Admin
Route::prefix('admin')->as('admin.')->group(function () {
    Route::post('login', [AuthController::class, 'adminLogin'])->middleware('throttle:5,1');

    Route::get('categories', [CategoryController::class, 'adminIndex'])->name('categories.index');
    Route::get('categories/parents', [CategoryController::class, 'parentOptions'])->name('categories.parents');
    Route::get('categories/trash', [CategoryController::class, 'trash'])->name('categories.trash');
    Route::patch('categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
    Route::delete('categories/{id}/force', [CategoryController::class, 'forceDelete'])->name('categories.force-delete');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('categories/{category}', [CategoryController::class, 'adminShow'])->name('categories.show');
    Route::patch('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'softDelete'])->name('categories.destroy');

    Route::middleware(['auth:sanctum', CheckAdmin::class])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);


    });

    Route::prefix('products')->as('products.')->group(function () {
        Route::get('/', [ProductController::class, 'adminIndex'])->name('index');
        Route::get('/options', [ProductController::class, 'formOptions'])->name('options');
        Route::get('/trash', [ProductController::class, 'trash'])->name('trash');
        Route::patch('/{id}/restore', [ProductController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force', [ProductController::class, 'forceDelete'])->name('force-delete');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::get('/{product}', [ProductController::class, 'adminShow'])->name('show');
        Route::patch('/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('brands')->as('brands.')->group(function () {
        Route::get('/', [BrandController::class, 'index'])->name('index');
        Route::post('/', [BrandController::class, 'store'])->name('store');
        Route::get('/trash', [BrandController::class, 'trash'])->name('trash');
        Route::patch('/{id}/restore', [BrandController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force', [BrandController::class, 'forceDelete'])->name('force-delete');
        Route::get('/{brand}', [BrandController::class, 'show'])->name('show');
        Route::patch('/{brand}', [BrandController::class, 'update'])->name('update');
        Route::delete('/{brand}', [BrandController::class, 'destroy'])->name('destroy');
    });
});
