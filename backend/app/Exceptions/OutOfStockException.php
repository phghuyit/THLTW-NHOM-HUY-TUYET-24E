<?php

namespace App\Exceptions;

/**
 * Biến thể không còn đủ tồn kho (BR-02, BR-04).
 *
 * Trả HTTP 409 kèm danh sách SKU đã hết để frontend loại đúng dòng khỏi giỏ.
 */
class OutOfStockException extends BusinessException
{
    protected int $status = 409;

    /**
     * @param  array<int, array{sku: string, requested: int, available: int}>  $items
     */
    public function __construct(protected array $items = [])
    {
        $messages = array_map(
            fn (array $i) => "SKU {$i['sku']}: cần {$i['requested']} bộ, kho chỉ còn {$i['available']} bộ.",
            $items
        );

        $this->errors = ['items' => $messages];

        parent::__construct('Một số sản phẩm không còn đủ hàng cho thuê.');
    }

    public function errorCode(): string
    {
        return 'OUT_OF_STOCK';
    }

    /** @return array<int, array{sku: string, requested: int, available: int}> */
    public function items(): array
    {
        return $this->items;
    }
}
