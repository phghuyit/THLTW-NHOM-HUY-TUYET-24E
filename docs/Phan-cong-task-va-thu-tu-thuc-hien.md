# PHÂN CÔNG TASK & THỨ TỰ THỰC HIỆN

**Dự án:** Website cho thuê trang phục (Clothes Rental System)
**Mô hình làm việc:** 2 người, chia theo **tính năng** — mỗi người ôm trọn một tính năng từ API tới giao diện
**Nguyên tắc ưu tiên:** làm **quản trị (admin) trước**, giao diện khách sau
**Cập nhật:** 15/09/2026

---

## CÁCH ĐỌC FILE NÀY

**Mã task**

| Tiền tố | Nghĩa | Thư mục |
|---|---|---|
| `BE-` | Backend Laravel | `backend/` |
| `AD-` | Giao diện quản trị | `frontend-admin/` |
| `FE-` | Giao diện khách | `frontend/` |

**Cột trong bảng**

- **Phụ thuộc** — task này chỉ bắt đầu được khi các task liệt kê đã xong. Ô trống nghĩa là làm được ngay.
- **Người** — gợi ý phân công: `N1` / `N2`. Đây là đề xuất, đổi được miễn giữ nguyên thứ tự và chỗ đồng bộ.
- **Ước lượng** — buổi làm việc (1 buổi ≈ 3–4 tiếng).

**Điểm đồng bộ** 🔄 — mốc cả hai người phải xong phần của mình rồi mới sang giai đoạn sau. Đây là chỗ dễ vỡ kế hoạch nhất, đừng vượt đèn.

**Nguyên tắc chung**

1. Backend của một tính năng luôn xong trước giao diện của chính tính năng đó.
2. Ai làm tính năng nào thì làm luôn cả API lẫn giao diện của tính năng đó — không chia theo tầng.
3. Task quản trị (`AD-`) của một nghiệp vụ luôn đi trước task khách (`FE-`) của cùng nghiệp vụ. Ví dụ: làm xong đăng nhập admin rồi mới làm đăng ký/đăng nhập cho khách.
4. Mỗi task phải chạy được và kiểm tra được trước khi commit. Xem mục **Định nghĩa "xong"** ở cuối file.

---

## TỔNG QUAN GIAI ĐOẠN

| GĐ | Nội dung | Ước lượng | Kết quả demo được |
|---|---|---|---|
| ✅ 0 | Nền Laravel + 22 bảng + Model | Đã xong | API `/ping` chạy, CSDL 24 bảng có dữ liệu mẫu |
| 1 | Nền frontend + Auth | 8 buổi | Đăng nhập admin vào được trang quản trị |
| 2 | Catalog quản trị | 10 buổi | Admin thêm/sửa/xoá sản phẩm, biến thể, ảnh |
| 3 | Catalog công khai + Auth khách | 8 buổi | Khách xem web, đăng ký, đăng nhập |
| 4 | Kho + Khuyến mãi | 6 buổi | Admin lập phiếu nhập/xuất, tạo mã giảm giá |
| 5 | Tính tiền + Đặt đơn | 10 buổi | Khách bỏ giỏ, checkout, tạo đơn thật |
| 6 | Vận hành đơn (admin) | 8 buổi | Admin xác nhận đơn, giao đồ, trừ tồn kho |
| 7 | Thanh toán VNPay | 6 buổi | Thanh toán sandbox, IPN cập nhật đơn |
| 8 | Trả đồ & quyết toán cọc | 6 buổi | Lập biên bản, tính phạt, hoàn cọc |
| 9 | Nội dung + Đánh giá + Liên hệ | 8 buổi | Blog, trang tĩnh, banner, menu, đánh giá |
| 10 | Báo cáo + Hoàn thiện | 6 buổi | Dashboard, báo cáo doanh thu, deploy |

**Tổng ≈ 76 buổi.** Chia 2 người ≈ 38 buổi mỗi người.

---

## GIAI ĐOẠN 1 — NỀN FRONTEND & AUTH

Mục tiêu: **đăng nhập được vào trang quản trị**. Đây là điều kiện để mọi màn admin sau này chạy.

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-01` | API đăng nhập / đăng xuất / lấy hồ sơ | | N1 | 2 |
| `BE-02` | API đăng ký + quên mật khẩu + đặt lại mật khẩu | `BE-01` | N1 | 2 |
| `AD-00` | Dựng nền `frontend-admin` | | N2 | 2 |
| `FE-00` | Dựng nền `frontend` | `AD-00` | N2 | 2 |
| 🔄 | **Đồng bộ:** API auth chạy + hai frontend có nền | | | |
| `AD-01` | Màn đăng nhập quản trị | `BE-01`, `AD-00` | N1 | 1 |
| `AD-02` | Route guard + layout quản trị hoàn chỉnh | `AD-01` | N1 | 2 |
| `FE-01` | Màn đăng ký + đăng nhập khách | `BE-02`, `FE-00` | N2 | 2 |
| `FE-02` | Màn quên mật khẩu + đặt lại mật khẩu | `FE-01` | N2 | 1 |
| `BE-03` | API sửa hồ sơ + đổi mật khẩu | `BE-01` | N1 | 1 |
| `AD-03` | Trang hồ sơ quản trị viên | `BE-03`, `AD-02` | N1 | 1 |

### Chi tiết

**`BE-01` — API đăng nhập**
- `POST /auth/login` → trả Bearer token + thông tin user. Chặn tài khoản `status = locked`.
- `POST /auth/logout` → thu hồi token hiện tại.
- `GET /me` → hồ sơ người đang đăng nhập.
- File: `app/Http/Controllers/Api/V1/Auth/LoginController.php`, `app/Http/Requests/LoginRequest.php`, `app/Http/Resources/UserResource.php`.
- Thử bằng tài khoản seed sẵn: `admin123@gmail.com` / `Admin123@`.

**`BE-02` — Đăng ký & quên mật khẩu**
- `POST /auth/register` → tạo user `role = member`, trả token luôn.
- `POST /auth/forgot-password` → sinh token, ghi bảng `password_resets`, gửi mail.
- `POST /auth/reset-password` → kiểm tra token còn hạn 60 phút (BR-56), đổi mật khẩu, xoá token.
- Lúc phát triển để `MAIL_MAILER=log`, nội dung mail xem ở `storage/logs/laravel.log`.

**`AD-00` — Dựng nền `frontend-admin`**
- `src/lib/api-client.ts`: wrapper `fetch`, tự gắn `Authorization: Bearer`, bắt lỗi theo định dạng `{message, errors, code}` của §7.
- `src/store/auth.ts`: lưu token (localStorage) + thông tin user.
- `src/components/layout/`: `AdminLayout`, `Sidebar`, `Topbar` theo wireframe A01.
- `src/components/ui/`: `Button`, `Input`, `Select`, `Modal`, `DataTable`, `Toast`.
- `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`.

**`FE-00` — Dựng nền `frontend`**
- `api-client.ts` dùng lại y hệt bản của admin.
- `Header` + `Footer` đọc động từ `GET /configs` và `GET /menus` (tạm hardcode, nối API thật ở `FE-03`).
- `src/lib/money.ts` (định dạng VNĐ), `src/lib/date.ts` (tính số ngày thuê).

**`AD-02` — Route guard**
- Chưa đăng nhập → đá về `/login`.
- Đăng nhập nhưng `role !== 'admin'` → trang 403.
- Token hết hạn (API trả 401) → xoá token, về `/login`.

**✅ Xong GĐ 1 khi:** mở `localhost:3001`, đăng nhập bằng tài khoản admin, vào được dashboard rỗng; khách đăng ký được tài khoản mới ở `localhost:3000`.

---

## GIAI ĐOẠN 2 — CATALOG QUẢN TRỊ

Mục tiêu: **admin tự nhập được dữ liệu sản phẩm**, không cần seeder nữa.

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-04` | API CRUD danh mục + thương hiệu | `BE-01` | N1 | 2 |
| `AD-04` | Màn quản lý danh mục (cây đa cấp) | `BE-04`, `AD-02` | N1 | 2 |
| `AD-05` | Màn quản lý thương hiệu | `BE-04` | N1 | 1 |
| `BE-05` | API CRUD sản phẩm | `BE-04` | N2 | 2 |
| `BE-06` | API CRUD biến thể + upload ảnh | `BE-05` | N2 | 2 |
| `AD-06` | Màn danh sách sản phẩm (lọc, phân trang) | `BE-05` | N2 | 2 |
| `AD-07` | Form sửa sản phẩm — tab thông tin / biến thể / ảnh | `BE-06`, `AD-06` | N2 | 3 |

### Chi tiết

**`BE-04`, `BE-05`, `BE-06`**
- Validate slug duy nhất, tự sinh từ tên tiếng Việt bỏ dấu, trùng thì nối số (BR-52).
- Danh mục: chặn chọn chính nó hoặc con cháu làm cha (BR-53).
- Xoá: đổi `status = hidden` thay vì xoá cứng nếu đã phát sinh đơn (BR-54).
- Upload ảnh về `storage/app/public/products`, nhớ chạy `php artisan storage:link` một lần.

**`AD-07` — Form sửa sản phẩm** (wireframe A06)
- Hiển thị tiền cọc tính sẵn ngay dưới ô nhập: `original_value × deposit_rate_percent / 100`.
- Tab biến thể: bảng sửa nhanh, chặn trùng `size + color` (CSDL đã có UNIQUE nhưng phải báo lỗi tử tế ở giao diện).
- Ghi chú rõ cho người dùng: sửa tồn kho trực tiếp ở đây chỉ dùng khi kiểm kê, biến động thường ngày đi qua phiếu kho (GĐ 4).

**✅ Xong GĐ 2 khi:** xoá sạch dữ liệu seed, admin tự tạo lại được 1 danh mục → 1 thương hiệu → 1 sản phẩm → 3 biến thể → 3 ảnh, hoàn toàn qua giao diện.

---

## GIAI ĐOẠN 3 — CATALOG CÔNG KHAI

Mục tiêu: **khách xem được hàng** do admin vừa nhập.

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-07` | API public: configs, menus, banners, categories, brands | `BE-04` | N1 | 1 |
| `BE-08` | API public: danh sách sản phẩm (lọc, sắp xếp, phân trang) | `BE-05` | N1 | 2 |
| `BE-09` | API public: chi tiết sản phẩm + biến thể + tồn kho | `BE-08` | N1 | 1 |
| `FE-03` | Header + Footer nối API thật | `BE-07`, `FE-00` | N2 | 1 |
| `FE-04` | Trang chủ: banner, danh mục, sản phẩm nổi bật | `BE-07`, `FE-03` | N2 | 2 |
| `FE-05` | Trang danh sách + bộ lọc | `BE-08` | N2 | 2 |
| `FE-06` | Trang chi tiết sản phẩm ⭐ | `BE-09`, `FE-05` | N2 | 3 |

### Chi tiết

**`BE-09`** — tăng `view_count` bằng `increment()` chứ đừng đọc rồi cộng rồi lưu (BR-55).

**`FE-06` — Chi tiết sản phẩm** (wireframe S03) — màn khó nhất của giao diện khách:
- Chọn size/màu → gọi lại `/products/{slug}/variants` cập nhật tồn kho, biến thể hết hàng thì làm mờ.
- Chọn ngày thuê: chặn ngày quá khứ, chặn `rent_end_date < rent_start_date`, chặn quá 30 ngày (BR-05).
- **Số ngày tính cả hai đầu** (BR-10) — 01/10 → 03/10 là 3 ngày. Dùng hàm chung ở `lib/date.ts`.
- Hiển thị tiền thuê và **tiền cọc tách riêng**, ghi rõ cọc được hoàn lại. Khách rất hay hiểu nhầm chỗ này.

**✅ Xong GĐ 3 khi:** khách vào `localhost:3000` xem được sản phẩm admin vừa tạo, chọn size/màu/ngày và thấy đúng tiền thuê + tiền cọc.

---

## GIAI ĐOẠN 4 — KHO & KHUYẾN MÃI

Hai tính năng độc lập nhau, hai người làm song song được hoàn toàn.

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-10` | `StockService` + API tồn kho theo biến thể | `BE-06` | N1 | 1 |
| `BE-11` | API phiếu nhập / xuất kho | `BE-10` | N1 | 2 |
| `AD-08` | Màn tồn kho + cảnh báo sắp hết hàng | `BE-10` | N1 | 1 |
| `AD-09` | Form lập phiếu nhập / xuất nhiều dòng | `BE-11`, `AD-08` | N1 | 2 |
| `BE-12` | API CRUD mã giảm giá | `BE-01` | N2 | 1 |
| `AD-10` | Màn quản lý mã giảm giá | `BE-12` | N2 | 2 |

### Chi tiết

**`BE-11` — Phiếu kho** (UC-15)
- Sinh `receipt_code` dạng `PNK-2026-001` / `PXK-2026-001` — tiền tố lấy từ `ReceiptType::codePrefix()`.
- Lưu phiếu + chi tiết + cập nhật `stock_quantity` trong **một transaction**.
- Phiếu `export` làm tồn kho âm → từ chối, báo số tồn hiện tại. CSDL đã có `CHECK` chặn, nhưng phải bắt trước để báo lỗi cho người dùng đọc được.

**`AD-08`** — ngưỡng cảnh báo đọc từ `system_configs.low_stock_threshold` (mặc định 2), đừng hardcode.

**✅ Xong GĐ 4 khi:** lập phiếu nhập 5 bộ → tồn kho tăng đúng 5; lập phiếu xuất vượt tồn → bị từ chối kèm thông báo rõ ràng.

---

## GIAI ĐOẠN 5 — TÍNH TIỀN & ĐẶT ĐƠN ⭐

Phần lõi nhất của đồ án. Làm cẩn thận, viết test trước khi làm giao diện.

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-13` | `PricingService` + unit test ⭐ | `BE-09` | N1 | 2 |
| `BE-14` | `CouponService` + unit test | `BE-12`, `BE-13` | N1 | 2 |
| `BE-15` | `POST /cart/quote` + `POST /coupons/validate` | `BE-14` | N1 | 1 |
| `FE-07` | Giỏ thuê (localStorage + gọi `/cart/quote`) | `BE-15`, `FE-06` | N2 | 3 |
| `FE-08` | Màn checkout | `FE-07` | N2 | 3 |
| 🔄 | **Đồng bộ:** tính tiền đúng ở cả backend lẫn giao diện | | | |
| `BE-16` | `OrderService` tạo đơn trong transaction | `BE-15` | N1 | 2 |
| `BE-17` | API đơn của tôi (danh sách + chi tiết + huỷ) | `BE-16` | N2 | 2 |
| `FE-09` | Màn đơn thuê của tôi | `BE-17` | N2 | 2 |
| `FE-10` | Màn chi tiết đơn thuê | `FE-09` | N2 | 2 |

### Chi tiết

**`BE-13` — `PricingService`** — viết test trước, code sau. Các trường hợp bắt buộc phủ:

```
rental_days  = (int) $start->diffInDays($end) + 1      ← BẮT BUỘC ép (int)
```

> **Bẫy:** Carbon 3 trả **float** từ `diffInDays()`. Không ép kiểu thì `rental_days` thành `3.0`, cột INT vẫn lưu đúng nên lỗi không lộ ra ngay, nhưng mọi so sánh `===` đều sai.

- Thuê cùng ngày → 1 ngày, không phải 0.
- `deposit_per_item = original_value × deposit_rate_percent / 100`, **không nhân số ngày** (BR-11).
- `grand_total = tiền thuê + cọc + ship − giảm giá` (BR-12).
- `shipping_fee = 0` khi `delivery_type = store_pickup`.

**`BE-14` — `CouponService`** — 4 điều kiện của BR-20, mỗi điều kiện một test riêng. Dữ liệu mẫu đã seed sẵn đủ 4 nhánh từ chối: `HETHAN100K`, `HETLUOT30K`, `DANGTAT80K`, và `CUOI200K` để thử chưa đủ đơn tối thiểu.
- `min_order_value` so với **`total_rental_fee`**, không so `grand_total` (BR-13).
- Tăng `used_count` bằng câu lệnh nguyên tử có điều kiện (BR-23).

**`BE-16` — `OrderService`**
- Kiểm tra lại tồn kho ngay trước khi tạo đơn.
- **Tính lại toàn bộ tiền ở backend.** Không tin số tiền frontend gửi lên — khách sửa payload là thuê đồ giá 0đ.
- Sinh `order_code` dạng `ORD2026-001`, duy nhất.
- Tạo `orders` + `order_items` + tăng `used_count` của coupon trong **một transaction**.
- Đơn mới: `order_status = pending`, `payment_status = unpaid`. **Chưa trừ tồn kho** (BR-03).

**`FE-07`** — giỏ lưu `localStorage` nhưng **luôn** gọi `/cart/quote` trước khi hiện tiền. Backend là nguồn sự thật về giá.

**✅ Xong GĐ 5 khi:** khách chọn đồ → bỏ giỏ → áp mã `THUEHE50K` → checkout → đơn xuất hiện trong CSDL với số tiền khớp đúng công thức, và tồn kho **chưa** thay đổi.

---

## GIAI ĐOẠN 6 — VẬN HÀNH ĐƠN (QUẢN TRỊ) ⭐

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-18` | `OrderStatusService` — bảng chuyển trạng thái §4.1 | `BE-16` | N1 | 2 |
| `BE-19` | Trừ / cộng tồn kho khi đổi trạng thái + `lockForUpdate` | `BE-18`, `BE-10` | N1 | 2 |
| `BE-20` | **`StockRaceConditionTest`** ⭐ | `BE-19` | N1 | 1 |
| `BE-21` | API admin: danh sách + chi tiết đơn | `BE-18` | N2 | 2 |
| `AD-11` | Màn danh sách đơn (lọc theo trạng thái, ngày, khách) | `BE-21` | N2 | 2 |
| `AD-12` | Màn chi tiết & xử lý đơn ⭐ | `BE-19`, `AD-11` | N2 | 3 |

### Chi tiết

**`BE-18`** — mọi chuyển trạng thái đi qua **đúng một cửa** `OrderStatusService::transitionTo()`. Không nơi nào được gán thẳng `$order->order_status = 'x'`. Bảng chuyển trạng thái hợp lệ đã có sẵn trong `App\Enums\OrderStatus::allowedTransitions()`.

**`BE-19`** — tác động tồn kho lấy từ `OrderStatus::stockEffect($from, $to)`, đã viết sẵn ở Lô 1:
- `confirmed → delivering` = trừ kho
- `delivering → cancelled` = cộng lại
- `returning → completed` = cộng lại

Bọc transaction + `lockForUpdate()` trên `product_variants` (BR-04).

**`BE-20` — Test chống đặt trùng ⭐** — bằng chứng thuyết phục nhất khi bảo vệ:
> Bắn 2 request "giao đồ" đồng thời trên cùng một biến thể chỉ còn 1 bộ. Khẳng định: đúng 1 request thành công, 1 request nhận lỗi 409, và `stock_quantity` không bao giờ âm.

**`AD-12`** — nút "Giao đồ" phải kiểm tra lại tồn kho ngay trước khi trừ. Biến thể đã hết thì hiện cảnh báo đỏ và chặn chuyển trạng thái.

**✅ Xong GĐ 6 khi:** admin xác nhận đơn → bấm giao đồ → tồn kho giảm đúng; test đặt trùng chạy xanh.

---

## GIAI ĐOẠN 7 — THANH TOÁN VNPAY

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-22` | `VnpayService` — tạo URL thanh toán, ký `vnp_SecureHash` | `BE-16` | N1 | 2 |
| `BE-23` | Webhook IPN — verify chữ ký, xử lý idempotent ⭐ | `BE-22` | N1 | 2 |
| `FE-11` | Màn kết quả thanh toán | `BE-22`, `FE-08` | N2 | 1 |
| `BE-24` | API ghi nhận thu tiền mặt | `BE-21` | N2 | 1 |
| `AD-13` | Nút ghi nhận thu tiền mặt trên màn chi tiết đơn | `BE-24`, `AD-12` | N2 | 1 |

### Chi tiết

**`BE-23` — IPN là nguồn sự thật duy nhất** (BR-18):
- Chỉ IPN được đổi trạng thái đơn. Return URL **chỉ** dùng điều hướng giao diện.
- Verify `vnp_SecureHash` trước khi làm bất cứ việc gì.
- Xử lý **idempotent** theo `vnp_TransactionNo` — VNPay gọi lại nhiều lần là bình thường. CSDL đã có `UNIQUE(payments.transaction_id)` làm chốt chặn, nhưng code vẫn phải kiểm tra trước để trả về đúng mã phản hồi cho cổng.
- Đăng ký tài khoản sandbox tại <https://sandbox.vnpayment.vn>, điền `VNPAY_TMN_CODE` và `VNPAY_HASH_SECRET` vào `.env`.

> IPN cần URL công khai. Lúc phát triển dùng `ngrok http 8000` rồi lấy URL đó điền vào `VNPAY_IPN_URL`.

**✅ Xong GĐ 7 khi:** thanh toán sandbox thành công → IPN về → `payment_status = paid`; gọi lại IPN lần 2 với cùng mã giao dịch → không sinh bản ghi trùng.

---

## GIAI ĐOẠN 8 — TRẢ ĐỒ & QUYẾT TOÁN CỌC ⭐

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-25` | `RentalReturnService` — tính phạt trễ, quyết toán cọc | `BE-19` | N1 | 2 |
| `BE-26` | API lập biên bản trả đồ + hoàn cọc | `BE-25` | N1 | 2 |
| `AD-14` | Màn quầy nhận trả đồ ⭐ | `BE-26`, `AD-12` | N2 | 3 |
| `FE-12` | Bảng quyết toán trên màn chi tiết đơn của khách | `BE-26`, `FE-10` | N2 | 1 |

### Chi tiết

**`BE-25`** (BR-30 → BR-32)

```
số_ngày_trễ = max(0, actual_return_date − rent_end_date)
phí_trễ     = số_ngày_trễ × late_fee_rate × Σ(price_per_day × quantity)
              (trần: không vượt total_deposit_fee)

penalty_fee           = phí_trễ + phí hư hỏng
deposit_refund_amount = max(0, total_deposit_fee − penalty_fee)
```

- `late_fee_rate` đọc từ `system_configs`, mặc định 1.5.
- `penalty_fee > 0` thì `penalty_reason` bắt buộc không rỗng (BR-34).
- Mỗi đơn **một** biên bản — CSDL đã có `UNIQUE(rental_returns.order_id)` (BR-35).

**`BE-26`** — trong một transaction: tạo `rental_returns` → tạo `payments` loại `deposit_refund` → cập nhật `orders.refunded_deposit` + `payment_status = refunded` + `order_status = completed` → cộng lại `stock_quantity` phần đồ còn dùng được.

**`AD-14`** (wireframe A04) — món tick "Nhập lại kho" thì cộng tồn, món bỏ tick thì nhắc admin lập phiếu `export` (BR-33).

**✅ Xong GĐ 8 khi:** đơn trễ 2 ngày + hỏng nhẹ → hệ thống tính đúng phạt, hoàn đúng phần cọc còn lại, tồn kho cộng lại đúng.

---

## GIAI ĐOẠN 9 — NỘI DUNG, ĐÁNH GIÁ, LIÊN HỆ

Nhiều task nhỏ, đều là CRUD, hai người chia đôi làm song song.

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-27` | API admin: chủ đề + bài viết | `BE-01` | N1 | 1 |
| `BE-28` | API admin: trang tĩnh + banner + menu | `BE-01` | N1 | 1 |
| `AD-15` | Màn quản lý bài viết (có trình soạn thảo) | `BE-27` | N1 | 2 |
| `AD-16` | Màn quản lý trang tĩnh + banner + menu | `BE-28` | N1 | 2 |
| `BE-29` | API đánh giá (gửi + duyệt/ẩn) | `BE-16` | N2 | 1 |
| `BE-30` | API liên hệ (gửi + trả lời) | `BE-01` | N2 | 1 |
| `AD-17` | Màn duyệt đánh giá + màn liên hệ | `BE-29`, `BE-30` | N2 | 2 |
| `FE-13` | Trang blog + chi tiết bài viết + trang tĩnh | `BE-27`, `BE-28` | N2 | 2 |
| `FE-14` | Form liên hệ + form gửi đánh giá | `BE-29`, `BE-30` | N2 | 1 |

**`BE-29`** — chỉ khách có đơn `completed` chứa sản phẩm đó mới được đánh giá, mỗi cặp (user, product) một lần (BR-50).

**✅ Xong GĐ 9 khi:** admin đăng bài viết → khách đọc được; khách gửi liên hệ → admin trả lời được; khách thuê xong → đánh giá được.

---

## GIAI ĐOẠN 10 — BÁO CÁO & HOÀN THIỆN

| Mã | Việc | Phụ thuộc | Người | Buổi |
|---|---|---|:-:|:-:|
| `BE-31` | API báo cáo doanh thu + top sản phẩm + tồn kho | `BE-26` | N1 | 2 |
| `AD-18` | Dashboard quản trị + biểu đồ | `BE-31`, `AD-12` | N1 | 2 |
| `BE-32` | 5 job nền (huỷ đơn quá hạn, nhắc trả đồ, đánh dấu trễ…) | `BE-23` | N2 | 2 |
| `BE-33` | API cấu hình hệ thống + màn cài đặt | `BE-01` | N2 | 1 |
| `AD-19` | Màn cấu hình hệ thống | `BE-33` | N2 | 1 |
| `--` | Rà soát toàn bộ, sửa lỗi, viết tài liệu, chuẩn bị demo | tất cả | N1+N2 | 2 |

**`BE-31`** — doanh thu = `total_rental_fee − discount_amount + penalty_fee`. **Không tính `total_deposit_fee`** vì cọc là khoản giữ hộ, phải hoàn lại (BR-15). Đây là chỗ hội đồng hay hỏi.

**`BE-32`** — 5 job: `ExpireUnpaidOrders`, `SendPickupReminder`, `SendReturnReminder`, `FlagOverdueOrders`, `CleanExpiredPasswordResets`.

---

## BẢNG TÓM TẮT PHÂN CÔNG

| Người | Tính năng phụ trách |
|---|---|
| **N1** | Auth API · Danh mục & thương hiệu · Catalog công khai (API) · Kho · **Tính tiền & Coupon** ⭐ · **Trạng thái đơn & tồn kho** ⭐ · VNPay · **Quyết toán cọc** ⭐ · Nội dung (admin) · Báo cáo |
| **N2** | Nền 2 frontend · Auth khách · Sản phẩm & biến thể · Catalog công khai (giao diện) · Khuyến mãi · Giỏ & Checkout · Đơn thuê (giao diện) · Đánh giá & Liên hệ · Job nền · Cấu hình |

Ba task ⭐ nặng nhất đều rơi vào N1 — nếu N1 chậm thì N2 nhận bớt phần giao diện của GĐ 9 để cân lại.

---

## ĐỊNH NGHĨA "XONG" CHO MỘT TASK

Task chỉ được coi là xong khi đủ **cả 5** điều kiện:

1. **Chạy được thật** — không phải "code xong", mà là mở trình duyệt / gọi API và thấy đúng kết quả.
2. **Xử lý được đường lỗi** — không chỉ luồng thuận. Nhập sai, để trống, không có quyền, dữ liệu không tồn tại đều phải ra thông báo đọc được.
3. **Task backend có test** với những phần tính tiền, đổi trạng thái, tồn kho. Task CRUD thuần thì không bắt buộc.
4. **Không hardcode con số nghiệp vụ** — phí ship, hệ số phạt, ngưỡng tồn thấp… đều đọc từ `system_configs`.
5. **Commit riêng, ghi rõ mã task** — ví dụ `BE-13: PricingService + unit test`.

---

## QUY TẮC GIT CHO 2 NGƯỜI

- Mỗi người làm trên nhánh riêng, đặt tên theo mã task: `be-13-pricing-service`.
- Merge vào `main` khi task xong và chạy được.
- **Trước khi bắt đầu task mới luôn `git pull`** — nhất là sau mỗi 🔄 điểm đồng bộ.
- File dễ đụng nhau nhất: `routes/api.php`, `bootstrap/app.php`, `DatabaseSeeder.php`. Ai sửa thì báo người kia một tiếng.
- **Không commit file `.env`** — đã nằm trong `.gitignore`. Thêm biến mới thì thêm cả vào `.env.example` và báo người kia.

---

## TÀI LIỆU LIÊN QUAN

| File | Dùng khi nào |
|---|---|
| `docs/Dac-ta-he-thong-cho-thue-trang-phuc.md` | Tra business rule (BR-xx), đặc tả API §7, wireframe §8 |
| `docs/Huong-dan-cai-dat-va-chay-du-an.md` | Cài máy mới, lỗi môi trường, các lệnh hay dùng |

Mọi task ở trên đều dẫn chiếu mã `BR-xx` / `UC-xx` / `§x.x` của đặc tả — gặp chỗ không rõ thì mở đặc tả tra đúng mã đó.
