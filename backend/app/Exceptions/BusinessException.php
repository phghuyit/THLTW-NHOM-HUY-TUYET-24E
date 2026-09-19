<?php

namespace App\Exceptions;

use Exception;

/**
 * Lỗi nghiệp vụ có thể hiển thị thẳng cho người dùng.
 *
 * Handler ở bootstrap/app.php bắt lớp này và trả về JSON đúng định dạng §7:
 *   { "message": ..., "errors": { ... }, "code": "..." }
 */
abstract class BusinessException extends Exception
{
    /** @var array<string, array<int, string>> */
    protected array $errors = [];

    protected int $status = 422;

    /** Mã lỗi dạng chuỗi để frontend bắt, ví dụ OUT_OF_STOCK. */
    abstract public function errorCode(): string;

    /** @return array<string, array<int, string>> */
    public function errors(): array
    {
        return $this->errors;
    }

    public function status(): int
    {
        return $this->status;
    }
}
