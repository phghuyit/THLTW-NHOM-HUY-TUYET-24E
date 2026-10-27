<?php

use App\Http\Controllers\AuthController;
use App\Http\Resources\User\LoginUserResource;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VNPayController;
use App\Http\Middleware\CheckAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('products')->as('products.')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/{slug}', [ProductController::class, 'show'])->name('show');
});

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'profile']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/profile/password', [UserController::class, 'changePassword']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);

    Route::prefix('cart')->as('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/', [CartController::class, 'store'])->name('store');
        Route::post('/add', [CartController::class, 'store'])->name('add');
        Route::put('/{id}', [CartController::class, 'update'])->name('update');
        Route::delete('/clear', [CartController::class, 'clear'])->name('clear');
        Route::delete('/{id}', [CartController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('orders')->as('orders.')->group(function () {
        Route::post('/', [OrderController::class, 'store'])->name('store');
        Route::get('/{code}', [OrderController::class, 'show'])->name('show');
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

Route::prefix('reviews')->as('reviews.')->group(function () {
    Route::get('/', [ReviewController::class, 'index'])->name('index');
    Route::post('/', [ReviewController::class, 'store'])->name('store');
});

Route::prefix('posts')->as('posts.')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('index');
    Route::get('/hot', [PostController::class, 'hot'])->name('hot');
    Route::get('/categories', [PostController::class, 'categories'])->name('categories');
    Route::get('/{slug}', [PostController::class, 'show'])->name('show');
});

Route::prefix('menus')->as('menus.')->group(function () {
    Route::get('/', [MenuController::class, 'index'])->name('index');
});

Route::prefix('payment')->as('payment.')->group(function () {
    Route::post('/vnpay/create', [VNPayController::class, 'createPaymentUrl'])->name('vnpay.create');
    Route::get('/vnpay/ipn', [VNPayController::class, 'handleIPN'])->name('vnpay.ipn');
});

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1')
    ->name('register');


Route::prefix('admin')->as('admin.')->group(function () {
    Route::post('login', [AuthController::class, 'adminLogin'])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', CheckAdmin::class])->group(function () {
        Route::get('me', function (Request $request) {
            return new LoginUserResource($request->user());
        });

        Route::prefix('orders')->as('orders.')->group(function () {
            Route::get('/trash', [OrderController::class, 'trash'])->name('trash');
            Route::patch('/{id}/restore', [OrderController::class, 'restore'])->name('restore');
            Route::delete('/{id}/force', [OrderController::class, 'forceDelete'])->name('force-delete');
            Route::get('/', [OrderController::class, 'index'])->name('index');
            Route::patch('/{code}', [OrderController::class, 'updateStatus'])->name('update-status');
            Route::get('/{code}', [OrderController::class, 'show'])->name('show');
        });

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

        Route::get('products/trash', [ProductController::class, 'trash'])->name('products.trash');
        Route::patch('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
        Route::delete('products/{id}/force', [ProductController::class, 'forceDelete'])->name('products.force-delete');
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);

        Route::prefix('reviews')->as('reviews.')->group(function () {
            Route::get('/', [ReviewController::class, 'adminIndex'])->name('index');
            Route::patch('/{review}/status', [ReviewController::class, 'updateStatus'])->name('update-status');
            Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('posts')->as('posts.')->group(function () {
            Route::get('/', [PostController::class, 'adminIndex'])->name('index');
            Route::post('/', [PostController::class, 'store'])->name('store');
            Route::get('/{id}', [PostController::class, 'adminShow'])->name('show');
            Route::put('/{post}', [PostController::class, 'update'])->name('update');
            Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy');
            Route::post('/categories', [PostController::class, 'storeCategory'])->name('categories.store');
            Route::put('/categories/{postCategory}', [PostController::class, 'updateCategory'])->name('categories.update');
            Route::delete('/categories/{postCategory}', [PostController::class, 'destroyCategory'])->name('categories.destroy');
        });

        Route::prefix('menus')->as('menus.')->group(function () {
            Route::get('/', [MenuController::class, 'adminIndex'])->name('index');
            Route::post('/', [MenuController::class, 'store'])->name('store');
            Route::post('/order', [MenuController::class, 'updateOrder'])->name('order');
            Route::get('/{id}', [MenuController::class, 'show'])->name('show');
            Route::put('/{menu}', [MenuController::class, 'update'])->name('update');
            Route::delete('/{menu}', [MenuController::class, 'destroy'])->name('destroy');
        });

        Route::post('logout', [AuthController::class, 'logout']);

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
