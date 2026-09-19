<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Chặn route theo vai trò — alias "role", dùng như middleware('role:admin') (§2.2, §7.4).
 *
 * Kiểm tra trực tiếp cột users.role, không qua bảng role trung gian.
 * Đặt SAU auth:sanctum trong chuỗi middleware.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next, string $role = UserRole::Admin->value): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json([
                'message' => 'Bạn cần đăng nhập để thực hiện thao tác này.',
                'code' => 'UNAUTHENTICATED',
            ], 401);
        }

        if ($user->status !== UserStatus::Active) {
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị khoá.',
                'code' => 'ACCOUNT_LOCKED',
            ], 403);
        }

        if ($user->role?->value !== $role) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện thao tác này.',
                'code' => 'FORBIDDEN',
            ], 403);
        }

        return $next($request);
    }
}
