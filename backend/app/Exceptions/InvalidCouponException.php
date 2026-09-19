<?php

namespace App\Exceptions;

/**
 * Mã giảm giá không áp được — một trong 4 điều kiện của BR-20 không thoả.
 *
 * Mỗi lý do có một factory riêng để thông báo nói đúng chỗ sai,
 * thay vì chỉ "mã không hợp lệ".
 */
class InvalidCouponException extends BusinessException
{
    protected int $status = 422;

    public function __construct(string $message, protected string $reason = 'INVALID')
    {
        $this->errors = ['coupon_code' => [$message]];

        parent::__construct($message);
    }

    public static function notFound(string $code): self
    {
        return new self("Mã giảm giá \"{$code}\" không tồn tại.", 'NOT_FOUND');
    }

    public static function inactive(): self
    {
        return new self('Mã giảm giá này đang tắt.', 'INACTIVE');
    }

    public static function notStarted(): self
    {
        return new self('Mã giảm giá chưa tới ngày bắt đầu áp dụng.', 'NOT_STARTED');
    }

    public static function expired(): self
    {
        return new self('Mã giảm giá đã hết hạn.', 'EXPIRED');
    }

    public static function usedUp(): self
    {
        return new self('Mã giảm giá đã hết lượt sử dụng.', 'USED_UP');
    }

    public static function belowMinimum(string $minimum): self
    {
        return new self(
            "Đơn thuê chưa đạt giá trị tối thiểu {$minimum} để áp mã này.",
            'BELOW_MINIMUM'
        );
    }

    public function errorCode(): string
    {
        return 'INVALID_COUPON';
    }

    public function reason(): string
    {
        return $this->reason;
    }
}
