<?php

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Loại phiếu kho — cột stock_receipts.receipt_type (UC-15).
 *
 * Import: nhập đồ mới, cộng stock_quantity.
 * Export: xuất huỷ đồ hỏng / mất, trừ stock_quantity (BR-33).
 */
enum ReceiptType: string
{
    use HasValues;

    case Import = 'import';
    case Export = 'export';

    public function label(): string
    {
        return match ($this) {
            self::Import => 'Phiếu nhập kho',
            self::Export => 'Phiếu xuất huỷ',
        };
    }

    /** Tiền tố mã phiếu: PNK-2026-001 / PXK-2026-001. */
    public function codePrefix(): string
    {
        return $this === self::Import ? 'PNK' : 'PXK';
    }

    /** Dấu tác động lên tồn kho: nhập (+1), xuất (-1). */
    public function stockSign(): int
    {
        return $this === self::Import ? 1 : -1;
    }
}
