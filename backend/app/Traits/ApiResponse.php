<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Định dạng phản hồi JSON thống nhất cho toàn bộ API (§7).
 *
 * Thành công:  { "data": ..., "message": ... }
 * Thất bại:    { "message": ..., "errors": { ... }, "code": "..." }
 *
 * Dùng trong controller: use ApiResponse; rồi $this->ok($data).
 */
trait ApiResponse
{
    protected function ok(mixed $data = null, ?string $message = null, int $status = 200): JsonResponse
    {
        $payload = ['data' => $data];

        if ($message !== null) {
            $payload['message'] = $message;
        }

        return response()->json($payload, $status);
    }

    protected function created(mixed $data = null, ?string $message = null): JsonResponse
    {
        return $this->ok($data, $message, 201);
    }

    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    /**
     * @param  array<string, array<int, string>>  $errors
     */
    protected function fail(
        string $message,
        array $errors = [],
        ?string $code = null,
        int $status = 422
    ): JsonResponse {
        $payload = ['message' => $message];

        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        if ($code !== null) {
            $payload['code'] = $code;
        }

        return response()->json($payload, $status);
    }
}
