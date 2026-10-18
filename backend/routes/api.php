<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
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

    Route::prefix('orders')->as('orders.')->group(function () {
        Route::get('/trash', [OrderController::class, 'trash'])->name('trash');
        Route::patch('/{id}/restore', [OrderController::class, 'restore'])->name('restore');
        Route::delete('/{id}/force', [OrderController::class, 'forceDelete'])->name('force-delete');
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::patch('/{code}', [OrderController::class, 'updateStatus'])->name('update-status');
        Route::get('/{code}', [OrderController::class, 'show'])->name('show');
    });

    Route::middleware(['auth:sanctum', CheckAdmin::class])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('products/trash', [ProductController::class, 'trash'])->name('products.trash');
        Route::patch('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
        Route::delete('products/{id}/force', [ProductController::class, 'forceDelete'])->name('products.force-delete');
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);

        Route::prefix('categories')->as('categories.')->group(function () {
            Route::get('trash', [CategoryController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [CategoryController::class, 'restore'])->name('restore');
            Route::post('/', [CategoryController::class, 'store'])->name('store');
            Route::patch('/{category}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [CategoryController::class, 'softDelete'])->name('destroy');
            Route::delete('/{id}/force', [CategoryController::class, 'forceDelete'])->name('force-delete');
        });

        Route::prefix('brands')->as('brands.')->group(function () {
            Route::get('trash', [BrandController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [BrandController::class, 'restore'])->name('restore');
            Route::post('/', [BrandController::class, 'store'])->name('store');
            Route::patch('/{brand}', [BrandController::class, 'update'])->name('update');
            Route::delete('/{brand}', [BrandController::class, 'softDelete'])->name('destroy');
            Route::delete('/{id}/force', [BrandController::class, 'forceDelete'])->name('force-delete');
        });
        Route::prefix('users')->as('users.')->group(function () {
            Route::get('trash', [UserController::class, 'trash'])->name('trash');
            Route::patch('{id}/restore', [UserController::class, 'restore'])->name('restore');
            Route::delete('{id}/force', [UserController::class, 'forceDelete'])->name('force-delete');
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{id}', [UserController::class, 'show'])->name('show');
            Route::patch('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        });
    });
});
