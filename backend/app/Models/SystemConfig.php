<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Bảng 21: system_configs — Cấu hình website động (Phụ lục A).
 *
 * Bảng không có cột timestamps (theo file SQL).
 *
 * Dùng SystemConfig::get('late_fee_rate', 1.5) ở tầng nghiệp vụ thay vì
 * hardcode con số — admin sửa được qua form mà không phải sửa code.
 */
class SystemConfig extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'config_key',
        'config_value',
        'description',
    ];

    /** Khoá cache gom toàn bộ cấu hình, xoá mỗi khi có bản ghi thay đổi. */
    private const CACHE_KEY = 'system_configs.all';

    /**
     * Toàn bộ cấu hình dạng mảng key => value (đã cache).
     *
     * Đặt tên map() chứ không phải all() để không đè Model::all() của Eloquent.
     *
     * @return array<string, string|null>
     */
    public static function map(): array
    {
        return Cache::rememberForever(
            self::CACHE_KEY,
            fn () => static::query()->pluck('config_value', 'config_key')->all()
        );
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::map()[$key] ?? $default;
    }

    /** Đọc cấu hình dạng số — phí ship, hệ số phạt trễ, ngưỡng tồn thấp... */
    public static function number(string $key, float $default = 0): float
    {
        $value = self::get($key);

        return is_numeric($value) ? (float) $value : $default;
    }

    public static function integer(string $key, int $default = 0): int
    {
        $value = self::get($key);

        return is_numeric($value) ? (int) $value : $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(
            ['config_key' => $key],
            ['config_value' => (string) $value]
        );

        Cache::forget(self::CACHE_KEY);
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }
}
