<?php

namespace App\Exceptions;

use App\Enums\OrderStatus;

/**
 * Chuyển trạng thái đơn không hợp lệ theo bảng §4.1.
 *
 * Ví dụ: nhảy thẳng pending → renting mà bỏ qua bước giao đồ (vốn là bước
 * trừ tồn kho), hoặc đổi trạng thái một đơn đã completed / cancelled.
 */
class InvalidStatusTransitionException extends BusinessException
{
    protected int $status = 422;

    public function __construct(
        protected OrderStatus $from,
        protected OrderStatus $to,
    ) {
        $allowed = array_map(
            fn (OrderStatus $s) => $s->value,
            $from->allowedTransitions()
        );

        $message = $allowed === []
            ? "Đơn đã ở trạng thái kết thúc \"{$from->label()}\", không đổi trạng thái được nữa."
            : sprintf(
                'Không thể chuyển đơn từ "%s" sang "%s". Bước hợp lệ tiếp theo: %s.',
                $from->label(),
                $to->label(),
                implode(', ', $allowed)
            );

        $this->errors = ['order_status' => [$message]];

        parent::__construct($message);
    }

    public function errorCode(): string
    {
        return 'INVALID_STATUS_TRANSITION';
    }

    public function from(): OrderStatus
    {
        return $this->from;
    }

    public function to(): OrderStatus
    {
        return $this->to;
    }
}
