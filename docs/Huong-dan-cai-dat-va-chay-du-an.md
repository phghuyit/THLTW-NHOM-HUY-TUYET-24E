# HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

**Dự án:** Website cho thuê trang phục (Clothes Rental System)
**Cập nhật:** 15/09/2026 — sau Lô 1 (CSDL + Model)

---

## 1. YÊU CẦU MÔI TRƯỜNG

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| PHP | ≥ 8.2 | Bản đang dùng: 8.2.12 |
| Composer | ≥ 2.0 | Bản đang dùng: 2.9.5 |
| MySQL / MariaDB | MariaDB ≥ 10.4 | Đi kèm XAMPP |
| Node.js | ≥ 20 | Bản đang dùng: 22.x |
| npm | ≥ 10 | |

Kiểm tra nhanh — cả 4 lệnh phải ra số phiên bản:

```bash
php -v && composer -V && node -v && npm -v
```

### Extension PHP bắt buộc

XAMPP đã bật sẵn hầu hết. Kiểm tra bằng:

```bash
php -m
```

Danh sách cần có: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`, `curl`.

Nếu thiếu cái nào, mở `php.ini` của XAMPP (`C:\xampp\php\php.ini`), bỏ dấu `;` ở đầu dòng `extension=<tên>` rồi khởi động lại Apache.

---

## 2. CẤU TRÚC THƯ MỤC

```
THLTW-NHOM-HUY-TUYET-24E/
├── backend/          Laravel 12 — REST API        (cổng 8000)
├── frontend/         Next.js 16 — giao diện khách (cổng 3000)
├── frontend-admin/   Next.js 16 — trang quản trị  (cổng 3001)
└── docs/             Tài liệu đặc tả và hướng dẫn
```

---

## 3. CÀI ĐẶT LẦN ĐẦU

### Bước 1 — Khởi động MySQL trong XAMPP

Mở **XAMPP Control Panel**, bấm **Start** ở dòng **MySQL**. Đợi ô chữ chuyển sang màu xanh.

> Chỉ cần MySQL. Không cần bật Apache vì Laravel dùng server riêng của nó ở bước 4.

### Bước 2 — Tạo cơ sở dữ liệu

Vào <http://localhost/phpmyadmin> → tab **SQL** → dán và chạy:

```sql
CREATE DATABASE IF NOT EXISTS `clothes_rental_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

> **Quan trọng:** chỉ tạo database **rỗng**. Đừng import file `thltweb_huy_tuyet.sql` — toàn bộ bảng sẽ do migration của Laravel dựng ở bước 3. Import trước sẽ đụng nhau.

### Bước 3 — Cài đặt backend

```bash
cd backend
```

```bash
composer install
```

Tạo file cấu hình từ mẫu:

```bash
cp .env.example .env
```

Sinh khoá ứng dụng:

```bash
php artisan key:generate
```

Mở `.env` kiểm tra khối kết nối CSDL — mặc định đã đúng cho XAMPP:

```
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clothes_rental_db
DB_USERNAME=root
DB_PASSWORD=
```

Nếu MySQL của bạn có đặt mật khẩu cho `root`, điền vào `DB_PASSWORD`.

Dựng bảng và nạp dữ liệu mẫu:

```bash
php artisan migrate --seed
```

Kết quả mong đợi: 22 migration chạy `DONE`, sau đó 5 seeder chạy `DONE`.

### Bước 4 — Cài đặt frontend

```bash
cd frontend && npm install
```

```bash
cd frontend-admin && npm install
```

---

## 4. CHẠY DỰ ÁN HẰNG NGÀY

Cần **3 cửa sổ terminal** chạy song song (và MySQL trong XAMPP đang bật).

### Terminal 1 — Backend API

```bash
cd backend && php artisan serve
```

→ <http://localhost:8000>

### Terminal 2 — Giao diện khách

```bash
cd frontend && npm run dev
```

→ <http://localhost:3000>

### Terminal 3 — Trang quản trị

```bash
cd frontend-admin && npm run dev
```

→ <http://localhost:3001>

---

## 5. KIỂM TRA HỆ THỐNG CHẠY ĐÚNG

Sau khi bật backend, mở <http://localhost:8000/api/v1/ping>. Kết quả đúng:

```json
{
  "data": {
    "app": "Clothes Rental System",
    "timezone": "Asia/Ho_Chi_Minh",
    "time": "2026-09-15 21:34:21"
  }
}
```

Nếu thấy JSON này nghĩa là: Laravel chạy, cấu hình nạp đúng, múi giờ đã là giờ Việt Nam.

Kiểm tra thêm hai nhánh lỗi:

| Địa chỉ | Kết quả đúng |
|---|---|
| `/api/v1/me` | HTTP 401 — `{"message":"Bạn cần đăng nhập...","code":"UNAUTHENTICATED"}` |
| `/api/v1/khong-ton-tai` | HTTP 404 — `{"message":"Không tìm thấy dữ liệu yêu cầu.","code":"NOT_FOUND"}` |

---

## 6. TÀI KHOẢN QUẢN TRỊ

| | |
|---|---|
| Email | `admin123@gmail.com` |
| Mật khẩu | `Admin123@` |

Hệ thống chưa seed tài khoản khách hàng nào — sẽ đăng ký qua API sau khi làm xong Lô 2 (Auth).

---

## 7. CÁC LỆNH HAY DÙNG

### Cơ sở dữ liệu

| Việc | Lệnh |
|---|---|
| Xoá sạch và dựng lại toàn bộ CSDL kèm dữ liệu mẫu | `php artisan migrate:fresh --seed` |
| Chỉ chạy migration mới | `php artisan migrate` |
| Chỉ nạp lại dữ liệu mẫu | `php artisan db:seed` |
| Lùi lại migration gần nhất | `php artisan migrate:rollback` |
| Xem trạng thái migration | `php artisan migrate:status` |

> `migrate:fresh` **xoá toàn bộ dữ liệu**. Chỉ dùng khi đang phát triển.

### Dọn cache khi sửa `.env` hoặc `config/`

```bash
php artisan optimize:clear
```

Laravel đọc `.env` một lần rồi cache lại. Sửa `.env` mà quên chạy lệnh này là nguyên nhân phổ biến nhất của kiểu lỗi "tôi sửa rồi mà không thấy đổi gì".

### Xem danh sách route

```bash
php artisan route:list
```

### Chạy test

```bash
php artisan test
```

---

## 8. XỬ LÝ LỖI THƯỜNG GẶP

### `SQLSTATE[HY000] [1049] Unknown database 'clothes_rental_db'`

Chưa tạo database. Quay lại **bước 2**.

### `SQLSTATE[HY000] [2002] No connection could be made`

MySQL trong XAMPP chưa bật, hoặc đang chạy ở cổng khác 3306. Mở XAMPP Control Panel bấm **Start** ở dòng MySQL.

### `php artisan db:show` báo lỗi `performance_schema.session_status doesn't exist`

Đây là **lỗi vô hại**, không phải hỏng kết nối. Lệnh `db:show` truy vấn một bảng chỉ MySQL mới có, MariaDB không có. Kết nối vẫn bình thường — cứ chạy `migrate` như thường.

### `No application encryption key has been specified`

Chưa sinh khoá:

```bash
php artisan key:generate
```

### Đổi `.env` nhưng ứng dụng không nhận

```bash
php artisan optimize:clear
```

### Cổng 3000 đã bị chiếm

Next.js sẽ tự nhảy sang cổng khác và báo trong terminal. Nếu muốn ép cổng cụ thể:

```bash
npm run dev -- -p 3002
```

### `Class "..." not found` sau khi thêm file mới

```bash
composer dump-autoload
```

---

## 9. CÀI ĐẶT LẠI TỪ ĐẦU

Khi CSDL rối hoặc muốn làm sạch hoàn toàn:

```bash
cd backend && php artisan migrate:fresh --seed && php artisan optimize:clear
```

Nếu muốn sạch cả thư viện:

```bash
cd backend && rm -rf vendor && composer install
```

```bash
cd frontend && rm -rf node_modules .next && npm install
```

---

## 10. TÀI LIỆU LIÊN QUAN

| File | Nội dung |
|---|---|
| `docs/Dac-ta-he-thong-cho-thue-trang-phuc.md` | Đặc tả đầy đủ: nghiệp vụ, 22 bảng, API, màn hình, business rules |
| `docs/Phan-cong-task-va-thu-tu-thuc-hien.md` | Danh sách task theo thứ tự làm, phân công 2 người, điểm đồng bộ |
| `docs/Tai-lieu-trien-khai-bao-cao-PTTKHT.md` | Tài liệu báo cáo môn Phân tích & Thiết kế hệ thống |

Phần **§11 Tình trạng triển khai** trong đặc tả ghi rõ lô nào đã xong, lô nào chưa.
