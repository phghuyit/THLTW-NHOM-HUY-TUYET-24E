<?php

namespace App\Enums\Concerns;

/**
 * Tiện ích dùng chung cho mọi backed enum của hệ thống.
 *
 * values()  — danh sách giá trị thô, dùng cho migration enum() và validation in:...
 * options() — danh sách {value, label} để đổ dropdown phía admin.
 */
trait HasValues
{
    /** @return array<int, string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** @return array<int, array{value: string, label: string}> */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
