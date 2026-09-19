<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API routes — prefix /api/v1 (đặt ở bootstrap/app.php)
|--------------------------------------------------------------------------
|
| Chia 3 nhóm theo §7 của đặc tả:
|   7.1  Public    — không cần đăng nhập
|   7.2  Customer  — auth:sanctum
|   7.3  Webhook   — không auth, verify chữ ký VNPay
|   7.4  Admin     — auth:sanctum + role:admin
|
| Controller sẽ được gắn dần theo từng lô. Lô 0 chỉ dựng khung + route
| kiểm tra sức khoẻ để xác nhận tầng API chạy.
|
*/

Route::get('/ping', fn () => response()->json([
    'data' => [
        'app' => config('app.name'),
        'timezone' => config('app.timezone'),
        'time' => now()->toDateTimeString(),
    ],
]));

/*
|--------------------------------------------------------------------------
| 7.1 — Public
|--------------------------------------------------------------------------
*/
Route::prefix('/')->group(function (): void {
    // Lô 2 — Auth
    // Route::post('auth/register', [RegisterController::class, 'store']);
    // Route::post('auth/login', [LoginController::class, 'store']);
    // Route::post('auth/forgot-password', [PasswordResetController::class, 'sendLink']);
    // Route::post('auth/reset-password', [PasswordResetController::class, 'reset']);

    // Lô 3 — Catalog & nội dung
    // Route::get('configs', ConfigController::class);
    // Route::get('menus', MenuController::class);
    // Route::get('banners', BannerController::class);
    // Route::get('categories', [CategoryController::class, 'index']);
    // Route::get('brands', [BrandController::class, 'index']);
    // Route::get('products', [ProductController::class, 'index']);
    // Route::get('products/{slug}', [ProductController::class, 'show']);
    // Route::get('products/{slug}/variants', [ProductController::class, 'variants']);
    // Route::get('products/{slug}/reviews', [ReviewController::class, 'index']);
    // Route::get('posts', [PostController::class, 'index']);
    // Route::get('posts/{slug}', [PostController::class, 'show']);
    // Route::get('post-categories', [PostCategoryController::class, 'index']);
    // Route::get('pages/{slug}', [PageController::class, 'show']);
    // Route::post('contacts', [ContactController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| 7.2 — Customer (đã đăng nhập)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('me', fn (Request $request) => response()->json(['data' => $request->user()]));

    // Lô 2 — Tài khoản
    // Route::post('auth/logout', [LoginController::class, 'destroy']);
    // Route::put('me', [ProfileController::class, 'update']);
    // Route::put('me/password', [ProfileController::class, 'updatePassword']);

    // Lô 4 — Tính tiền giỏ thuê
    // Route::post('cart/quote', CartQuoteController::class);
    // Route::post('coupons/validate', [CouponController::class, 'check']);

    // Lô 5 — Đơn thuê
    // Route::post('orders', [OrderController::class, 'store']);
    // Route::get('orders', [OrderController::class, 'index']);
    // Route::get('orders/{order_code}', [OrderController::class, 'show']);
    // Route::post('orders/{order_code}/cancel', [OrderController::class, 'cancel']);

    // Lô 6 — Thanh toán
    // Route::post('orders/{order_code}/pay', [PaymentController::class, 'create']);

    // Lô 8 — Đánh giá
    // Route::post('products/{product}/reviews', [ReviewController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| 7.3 — Webhook VNPay (không auth, verify vnp_SecureHash — BR-18)
|--------------------------------------------------------------------------
|
| Chỉ IPN mới được đổi trạng thái đơn. Return URL chỉ để điều hướng giao diện.
|
*/
Route::prefix('payments/vnpay')->group(function (): void {
    // Lô 6
    // Route::get('return', [VnpayController::class, 'return']);
    // Route::get('ipn', [VnpayController::class, 'ipn']);
});

/*
|--------------------------------------------------------------------------
| 7.4 — Admin
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function (): void {
    // Lô 3 — Catalog
    // Route::apiResource('categories', Admin\CategoryController::class);
    // Route::apiResource('brands', Admin\BrandController::class);
    // Route::apiResource('products', Admin\ProductController::class);
    // Route::apiResource('products.variants', Admin\VariantController::class);
    // Route::post('products/{product}/images', [Admin\ProductImageController::class, 'store']);

    // Lô 5 — Đơn thuê
    // Route::get('orders', [Admin\OrderController::class, 'index']);
    // Route::get('orders/overdue', [Admin\OrderController::class, 'overdue']);
    // Route::get('orders/{order_code}', [Admin\OrderController::class, 'show']);
    // Route::put('orders/{order_code}/status', [Admin\OrderController::class, 'updateStatus']);
    // Route::post('orders/{order_code}/payments', [Admin\OrderController::class, 'recordPayment']);

    // Lô 7 — Trả đồ & quyết toán cọc
    // Route::post('orders/{order_code}/return', [Admin\RentalReturnController::class, 'store']);

    // Lô 8 — Kho
    // Route::get('stock/variants', [Admin\StockController::class, 'variants']);
    // Route::apiResource('stock-receipts', Admin\StockReceiptController::class)->only(['index', 'store', 'show']);

    // Lô 8 — Khuyến mãi, đánh giá, liên hệ, nội dung, hệ thống
    // Route::apiResource('coupons', Admin\CouponController::class);
    // Route::apiResource('reviews', Admin\ReviewController::class)->only(['index', 'update', 'destroy']);
    // Route::get('contacts', [Admin\ContactController::class, 'index']);
    // Route::put('contacts/{contact}/reply', [Admin\ContactController::class, 'reply']);
    // Route::apiResource('post-categories', Admin\PostCategoryController::class);
    // Route::apiResource('posts', Admin\PostController::class);
    // Route::apiResource('pages', Admin\PageController::class);
    // Route::apiResource('banners', Admin\BannerController::class);
    // Route::apiResource('menus', Admin\MenuController::class);
    // Route::get('users', [Admin\UserController::class, 'index']);
    // Route::put('users/{user}/status', [Admin\UserController::class, 'updateStatus']);
    // Route::get('configs', [Admin\ConfigController::class, 'index']);
    // Route::put('configs', [Admin\ConfigController::class, 'update']);

    // Lô 9 — Báo cáo
    // Route::get('reports/dashboard', [Admin\ReportController::class, 'dashboard']);
    // Route::get('reports/revenue', [Admin\ReportController::class, 'revenue']);
    // Route::get('reports/top-products', [Admin\ReportController::class, 'topProducts']);
    // Route::get('reports/stock', [Admin\ReportController::class, 'stock']);
});
