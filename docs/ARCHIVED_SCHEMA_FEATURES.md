# TÀI LIỆU LƯU TRỮ CÁC TÍNH NĂNG / BẢNG CSDL TẠM BỎ (SCHEMA ARCHIVE)

> **Mục đích:** File này lưu trữ toàn bộ các bảng, trường và cấu trúc cơ sở dữ liệu đã được tinh giản hoặc tạm thời bỏ ra khỏi `docs/thltweb_huy_tuyet.sql`. Khi nào bạn cần mở rộng hoặc khôi phục lại tính năng nào, chỉ cần lấy lại mã SQL từ đây.

---

## 1. Tính năng: Cấu hình hệ thống động (`system_configs`)
- **Mục đích:** Lưu trữ các thông số cài đặt website động từ trang Admin (ví dụ: Logo website, Favicon, Tên website, Hotline, Email liên hệ, Địa chỉ shop, Fanpage...).
- **Lý do tạm bỏ:** Chưa cần đổi icon / tên website động từ database, có thể hardcode hoặc cấu hình qua file `.env` / `config/` của Laravel trước.
- **Mã SQL khôi phục:**
```sql
CREATE TABLE `system_configs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `config_key` VARCHAR(50) NOT NULL UNIQUE,
    `config_value` TEXT NULL,
    `description` VARCHAR(255) NULL
);

-- Dữ liệu mẫu gợi ý khi khôi phục:
-- INSERT INTO `system_configs` (`config_key`, `config_value`, `description`) VALUES
-- ('site_name', 'Huy Tuyet Fashion Rental', 'Tên website hiển thị'),
-- ('site_logo', '/images/logo.png', 'Đường dẫn ảnh logo'),
-- ('site_favicon', '/favicon.ico', 'Icon website'),
-- ('hotline', '0901234567', 'Số điện thoại hotline'),
-- ('contact_email', 'contact@huytuyet.vn', 'Email liên hệ');
```

---

## 2. Tính năng: Biến thể sản phẩm chuyên sâu (`product_variants`)
- **Mục đích:** Quản lý sản phẩm đa biến thể phức tạp (kết hợp đồng thời nhiều thuộc tính: Size, Màu sắc, Tình trạng đồ 95%/99%, Mã SKU riêng từng biến thể, Tồn kho riêng).
- **Lý do tạm bỏ:** Đang thay thế bằng bảng tinh giản `product_sizes` (chỉ quản lý Size + Tồn kho) để dễ lập trình trước.
- **Mã SQL khôi phục:**
```sql
CREATE TABLE `product_variants` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `sku` VARCHAR(50) NOT NULL UNIQUE,
    `size` VARCHAR(20) NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `condition_note` VARCHAR(100) DEFAULT '99% New',
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
);

-- Khi khôi phục bảng này, các bảng sau sẽ cập nhật khóa ngoại trỏ về `product_variants`:
-- 1. order_items: Đổi `product_size_id` -> `product_variant_id` (trỏ đến `product_variants(id)`)
-- 2. stock_receipt_details: Đổi `product_size_id` -> `product_variant_id` (trỏ đến `product_variants(id)`)
```

---

## 3. Nhật ký các lần tinh giản (Change Log)
| Thời gian | Thay đổi | Trạng thái hiện tại |
| :--- | :--- | :--- |
| 19/09/2026 | Tạm bỏ `product_variants`, thay bằng `product_sizes` | Đã lưu trữ tại Mục 2 |
| 19/09/2026 | Đồng bộ `password_resets` $\rightarrow$ `password_reset_tokens` (chuẩn Laravel 12) | Đã áp dụng |
| 19/09/2026 | Tạm bỏ bảng `system_configs` | Đã lưu trữ tại Mục 1 |
