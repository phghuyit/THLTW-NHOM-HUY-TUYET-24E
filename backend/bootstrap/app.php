<?php

use App\Exceptions\BusinessException;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api/v1',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Toàn bộ lỗi của nhóm route api trả JSON theo đúng định dạng §7:
        //   { "message": ..., "errors": { ... }, "code": "..." }
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            // Lỗi nghiệp vụ tự định nghĩa: OUT_OF_STOCK, INVALID_COUPON...
            if ($e instanceof BusinessException) {
                return response()->json(array_filter([
                    'message' => $e->getMessage(),
                    'errors' => $e->errors() ?: null,
                    'code' => $e->errorCode(),
                ]), $e->status());
            }

            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => 'Dữ liệu gửi lên không hợp lệ.',
                    'errors' => $e->errors(),
                    'code' => 'VALIDATION_ERROR',
                ], 422);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'message' => 'Bạn cần đăng nhập để thực hiện thao tác này.',
                    'code' => 'UNAUTHENTICATED',
                ], 401);
            }

            if ($e instanceof AuthorizationException) {
                return response()->json([
                    'message' => 'Bạn không có quyền thực hiện thao tác này.',
                    'code' => 'FORBIDDEN',
                ], 403);
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->json([
                    'message' => 'Không tìm thấy dữ liệu yêu cầu.',
                    'code' => 'NOT_FOUND',
                ], 404);
            }

            if ($e instanceof HttpExceptionInterface) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'Yêu cầu không thực hiện được.',
                    'code' => 'HTTP_ERROR',
                ], $e->getStatusCode());
            }

            // Lỗi ngoài dự kiến: chỉ lộ chi tiết khi APP_DEBUG=true.
            return response()->json(array_filter([
                'message' => config('app.debug')
                    ? $e->getMessage()
                    : 'Hệ thống gặp sự cố, vui lòng thử lại sau.',
                'code' => 'SERVER_ERROR',
                'exception' => config('app.debug') ? $e::class : null,
            ]), 500);
        });
    })->create();
