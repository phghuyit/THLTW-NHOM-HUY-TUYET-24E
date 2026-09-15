# TÀI LIỆU TRIỂN KHAI VIẾT BÁO CÁO PHÂN TÍCH & THIẾT KẾ HỆ THỐNG

**Đề tài:** Xây dựng hệ thống cho thuê trang phục (Costume Rental System — CRS)
**Sinh viên:** Le Vo Hong Tuyet · Ngành Công nghệ thông tin · Trường Cao đẳng Công Thương TP.HCM
**Nguồn đầu vào:** *Đặc tả hệ thống cho thuê trang phục v1.0 — 09/09/2026*
**Phiên bản tài liệu:** 1.0 — 09/09/2026

---

## MỤC LỤC

- [Phần 0. Cách dùng tài liệu này](#phần-0-cách-dùng-tài-liệu-này)
- [Phần 1. Quy cách trình bày báo cáo](#phần-1-quy-cách-trình-bày-báo-cáo)
- [Phần 2. Đề cương chi tiết báo cáo](#phần-2-đề-cương-chi-tiết-báo-cáo)
- [Phần 3. Danh mục hình vẽ & bảng biểu phải làm](#phần-3-danh-mục-hình-vẽ--bảng-biểu-phải-làm)
- [Phần 4. Ngân hàng nội dung rút từ đặc tả](#phần-4-ngân-hàng-nội-dung-rút-từ-đặc-tả)
- [Phần 5. Thư viện prompt viết từng chương](#phần-5-thư-viện-prompt-viết-từng-chương)
- [Phần 6. Kế hoạch viết theo tuần](#phần-6-kế-hoạch-viết-theo-tuần)
- [Phần 7. Checklist rà soát trước khi nộp](#phần-7-checklist-rà-soát-trước-khi-nộp)
- [Phần 8. Lỗi thường gặp & cách tránh](#phần-8-lỗi-thường-gặp--cách-tránh)
- [Phụ lục A. Bảng ánh xạ Đặc tả → Báo cáo](#phụ-lục-a-bảng-ánh-xạ-đặc-tả--báo-cáo)
- [Phụ lục B. Mẫu tài liệu tham khảo](#phụ-lục-b-mẫu-tài-liệu-tham-khảo)

---

## Phần 0. Cách dùng tài liệu này

Tài liệu này **không phải là báo cáo**. Nó là bản thiết kế để viết báo cáo: nói rõ báo cáo gồm những mục nào, mỗi mục viết gì, lấy dữ liệu từ đâu trong bản đặc tả, cần vẽ hình gì, và viết bao nhiêu trang.

**Quy trình đề nghị — làm đúng thứ tự này để không phải viết lại:**

| Bước | Việc làm | Kết quả |
|---|---|---|
| 1 | Đối chiếu Phần 1 với mẫu của khoa/GVHD, sửa lại nếu khác | Chốt quy cách trình bày |
| 2 | Copy toàn bộ đề cương ở Phần 2 vào file Word trống, chỉ có tiêu đề | Bộ khung rỗng, đã đánh số |
| 3 | Vẽ trước toàn bộ hình ở Phần 3, đặt tên file theo đúng số hiệu | Thư mục `hinh-anh/` đầy đủ |
| 4 | Chèn hình + bảng vào khung, viết caption trước | Báo cáo đã "có hình dạng" |
| 5 | Viết chữ vào từng mục theo hướng dẫn Phần 2 (dùng prompt Phần 5 nếu cần) | Bản thảo |
| 6 | Chạy checklist Phần 7 | Bản nộp |

**Nguyên tắc xuyên suốt:** báo cáo phân tích thiết kế phải trả lời được ba câu — *hệ thống làm gì* (Chương 3), *hệ thống được xây thế nào* (Chương 4), *bằng chứng nó chạy đúng* (Chương 5). Mọi câu chữ không phục vụ ba câu này đều là phần thừa nên cắt.

**Quy ước ký hiệu trong tài liệu:**

- `[Đặc tả §x.y]` — lấy nguyên liệu từ mục x.y của file đặc tả.
- ⭐ — mục trọng điểm, hội đồng sẽ hỏi, đầu tư nhiều công nhất.
- 🖼 — mục bắt buộc phải có hình vẽ.
- ⚠ — chỗ sinh viên hay làm sai.

---

## Phần 1. Quy cách trình bày báo cáo

> Đây là chuẩn phổ biến của đồ án tốt nghiệp CĐ/ĐH khối CNTT tại Việt Nam. **Bắt buộc đối chiếu lại với mẫu của khoa**; nếu khoa có quy định riêng thì theo khoa.

### 1.1. Định dạng trang

| Hạng mục | Quy cách |
|---|---|
| Khổ giấy | A4 (210 × 297 mm), in một mặt |
| Lề | Trái 3.0–3.5 cm · Phải 2.0 cm · Trên 2.0–2.5 cm · Dưới 2.0–2.5 cm |
| Font chữ | Times New Roman, bảng mã Unicode |
| Cỡ chữ thân bài | 13 pt (một số khoa dùng 14 pt) |
| Giãn dòng | 1.5 lines |
| Giãn đoạn | Before 0 pt, After 6 pt |
| Căn lề đoạn văn | Justify (căn đều hai bên) |
| Thụt đầu dòng | 1.0 cm (First line indent) |
| Đánh số trang | Chân trang, canh giữa hoặc phải |
| Số trang phần đầu | i, ii, iii… (từ trang bìa lót đến hết danh mục) |
| Số trang phần chính | 1, 2, 3… bắt đầu từ trang đầu của **Mở đầu** |

### 1.2. Đánh số đề mục

- Tối đa **3 cấp**: `1.` → `1.1.` → `1.1.1.`. Cần cấp 4 thì dùng gạch đầu dòng, không đánh số tiếp.
- Cỡ chữ tiêu đề: Chương 16 pt in hoa đậm · Mục cấp 2 14 pt đậm · Mục cấp 3 13 pt đậm nghiêng.
- Mỗi chương **bắt đầu ở một trang mới** (chèn Page Break, không nhấn Enter nhiều lần).

### 1.3. Hình vẽ và bảng biểu

| Quy tắc | Chi tiết |
|---|---|
| Số hiệu hình | `Hình <số chương>.<số thứ tự>` — ví dụ *Hình 3.5* |
| Vị trí caption hình | **Dưới** hình, canh giữa, cỡ 12 pt nghiêng |
| Số hiệu bảng | `Bảng <số chương>.<số thứ tự>` — ví dụ *Bảng 4.2* |
| Vị trí caption bảng | **Trên** bảng, canh giữa, cỡ 12 pt nghiêng |
| Dẫn chiếu trong văn | Bắt buộc: "…được mô tả trong Hình 3.5" — ⚠ hình không được dẫn chiếu là lỗi bị trừ điểm |
| Chất lượng hình | Tối thiểu 150 DPI, chữ trong hình đọc được khi in đen trắng |
| Bảng dài | Lặp lại dòng tiêu đề ở mỗi trang (Table Properties → Repeat as header row) |

### 1.4. Trích dẫn tài liệu tham khảo

- Trong văn: đánh số vuông `[1]`, `[2]` theo thứ tự xuất hiện.
- Danh mục cuối báo cáo: sắp theo thứ tự trích dẫn, tách nhóm Tiếng Việt trước, Tiếng Anh sau.
- Tối thiểu **8–12 tài liệu**, trong đó ≥ 4 là tài liệu chính thống (sách, tài liệu chính thức của framework), phần còn lại là trang web/tài liệu kỹ thuật có ghi ngày truy cập.
- ⚠ Không trích dẫn blog cá nhân, Wikipedia, hoặc kết quả chat với AI.

### 1.5. Độ dài mục tiêu

| Phần | Số trang gợi ý |
|---|---|
| Phần thủ tục (bìa → danh mục) | 8–12 |
| Mở đầu | 2–3 |
| Chương 1. Tổng quan đề tài | 8–12 |
| Chương 2. Cơ sở lý thuyết & công nghệ | 12–18 |
| Chương 3. Phân tích hệ thống ⭐ | 25–35 |
| Chương 4. Thiết kế hệ thống ⭐ | 30–40 |
| Chương 5. Cài đặt & kiểm thử | 15–22 |
| Kết luận & hướng phát triển | 2–3 |
| Tài liệu tham khảo + Phụ lục | 5–15 |
| **Tổng phần chính** | **95–130 trang** |

> Tỷ lệ vàng: **Chương 3 + Chương 4 phải chiếm ≥ 55% số trang phần chính**. Đây là báo cáo *phân tích thiết kế*, không phải báo cáo *hướng dẫn sử dụng phần mềm*. ⚠ Lỗi phổ biến nhất là Chương 5 phình to vì chèn 40 ảnh chụp màn hình, còn Chương 4 chỉ có mỗi cái ERD.

---

## Phần 2. Đề cương chi tiết báo cáo

### 2.0. Sơ đồ tổng thể báo cáo

```
BÁO CÁO PTTKHT — HỆ THỐNG CHO THUÊ TRANG PHỤC
│
├── PHẦN THỦ TỤC
│   ├── Bìa chính (bìa cứng) / Bìa lót
│   ├── Lời cam đoan
│   ├── Lời cảm ơn
│   ├── Nhận xét của giảng viên hướng dẫn  (để trống, GVHD ký)
│   ├── Nhận xét của giảng viên phản biện  (để trống)
│   ├── Mục lục            (Word tự sinh — Heading styles)
│   ├── Danh mục hình vẽ   (Word tự sinh — Insert Caption)
│   ├── Danh mục bảng biểu (Word tự sinh)
│   └── Danh mục từ viết tắt & thuật ngữ
│
├── MỞ ĐẦU
├── CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI
├── CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ SỬ DỤNG
├── CHƯƠNG 3. PHÂN TÍCH HỆ THỐNG                     ⭐
├── CHƯƠNG 4. THIẾT KẾ HỆ THỐNG                      ⭐
├── CHƯƠNG 5. CÀI ĐẶT VÀ KIỂM THỬ
├── KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
├── TÀI LIỆU THAM KHẢO
└── PHỤ LỤC
```

---

### 2.1. PHẦN THỦ TỤC

| Mục | Nội dung cần viết | Độ dài | Ghi chú |
|---|---|---|---|
| Bìa chính | Tên trường/khoa · logo · "ĐỒ ÁN TỐT NGHIỆP" · tên đề tài · GVHD · SVTH + MSSV · TP.HCM, tháng/năm | 1 trang | Lấy đúng mẫu file của khoa |
| Bìa lót | Giống bìa chính, in giấy thường | 1 trang | |
| Lời cam đoan | Cam đoan đồ án do bản thân thực hiện, số liệu trung thực, tài liệu tham khảo trích dẫn đầy đủ; ký tên | ½ trang | |
| Lời cảm ơn | Cảm ơn nhà trường, khoa, GVHD (ghi rõ tên), gia đình, bạn bè | ½ trang | Viết thật, tránh sáo rỗng |
| Nhận xét GVHD/phản biện | Để trống có khung ký | 2 trang | |
| Mục lục | Tự sinh 3 cấp | 2–3 trang | ⚠ Phải dùng Heading style, không gõ tay |
| Danh mục hình vẽ | Tự sinh từ Caption | 1–2 trang | |
| Danh mục bảng biểu | Tự sinh từ Caption | 1 trang | |
| Danh mục từ viết tắt | Bảng 2 cột: viết tắt — nghĩa đầy đủ | 1 trang | Nội dung sẵn ở **Phần 4.9** tài liệu này |

---

### 2.2. MỞ ĐẦU *(2–3 trang)*

Viết liền mạch, không chia mục con. Bốn đoạn theo thứ tự:

1. **Bối cảnh** — nhu cầu thuê trang phục (cưới hỏi, lễ tết, sự kiện, cosplay, biểu diễn) tăng vì thuê rẻ hơn mua nhiều lần với món chỉ dùng 1–2 lần; xu hướng tiêu dùng tuần hoàn.
2. **Vấn đề** — phần lớn cửa hàng quản lý bằng sổ tay/Excel/tin nhắn; hệ quả: đặt trùng lịch, không biết đồ đang ở đâu, cọc tính tay dễ sai, khiếu nại không có bằng chứng.
3. **Giải pháp đề xuất** — hệ thống web cho thuê trang phục quản lý tồn kho theo **lịch bận thời gian** và tới **cấp cá thể vật lý**, tự động hoá đặt thuê, thanh toán cọc, kiểm tra khi trả và quyết toán.
4. **Đóng góp & bố cục** — liệt kê 3 đóng góp chính rồi giới thiệu 5 chương, mỗi chương 1 câu.

> **Ba đóng góp nên nêu thẳng ở Mở đầu** *(đây là điểm bán của đồ án)*: (1) mô hình dữ liệu tồn kho theo thời gian thay cho cột số lượng; (2) cơ chế chống đặt trùng có kiểm chứng bằng test đồng thời; (3) quy trình quyết toán tiền cọc có biên bản 2 chiều và kiểm soát nội bộ phân quyền.

---

### 2.3. CHƯƠNG 1 — TỔNG QUAN ĐỀ TÀI *(8–12 trang)*

| Mục | Nội dung cần viết | Nguồn | Trang |
|---|---|---|---|
| **1.1. Lý do chọn đề tài** | Mở rộng đoạn 1–2 của Mở đầu; thêm nhận định tính đặc thù kỹ thuật: bài toán cho thuê **khó hơn** bán hàng vì tồn kho là lịch, không phải số | Đặc tả §1.1 | 1.5 |
| **1.2. Mục tiêu đề tài** | Chia 2 nhóm. *Mục tiêu tổng quát*: 1 câu. *Mục tiêu cụ thể*: 6–8 gạch đầu dòng đo được — vd "xây dựng engine kiểm tra tình trạng rảnh trả kết quả < 300 ms cho danh sách 20 sản phẩm" | Tự viết từ §1.2 | 1 |
| **1.3. Đối tượng và phạm vi** | *Đối tượng*: quy trình nghiệp vụ cho thuê trang phục của một cửa hàng đơn lẻ. *Phạm vi*: bê nguyên In-scope §1.2 và Out-of-scope §1.3 thành 2 bảng | Đặc tả §1.2, §1.3 | 1.5 |
| **1.4. Phương pháp thực hiện** | Nêu 4 phương pháp: khảo sát thực tế & phỏng vấn chủ cửa hàng; phân tích thiết kế hướng đối tượng với UML; phát triển lặp tăng dần theo 10 giai đoạn; kiểm thử tự động (unit + feature + kiểm thử tương tranh) | Đặc tả §10 | 1 |
| **1.5. Khảo sát hiện trạng** 🖼 | ⭐ Mục hay bị viết hời hợt. Cần có: (a) mô tả quy trình thủ công hiện tại kèm **sơ đồ quy trình hiện trạng**; (b) bảng liệt kê ≥ 6 nhược điểm và hệ quả; (c) bảng nhu cầu người dùng thu được sau khảo sát | Tự khảo sát | 3 |
| **1.6. Khảo sát giải pháp hiện có** | Bảng so sánh 3–4 hệ thống (Booqable, Rentle, EZRentOut, phần mềm quản lý cho thuê trong nước) theo tiêu chí: quản lý cấp cá thể, buffer giặt ủi, tiền cọc & phí phạt, tiếng Việt, chi phí. Kết luận khoảng trống mà đề tài lấp vào | Tự khảo sát | 2 |
| **1.7. Bố cục báo cáo** | Mỗi chương 2–3 câu | — | 0.5 |

**Gợi ý viết 1.5 — bảng nhược điểm hiện trạng** (viết lại theo khảo sát thực tế của bạn):

| # | Nhược điểm quy trình thủ công | Hệ quả |
|---|---|---|
| 1 | Ghi lịch thuê bằng sổ tay / Excel dùng chung | Đặt trùng ngày, khách đến không có đồ |
| 2 | Không phân biệt được từng món đồ vật lý | Không biết bộ nào đang ở đâu, tình trạng ra sao |
| 3 | Không tính thời gian giặt ủi giữa hai lượt | Giao đồ chưa kịp giặt, mất uy tín |
| 4 | Tiền cọc và phí phạt tính tay | Sai sót, tranh cãi với khách |
| 5 | Không có biên bản tình trạng lúc giao/nhận | Khiếu nại không có căn cứ giải quyết |
| 6 | Không có số liệu khai thác từng món | Không biết món nào lỗ vốn, món nào nên nhập thêm |

---

### 2.4. CHƯƠNG 2 — CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ *(12–18 trang)*

> ⚠ **Nguyên tắc sống còn của chương này:** mỗi lý thuyết trình bày xong **phải có một câu "áp dụng trong đề tài"**. Chương 2 chỉ chép định nghĩa từ tài liệu framework là chương bị chấm điểm thấp nhất.

| Mục | Nội dung cần viết | Trang |
|---|---|---|
| **2.1. Phân tích thiết kế hướng đối tượng và UML** | Quy trình PTTK hướng đối tượng; giới thiệu 5 loại sơ đồ mà báo cáo dùng: use case, hoạt động, tuần tự, trạng thái, lớp. Mỗi loại: mục đích + ký hiệu chính + dùng ở mục nào của Chương 3/4 | 3 |
| **2.2. Kiến trúc client–server tách rời (headless) và REST API** | Khái niệm REST, tài nguyên, phương thức, mã trạng thái; so sánh kiến trúc nguyên khối (monolith render server-side) với tách rời; nêu **lý do chọn tách rời** cho đề tài | 2 |
| **2.3. Laravel** | Kiến trúc MVC + Service Container, Eloquent ORM, Migration, Queue & Scheduler, Sanctum, Policy. Nhấn ba thứ mà đề tài dùng nặng: **transaction + pessimistic lock**, **queue/job nền**, **event–listener** | 3 |
| **2.4. Next.js (App Router)** | React Server Component, SSR/ISR và ý nghĩa SEO cho trang catalog, routing theo thư mục, data fetching phía client. Nêu vì sao catalog dùng SSR/ISR còn phần tình trạng rảnh phải gọi phía client | 2 |
| **2.5. MySQL và thiết kế chỉ mục** | Quan hệ, khoá, chuẩn hoá 1NF–3NF, chỉ mục B-Tree, **cơ chế khoá `SELECT … FOR UPDATE`**, mức cô lập giao dịch. ⭐ Đây là nền cho thuật toán chống đặt trùng ở §4.5 | 2.5 |
| **2.6. Redis** | Bộ nhớ đệm, hàng đợi, khoá phân tán; ứng dụng trong đề tài: cache lịch bận, hàng đợi job, khoá theo biến thể lúc đặt đơn | 1 |
| **2.7. Cổng thanh toán trực tuyến và cơ chế IPN** | Luồng thanh toán chuyển hướng, chữ ký `SecureHash`, phân biệt **Return URL** (điều hướng giao diện) và **IPN** (nguồn sự thật), tính bất biến khi gọi lại (idempotency) | 2 |
| **2.8. Điều khiển truy cập theo vai trò (RBAC)** | Khái niệm vai trò – quyền – người dùng; nguyên tắc **tách biệt nhiệm vụ (separation of duties)**: người áp phí ≠ người miễn phí | 1 |
| **2.9. Các khái niệm nghiệp vụ cho thuê** | Bảng thuật ngữ có giải thích dài hơn phần danh mục: biến thể, cá thể, booking, buffer, giữ chỗ tạm, gán cá thể trễ, quyết toán, tỷ lệ khai thác | 1.5 |

---

### 2.5. CHƯƠNG 3 — PHÂN TÍCH HỆ THỐNG ⭐ *(25–35 trang)*

Đây là chương **quan trọng nhất về mặt "phân tích"**. Trình tự tư duy: *ai dùng → dùng để làm gì → quy trình chạy ra sao → ràng buộc nghiệp vụ là gì*.

#### 3.1. Mô tả bài toán và đặc thù nghiệp vụ ⭐ *(2 trang)*
Bê **bảng 4 điểm khác biệt** ở Đặc tả §1.1 vào đây và **diễn giải mỗi dòng thành một đoạn văn**. Đây là mục tạo ấn tượng đầu tiên với hội đồng: chứng minh đề tài không phải "web bán hàng đổi tên".

- Nguồn: Đặc tả §1.1 → **Bảng 3.1** *Đặc thù nghiệp vụ cho thuê so với bán hàng*

#### 3.2. Xác định yêu cầu hệ thống *(4–5 trang)*

| Mục con | Nội dung |
|---|---|
| 3.2.1. Yêu cầu chức năng | **Bảng 3.4** — bảng mã hoá `FR-xx`, mỗi dòng: mã · tên yêu cầu · mô tả · actor · mức ưu tiên (Bắt buộc/Nên có/Có thì tốt). Sinh từ bản đồ chức năng A→F ở Đặc tả §3.1, khoảng **35–45 dòng** |
| 3.2.2. Yêu cầu phi chức năng | **Bảng 3.5** — bảng mã `NFR-xx` theo 6 nhóm: hiệu năng, bảo mật, độ tin cậy & toàn vẹn dữ liệu, khả dụng/giao diện, khả năng bảo trì, khả năng mở rộng. Mỗi yêu cầu phải **đo được** (xem gợi ý ở Phần 4.7) |
| 3.2.3. Ràng buộc và giả định | Một cửa hàng duy nhất; không tích hợp API vận chuyển thật; cổng thanh toán chạy môi trường thử nghiệm; múi giờ Asia/Ho_Chi_Minh |

#### 3.3. Xác định tác nhân và phân quyền *(3 trang)*
- 3.3.1. Danh sách tác nhân → **Bảng 3.2** (Đặc tả §2.1), mỗi tác nhân thêm 1 đoạn mô tả mục tiêu và tần suất sử dụng.
- 3.3.2. Ma trận phân quyền → **Bảng 3.3** (Đặc tả §2.2).
- 3.3.3. ⭐ Nguyên tắc tách biệt nhiệm vụ: viết hẳn một đoạn giải thích vì sao Staff áp phí nhưng chỉ Manager được miễn phí, và vì sao mọi thao tác nhạy cảm đều ghi nhật ký.

#### 3.4. Sơ đồ phân rã chức năng (BFD) 🖼 *(2 trang)*
Vẽ lại cây chức năng A→F ở Đặc tả §3.1 thành sơ đồ khối 3 cấp. Sau sơ đồ, viết bảng mô tả ngắn từng nhóm chức năng.
- → **Hình 3.1**

#### 3.5. Sơ đồ use case 🖼 ⭐ *(5–6 trang)*

| Mục con | Nội dung |
|---|---|
| 3.5.1. Use case tổng quát | Một sơ đồ đủ 7 tác nhân và các use case gói lớn → **Hình 3.2** |
| 3.5.2. Gói Khách hàng | UC-01…UC-08 → **Hình 3.3** |
| 3.5.3. Gói Vận hành cửa hàng | UC-09…UC-14 → **Hình 3.4** |
| 3.5.4. Gói Quản trị & hệ thống | UC-15…UC-18 → **Hình 3.5** |
| 3.5.5. Bảng tổng hợp use case | **Bảng 3.6** — bê nguyên bảng 18 use case ở Đặc tả §3.2 |

> ⚠ Nhớ dùng đúng quan hệ `<<include>>` (vd *Đặt đơn* include *Kiểm tra tình trạng rảnh*) và `<<extend>>` (vd *Áp dụng mã giảm giá* extend *Đặt đơn*). Vẽ sai hai quan hệ này là lỗi bị hỏi ngay.

#### 3.6. Đặc tả use case chi tiết ⭐ *(6–8 trang)*
Đặc tả **6–8 use case** theo mẫu 9 mục: *Mã · Tên · Tác nhân · Mô tả · Tiền điều kiện · Luồng sự kiện chính · Luồng phụ · Ngoại lệ · Hậu điều kiện*.

Danh sách bắt buộc chọn:

| Ưu tiên | Use case | Vì sao chọn | Nguồn |
|---|---|---|---|
| 1 ⭐ | UC-04 Đặt đơn & thanh toán cọc | Luồng phức tạp nhất phía khách, có xử lý tranh chấp | Đặc tả §3.4 (có sẵn) |
| 2 ⭐ | UC-12+13 Nhận lại, kiểm tra & quyết toán | Luồng phức tạp nhất phía cửa hàng | Đặc tả §3.4 (có sẵn) |
| 3 | UC-01/02 Tìm kiếm theo ngày rảnh | Thể hiện engine tình trạng rảnh | Tự viết |
| 4 | UC-10 Soạn đồ & gán cá thể | Thể hiện cơ chế gán cá thể trễ (BR-06) | Tự viết |
| 5 | UC-07 Huỷ đơn & hoàn tiền | Có bảng chính sách phí huỷ BR-20 | Tự viết |
| 6 | UC-17/18 Job tự động | Thể hiện tác nhân Hệ thống | Tự viết |

#### 3.7. Sơ đồ hoạt động 🖼 *(3 trang)*
Vẽ **3 sơ đồ**, mỗi cái có phân làn (swimlane) theo tác nhân:
- **Hình 3.6** — Quy trình đặt thuê và thanh toán cọc (làn: Khách · Hệ thống · Cổng thanh toán).
- **Hình 3.7** — Quy trình nhận lại đồ, kiểm tra và quyết toán cọc (làn: Khách · Nhân viên · Hệ thống · Quản lý).
- **Hình 3.8** — Vòng đời cá thể sau khi trả: kiểm tra → giặt ủi → sửa chữa → sẵn sàng/thanh lý.
- Nguồn khung: Đặc tả §3.3 (luồng happy path) và §3.4.

#### 3.8. Sơ đồ tuần tự 🖼 *(3 trang)*
- **Hình 3.9** — Kiểm tra tình trạng rảnh: Người dùng → Giao diện → API → AvailabilityService → CSDL.
- **Hình 3.10** — ⭐ Đặt đơn có khoá bi quan và kiểm tra lại tình trạng rảnh trong giao dịch (thể hiện rõ `BEGIN → lockForUpdate → kiểm tra lại → tạo booking → COMMIT`, và nhánh rollback trả lỗi 409).
- **Hình 3.11** — Nhận kết quả thanh toán qua IPN: Cổng → Webhook → xác thực chữ ký → xử lý bất biến → cập nhật đơn → gửi thông báo.

#### 3.9. Sơ đồ trạng thái 🖼 ⭐ *(3 trang)*
- **Hình 3.12** — Trạng thái đơn thuê (13 trạng thái, Đặc tả §4.1) + **Bảng 3.13** bảng chuyển trạng thái hợp lệ.
- **Hình 3.13** — Trạng thái cá thể trang phục (7 trạng thái, Đặc tả §4.2) + **Bảng 3.14** ý nghĩa & khả năng cho thuê.
- **Hình 3.14** — Trạng thái booking và trạng thái thanh toán (gộp 1 hình 2 phần, Đặc tả §4.3–4.4).

#### 3.10. Quy tắc nghiệp vụ ⭐ *(4–5 trang)*
Trình bày lại toàn bộ BR-01 → BR-62 theo 7 nhóm, mỗi nhóm 1 bảng: mã · phát biểu quy tắc · lý do nghiệp vụ · nơi hiện thực (lớp/dịch vụ nào).

| Nhóm | Mã | Bảng |
|---|---|---|
| Tồn kho & lịch bận ⭐ | BR-01…BR-07 | Bảng 3.15 |
| Giá thuê & tiền cọc | BR-10…BR-14 | Bảng 3.16 |
| Huỷ đơn & hoàn tiền | BR-20…BR-23 | Bảng 3.17 |
| Phí phát sinh ⭐ | BR-30…BR-34 | Bảng 3.18 |
| Gia hạn | BR-40…BR-42 | Bảng 3.19 |
| Khuyến mãi | BR-50…BR-52 | Bảng 3.20 |
| Đánh giá & nhật ký | BR-60…BR-62 | Bảng 3.21 |

> Riêng **BR-01, BR-02, BR-03, BR-04** phải viết thành **văn xuôi có công thức toán**, và dẫn chiếu tới Hình 4.7 (minh hoạ trục thời gian các trường hợp chồng lấn) — đây là phần "lõi khoa học" của đồ án. Xem Phần 4.4 tài liệu này để lấy sẵn nội dung.

---

### 2.6. CHƯƠNG 4 — THIẾT KẾ HỆ THỐNG ⭐ *(30–40 trang)*

Chương 3 trả lời *hệ thống làm gì*; chương này trả lời *xây bằng cách nào*. Mọi quyết định thiết kế phải kèm **lý do**, vì hội đồng chấm ở chỗ lý do.

#### 4.1. Thiết kế kiến trúc tổng thể 🖼 *(3 trang)*
- 4.1.1. Sơ đồ kiến trúc triển khai → **Hình 4.1** (vẽ lại sơ đồ khối Đặc tả §1.4: hai ứng dụng Next.js → REST API Laravel → MySQL + Redis → dịch vụ ngoài).
- 4.1.2. Phân tầng phía máy chủ → **Hình 4.2**: Controller → Request (kiểm tra dữ liệu) → Service (nghiệp vụ) → Model/Repository → CSDL; kèm Job, Event, Policy ở bên.
- 4.1.3. Lý do lựa chọn kiến trúc: bảng 2 cột *Tiêu chí — Phân tích* so sánh nguyên khối vs tách rời (SEO, khả năng kiểm thử, phân tách trách nhiệm, khả năng mở rộng sau này ra ứng dụng di động).
- 4.1.4. Sơ đồ triển khai (deployment) → **Hình 4.3**: container nginx + php-fpm + mysql + redis.

#### 4.2. Thiết kế cơ sở dữ liệu ⭐ 🖼 *(12–15 trang — mục dài nhất báo cáo)*

| Mục con | Nội dung | Kết quả |
|---|---|---|
| 4.2.1. Mô hình thực thể – liên kết | Sơ đồ ERD đầy đủ 20+ thực thể | **Hình 4.4** (nguồn: Đặc tả §6.1) |
| 4.2.2. Mô tả các thực thể | Đoạn văn giới thiệu 6 nhóm: người dùng · danh mục sản phẩm · kho cá thể · đơn thuê · tài chính · vận hành | — |
| 4.2.3. Từ điển dữ liệu | Mỗi bảng một bảng mô tả: tên cột · kiểu · khoá · null · mặc định · ý nghĩa | **Bảng 4.1 → 4.20** (nguồn: Đặc tả §6.2) |
| 4.2.4. Ràng buộc toàn vẹn | Khoá chính, khoá ngoại, unique `(product_id,size,color)`, unique `unit_code`, ràng buộc `return_date >= pickup_date`, `final_amount >= 0` | Bảng 4.21 |
| 4.2.5. Thiết kế chỉ mục ⭐ | Bảng: chỉ mục · trên bảng nào · phục vụ truy vấn nào · vì sao cần. Nhấn 3 chỉ mục của `bookings` | Bảng 4.22 |
| 4.2.6. Quyết định thiết kế đáng chú ý ⭐ | 5 quyết định ở Đặc tả §6.3, mỗi cái viết 1 đoạn: *quyết định — lý do — đánh đổi* | — |

> **4.2.6 là mục ăn điểm cao nhất Chương 4.** Năm quyết định: (1) không có cột `stock_quantity`; (2) phi chuẩn hoá `busy_from`/`busy_to` để đánh chỉ mục; (3) chụp ảnh dữ liệu (snapshot) tên và giá vào `order_items`; (4) xoá mềm cho `products`/`variants`/`rental_units`; (5) dùng `decimal(12,2)` chứ không dùng số thực dấu phẩy động cho tiền. Mỗi cái phải nêu được **cái giá phải trả** của lựa chọn đó, không chỉ nêu cái lợi.

#### 4.3. Thiết kế lớp 🖼 *(4 trang)*
- 4.3.1. Sơ đồ lớp thực thể (Entity/Model) → **Hình 4.5**: các lớp `Product`, `ProductVariant`, `RentalUnit`, `Booking`, `Order`, `OrderItem`, `Payment`, `Inspection`… với thuộc tính chính và quan hệ.
- 4.3.2. Sơ đồ lớp tầng nghiệp vụ (Service) → **Hình 4.6**: `AvailabilityService`, `PricingService`, `CartService`, `OrderService`, `OrderStateMachine`, `InspectionService`, `FeeCalculator`, `SettlementService`, `RefundService` và quan hệ phụ thuộc giữa chúng.
- 4.3.3. Mẫu thiết kế áp dụng → bảng: *Strategy* cho `PaymentGateway` (VNPay/MoMo), *State* cho `OrderStateMachine`, *Observer* cho Event–Listener, *Repository* cho truy cập dữ liệu, *Facade/Service Layer* để tách nghiệp vụ khỏi Controller. Mỗi mẫu: vấn đề giải quyết — cách áp dụng — lợi ích.

#### 4.4. Thiết kế giao diện lập trình (API) *(4 trang)*
- 4.4.1. Nguyên tắc thiết kế: đặt tên tài nguyên, phiên bản `/api/v1`, mã trạng thái HTTP dùng thống nhất, cấu trúc phản hồi lỗi chuẩn (bê JSON mẫu ở Đặc tả §7).
- 4.4.2. Xác thực & phân quyền: Sanctum, luồng token, áp Policy theo quyền `<module>.<action>`.
- 4.4.3. Bảng danh mục API → **Bảng 4.23–4.25** (Công khai/Khách hàng · Webhook · Quản trị), nguồn Đặc tả §7.1–7.3. Không cần liệt kê hết chi tiết tham số, giữ ở mức phương thức–đường dẫn–mô tả.
- 4.4.4. Đặc tả chi tiết 3 API tiêu biểu, mỗi cái đủ: đường dẫn · tham số · thân yêu cầu · thân phản hồi thành công · các mã lỗi:
  - `GET /products/{slug}/availability` (truy vấn lịch rảnh)
  - `POST /orders` (đặt đơn — có mã lỗi `AVAILABILITY_CONFLICT` 409)
  - `POST /payments/vnpay/ipn` (webhook — mô tả cả cách xác thực chữ ký và xử lý bất biến)

#### 4.5. Thiết kế các thuật toán lõi ⭐⭐ *(6–8 trang — mục quan trọng nhất toàn báo cáo)*

Đây là chỗ chứng minh đồ án có hàm lượng kỹ thuật. Mỗi thuật toán trình bày theo **cùng một khuôn 5 phần**: *Phát biểu bài toán → Ý tưởng → Mã giả → Câu truy vấn/đoạn mã then chốt → Phân tích độ phức tạp và trường hợp biên*.

| Mục con | Thuật toán | Nội dung bắt buộc |
|---|---|---|
| 4.5.1 ⭐ | **Kiểm tra tình trạng rảnh** | Định nghĩa hình thức "rảnh" (BR-01); công thức khoảng bận có đệm (BR-02); điều kiện chồng lấn `a1 ≤ b2 ∧ b1 ≤ a2` (BR-03) kèm 🖼 **Hình 4.7** minh hoạ trục thời gian 4 trường hợp chồng lấn; câu SQL `NOT EXISTS`; độ phức tạp khi có chỉ mục |
| 4.5.2 ⭐ | **Chống đặt trùng (tranh chấp đồng thời)** | Phân tích tình huống hai người đặt cùng lúc; giải pháp giao dịch + khoá bi quan `lockForUpdate` + kiểm tra lại trong giao dịch + chỉ mục duy nhất + khoá Redis theo biến thể; 🖼 **Hình 4.8** sơ đồ hai luồng song song, một thành công một nhận lỗi 409; so sánh với phương án khoá lạc quan và giải thích vì sao chọn khoá bi quan |
| 4.5.3 | **Giữ chỗ tạm và giải phóng** | Vòng đời `held → confirmed / released`; TTL 15 phút ở giỏ, 30 phút khi thanh toán; job chạy mỗi phút; xử lý trường hợp job chạy đúng lúc khách bấm thanh toán |
| 4.5.4 | **Gán cá thể trễ** | Vì sao chỉ giữ chỗ ở cấp biến thể lúc đặt; tiêu chí chọn cá thể khi soạn đồ (ưu tiên `rental_count` nhỏ nhất để mòn đều); mã giả hàm chọn cá thể |
| 4.5.5 | **Tính giá thuê tối ưu theo gói** | Bài toán: cho `n` ngày thuê và tập gói giá, tìm tổ hợp rẻ nhất cho khách; mã giả (quy hoạch động hoặc duyệt gói + ngày lẻ); ví dụ số minh hoạ cụ thể |
| 4.5.6 | **Tính phí phát sinh và quyết toán cọc** | Công thức phí trễ có ân hạn và trần; bảng phí theo tình trạng; công thức quyết toán `hoàn = cọc − tổng phí`, nhánh sinh công nợ khi âm; biên độ quyền hạn dẫn tới trạng thái chờ duyệt |
| 4.5.7 | **Xử lý IPN bất biến** | Vì sao không tin Return URL; các bước: xác thực chữ ký → tra `gateway_txn_id` đã xử lý chưa → giao dịch cập nhật → phản hồi đúng định dạng cổng yêu cầu; xử lý khi cổng gọi lại nhiều lần |

#### 4.6. Thiết kế giao diện người dùng 🖼 *(5 trang)*
- 4.6.1. Nguyên tắc thiết kế: đồng nhất, phản hồi tức thì, hiển thị rõ tiền thuê – tiền cọc – phí (tách bạch để khách không hiểu nhầm), thích ứng nhiều kích thước màn hình.
- 4.6.2. Sơ đồ điều hướng → **Hình 4.9** (khách) và **Hình 4.10** (quản trị), dựng từ bản đồ route Đặc tả §8.1.
- 4.6.3. Danh sách màn hình → **Bảng 4.26**: mã màn hình · tên · vai trò sử dụng · chức năng chính (từ Đặc tả §8.1).
- 4.6.4. Bản phác thảo giao diện (wireframe) cho **5 màn hình trọng điểm** → Hình 4.11–4.15:
  - S03 Chi tiết sản phẩm (chọn ngày + hiển thị còn mấy bộ)
  - S05 Thanh toán (bảng bóc tách tiền)
  - A05 ⭐ Lịch thuê tổng dạng dòng thời gian
  - A09 ⭐ Quầy nhận trả đồ (quét mã, chọn tình trạng, tự tính phí)
  - A10 Hàng đợi giặt ủi/sửa chữa dạng bảng Kanban
- 4.6.5. Thành phần giao diện dùng chung → **Bảng 4.27** (Đặc tả §8.3).

#### 4.7. Thiết kế xử lý nền và thông báo *(2 trang)*
- Bảng 7 tác vụ nền (Đặc tả §7.4): tên · tần suất · công việc · hệ quả nghiệp vụ nếu không chạy.
- Sơ đồ sự kiện – trình lắng nghe: `OrderConfirmed`, `OrderHandedOver`, `OrderReturned`, `UnitStatusChanged` → gửi thông báo, đổi trạng thái cá thể, ghi nhật ký.

#### 4.8. Thiết kế bảo mật *(3 trang)*
Bảng *Nguy cơ — Biện pháp — Nơi hiện thực*, tối thiểu 10 dòng:

| Nguy cơ | Biện pháp |
|---|---|
| Chèn mã SQL | Truy vấn tham số hoá qua ORM |
| XSS | Thoát ký tự khi hiển thị, kiểm tra dữ liệu đầu vào |
| CSRF | Token CSRF / cookie SameSite của Sanctum |
| Truy cập đơn của người khác | Policy `OrderPolicy` + middleware kiểm tra chủ sở hữu |
| Vượt quyền chức năng | Kiểm tra quyền `<module>.<action>` ở cả API lẫn giao diện |
| Giả mạo kết quả thanh toán | Chỉ tin IPN đã xác thực chữ ký; không cập nhật đơn từ Return URL |
| Gọi IPN lặp gây cộng tiền nhiều lần | Xử lý bất biến theo `gateway_txn_id` |
| Lộ dữ liệu cá nhân | Không lưu số giấy tờ tuỳ thân, chỉ lưu ghi chú; mã hoá kênh truyền HTTPS |
| Dò mật khẩu | Giới hạn tần suất đăng nhập, băm mật khẩu bcrypt |
| Nhân viên thao tác sai/gian lận | Nhật ký kiểm toán mọi thay đổi trạng thái, áp/miễn phí, hoàn tiền |

#### 4.9. Yêu cầu phi chức năng và cách đáp ứng *(1–2 trang)*
Bảng đối chiếu `NFR-xx` (đã nêu ở 3.2.2) với giải pháp thiết kế tương ứng. Mục này khép vòng phân tích – thiết kế, hội đồng rất thích.

---

### 2.7. CHƯƠNG 5 — CÀI ĐẶT VÀ KIỂM THỬ *(15–22 trang)*

#### 5.1. Môi trường cài đặt *(1.5 trang)*
Bảng: hệ điều hành · PHP/Laravel · Node/Next.js · MySQL · Redis · công cụ (Docker, Git, Postman, VS Code) · cấu hình máy phát triển. Kèm sơ đồ hoặc mô tả các dịch vụ trong Docker Compose.

#### 5.2. Cấu trúc mã nguồn *(3 trang)*
- 5.2.1. Cấu trúc thư mục phía máy chủ (Đặc tả §9.1) — kèm bảng giải thích vai trò từng thư mục.
- 5.2.2. Cấu trúc thư mục phía giao diện (Đặc tả §9.2).
- 5.2.3. Quy ước lập trình: đặt tên, xử lý lỗi, quản lý phiên bản mã nguồn với Git (nhánh, thông điệp commit).

#### 5.3. Cài đặt các thành phần then chốt ⭐ *(4–5 trang)*
Trích **4–6 đoạn mã** (mỗi đoạn 15–30 dòng, có đánh số dòng và giải thích bên dưới). ⚠ Không chép cả file, không chèn ảnh chụp mã.

1. `AvailabilityService::countAvailableUnits()` — câu truy vấn tình trạng rảnh.
2. ⭐ `OrderService::createOrder()` — giao dịch + khoá bi quan + kiểm tra lại.
3. `PricingService::calculateLine()` — chọn gói giá rẻ nhất.
4. `FeeCalculator` + `SettlementService::settle()` — tính phí và quyết toán cọc.
5. `VnpayController::ipn()` — xác thực chữ ký và xử lý bất biến.
6. `<RentalDatePicker>` — thành phần chọn khoảng ngày có tô màu ngày bận.

#### 5.4. Giao diện kết quả *(4–5 trang)*
Chọn **10–14 màn hình**, mỗi màn hình: một ảnh chụp + 2–4 dòng mô tả chức năng và điểm đáng chú ý. ⚠ Đừng chèn 40 ảnh — chương này không phải sách hướng dẫn sử dụng. Bộ nên chọn: trang chủ, danh sách có bộ lọc theo ngày, chi tiết sản phẩm + chọn ngày, giỏ thuê có đồng hồ giữ chỗ, thanh toán, kết quả thanh toán, đơn của tôi, bảng điều khiển quản trị, xử lý đơn, lịch thuê tổng, quầy nhận trả, Kanban giặt ủi, báo cáo doanh thu.

#### 5.5. Kiểm thử ⭐ *(5–6 trang)*

| Mục con | Nội dung |
|---|---|
| 5.5.1. Chiến lược kiểm thử | Kim tự tháp: kiểm thử đơn vị (dịch vụ tính toán) → kiểm thử tích hợp/chức năng (luồng API) → kiểm thử thủ công theo kịch bản |
| 5.5.2. Kiểm thử đơn vị | Bảng: lớp kiểm thử · hàm được kiểm · số ca · kết quả. Tối thiểu `AvailabilityServiceTest`, `PricingServiceTest`, `FeeCalculatorTest` |
| 5.5.3. Kiểm thử chức năng | `CheckoutTest`, `ReturnAndSettleTest`, `VnpayIpnTest` |
| 5.5.4. ⭐ Kiểm thử tương tranh | **Ngôi sao của chương này.** `DoubleBookingTest`: bắn hai yêu cầu đặt đơn song song cho cùng một cá thể, khẳng định đúng một đơn thành công và một nhận lỗi 409. Trình bày: kịch bản · mã kiểm thử · kết quả chạy (ảnh chụp terminal) · kết luận |
| 5.5.5. Bảng ca kiểm thử thủ công | Bảng ≥ 25 ca: mã · chức năng · dữ liệu vào · kết quả mong đợi · kết quả thực tế · Đạt/Không |
| 5.5.6. Kiểm thử hiệu năng (nếu làm) | Thời gian phản hồi API tình trạng rảnh khi có 1.000/10.000 bản ghi booking; so sánh trước và sau khi đánh chỉ mục — ⭐ số liệu này rất thuyết phục |

#### 5.6. Đánh giá kết quả *(2 trang)*
- Bảng đối chiếu **mục tiêu ở §1.2 ↔ mức độ hoàn thành**, ghi rõ phần chưa làm được.
- Bảng đối chiếu **yêu cầu chức năng FR-xx ↔ trạng thái** (Hoàn thành / Một phần / Chưa làm).
- Ưu điểm và hạn chế của hệ thống — viết trung thực, hội đồng đánh giá cao sự trung thực hơn là tự khen.

---

### 2.8. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN *(2–3 trang)*

- **Kết quả đạt được**: 4–6 gạch đầu dòng, bám sát mục tiêu §1.2, có số liệu (số bảng CSDL, số API, số màn hình, số ca kiểm thử).
- **Đóng góp**: nhắc lại 3 đóng góp đã nêu ở Mở đầu, giờ đã có bằng chứng ở Chương 4–5.
- **Hạn chế**: chưa tích hợp API vận chuyển thật; chưa có ứng dụng di động; cổng thanh toán ở môi trường thử nghiệm; chưa kiểm thử tải quy mô lớn.
- **Hướng phát triển**: mở rộng nhiều chi nhánh; ứng dụng di động cho nhân viên quét mã; gợi ý trang phục theo số đo và dịp; dự báo nhu cầu theo mùa; tính điểm hiệu quả đầu tư cho từng cá thể.

### 2.9. TÀI LIỆU THAM KHẢO & PHỤ LỤC

**Phụ lục nên có:**
- Phụ lục A — Bảng giá trị cấu hình mặc định (Đặc tả Phụ lục A).
- Phụ lục B — Toàn bộ danh mục API dạng bảng đầy đủ.
- Phụ lục C — Kịch bản dữ liệu mẫu dùng để demo.
- Phụ lục D — Bảng ca kiểm thử đầy đủ (nếu §5.5.5 quá dài thì chuyển hết xuống đây).

---

## Phần 3. Danh mục hình vẽ & bảng biểu phải làm

### 3.1. Danh mục hình vẽ *(29 hình)*

| Số hiệu | Tên hình | Loại | Công cụ đề nghị | Nguồn |
|---|---|---|---|---|
| Hình 1.1 | Quy trình cho thuê thủ công hiện tại | Sơ đồ quy trình | draw.io | Khảo sát |
| Hình 2.1 | Các loại sơ đồ UML sử dụng trong đồ án | Sơ đồ khối | draw.io | Tự vẽ |
| Hình 2.2 | Kiến trúc nguyên khối và kiến trúc tách rời | So sánh | draw.io | Tự vẽ |
| Hình 2.3 | Luồng thanh toán trực tuyến qua cổng và IPN | Sơ đồ tuần tự | draw.io | Đặc tả §7.2 |
| Hình 3.1 | Sơ đồ phân rã chức năng hệ thống | Cây chức năng | draw.io | Đặc tả §3.1 |
| Hình 3.2 | Sơ đồ use case tổng quát | UML use case | StarUML/draw.io | Đặc tả §3.2 |
| Hình 3.3 | Use case gói Khách hàng | UML use case | StarUML | Đặc tả §3.2 |
| Hình 3.4 | Use case gói Vận hành cửa hàng | UML use case | StarUML | Đặc tả §3.2 |
| Hình 3.5 | Use case gói Quản trị và hệ thống | UML use case | StarUML | Đặc tả §3.2 |
| Hình 3.6 | Hoạt động: đặt thuê và thanh toán cọc | UML activity (swimlane) | draw.io | Đặc tả §3.3, §3.4 |
| Hình 3.7 | Hoạt động: nhận lại, kiểm tra và quyết toán | UML activity (swimlane) | draw.io | Đặc tả §3.4 |
| Hình 3.8 | Hoạt động: vòng đời cá thể sau khi trả | UML activity | draw.io | Đặc tả §4.2 |
| Hình 3.9 | Tuần tự: kiểm tra tình trạng rảnh | UML sequence | draw.io | Đặc tả §5.1 |
| Hình 3.10 ⭐ | Tuần tự: đặt đơn có khoá bi quan | UML sequence | draw.io | Đặc tả BR-04 |
| Hình 3.11 | Tuần tự: xử lý IPN thanh toán | UML sequence | draw.io | Đặc tả §7.2 |
| Hình 3.12 ⭐ | Trạng thái đơn thuê | UML state machine | draw.io | Đặc tả §4.1 |
| Hình 3.13 ⭐ | Trạng thái cá thể trang phục | UML state machine | draw.io | Đặc tả §4.2 |
| Hình 3.14 | Trạng thái booking và thanh toán | UML state machine | draw.io | Đặc tả §4.3–4.4 |
| Hình 4.1 | Kiến trúc tổng thể hệ thống | Sơ đồ khối | draw.io | Đặc tả §1.4 |
| Hình 4.2 | Phân tầng phía máy chủ | Sơ đồ tầng | draw.io | Đặc tả §9.1 |
| Hình 4.3 | Sơ đồ triển khai | UML deployment | draw.io | Đặc tả §10 |
| Hình 4.4 ⭐ | Sơ đồ thực thể – liên kết (ERD) | ERD | MySQL Workbench / dbdiagram.io | Đặc tả §6.1 |
| Hình 4.5 | Sơ đồ lớp thực thể | UML class | StarUML | Đặc tả §6.2 |
| Hình 4.6 | Sơ đồ lớp tầng nghiệp vụ | UML class | StarUML | Đặc tả §9.1 |
| Hình 4.7 ⭐ | Bốn trường hợp chồng lấn khoảng thời gian | Sơ đồ trục thời gian | draw.io | BR-02, BR-03 |
| Hình 4.8 ⭐ | Xử lý hai yêu cầu đặt đơn đồng thời | Sơ đồ luồng song song | draw.io | BR-04 |
| Hình 4.9 | Sơ đồ điều hướng giao diện khách hàng | Sơ đồ cây | draw.io | Đặc tả §8.1 |
| Hình 4.10 | Sơ đồ điều hướng giao diện quản trị | Sơ đồ cây | draw.io | Đặc tả §8.1 |
| Hình 4.11–4.15 | Wireframe 5 màn hình trọng điểm | Wireframe | Figma / Balsamiq | Đặc tả §8.2 |

> Chương 5 dùng ảnh chụp màn hình thật, đánh số tiếp **Hình 5.1 → 5.n**.

**Mẹo dựng hình nhanh:** ERD ở Đặc tả §6.1 đã viết sẵn dạng mã `mermaid` — dán thẳng vào <https://mermaid.live> để xuất ảnh PNG/SVG, rồi chỉnh lại cho đẹp. Các sơ đồ khối vẽ bằng ký tự trong đặc tả cũng dùng làm bản nháp bố cục để vẽ lại trên draw.io.

### 3.2. Danh mục bảng biểu *(≈ 45 bảng)*

| Số hiệu | Tên bảng | Nguồn |
|---|---|---|
| Bảng 1.1 | Nhược điểm của quy trình thủ công hiện tại | Khảo sát |
| Bảng 1.2 | So sánh các giải pháp cho thuê hiện có | Khảo sát |
| Bảng 1.3 | Phạm vi trong và ngoài đề tài | Đặc tả §1.2, §1.3 |
| Bảng 3.1 ⭐ | Đặc thù nghiệp vụ cho thuê so với bán hàng | Đặc tả §1.1 |
| Bảng 3.2 | Danh sách tác nhân | Đặc tả §2.1 |
| Bảng 3.3 ⭐ | Ma trận phân quyền theo vai trò | Đặc tả §2.2 |
| Bảng 3.4 | Danh sách yêu cầu chức năng FR-xx | Đặc tả §3.1 |
| Bảng 3.5 | Danh sách yêu cầu phi chức năng NFR-xx | Phần 4.7 tài liệu này |
| Bảng 3.6 | Danh sách use case | Đặc tả §3.2 |
| Bảng 3.7–3.12 | Đặc tả chi tiết 6 use case (mỗi use case một bảng) | Đặc tả §3.4 + tự viết |
| Bảng 3.13 ⭐ | Bảng chuyển trạng thái đơn thuê | Đặc tả §4.1 |
| Bảng 3.14 | Ý nghĩa các trạng thái cá thể | Đặc tả §4.2 |
| Bảng 3.15–3.21 ⭐ | Bảy nhóm quy tắc nghiệp vụ BR | Đặc tả §5 |
| Bảng 4.1–4.20 ⭐ | Từ điển dữ liệu các bảng | Đặc tả §6.2 |
| Bảng 4.21 | Ràng buộc toàn vẹn dữ liệu | Đặc tả §6.2–6.3 |
| Bảng 4.22 ⭐ | Thiết kế chỉ mục | Đặc tả §6.2 |
| Bảng 4.23–4.25 | Danh mục API | Đặc tả §7 |
| Bảng 4.26 | Danh sách màn hình | Đặc tả §8.1 |
| Bảng 4.27 | Thành phần giao diện dùng chung | Đặc tả §8.3 |
| Bảng 4.28 | Tác vụ nền theo lịch | Đặc tả §7.4 |
| Bảng 4.29 | Nguy cơ bảo mật và biện pháp | Phần 2.6 tài liệu này |
| Bảng 5.1 | Môi trường cài đặt | Tự viết |
| Bảng 5.2 | Kết quả kiểm thử đơn vị | Tự viết |
| Bảng 5.3 ⭐ | Ca kiểm thử thủ công | Tự viết |
| Bảng 5.4 | Đối chiếu mục tiêu và mức độ hoàn thành | Tự viết |

---

## Phần 4. Ngân hàng nội dung rút từ đặc tả

Phần này chứa nội dung **đã soạn sẵn để chép thẳng vào báo cáo**, chỉ cần biên tập lại câu chữ cho hợp văn phong của bạn.

### 4.1. Danh sách yêu cầu chức năng (mục 3.2.1)

| Mã | Yêu cầu | Tác nhân | Ưu tiên |
|---|---|---|---|
| FR-01 | Quản lý danh mục và dịp sử dụng (cưới, tết, cosplay, biểu diễn) | Manager | Bắt buộc |
| FR-02 | Quản lý sản phẩm: thông tin, ảnh, chất liệu, bảng size, giá trị đền bù | Manager | Bắt buộc |
| FR-03 | Quản lý biến thể theo size × màu kèm giá thuê và tiền cọc riêng | Manager | Bắt buộc |
| FR-04 | Quản lý cá thể trang phục: mã định danh, mã QR, tình trạng, vị trí kệ | Staff, Warehouse | Bắt buộc |
| FR-05 | Quản lý gói giá thuê theo số ngày | Manager | Nên có |
| FR-06 | Duyệt và lọc catalog theo danh mục, size, màu, giá, dịp | Guest, Customer | Bắt buộc |
| FR-07 | Kiểm tra tình trạng rảnh của sản phẩm theo khoảng ngày thuê | Guest, Customer | Bắt buộc |
| FR-08 | Hiển thị lịch bận theo tháng để hỗ trợ chọn ngày | Guest, Customer | Bắt buộc |
| FR-09 | Quản lý giỏ thuê nhiều dòng với khoảng ngày riêng từng dòng | Customer | Bắt buộc |
| FR-10 | Giữ chỗ tạm thời có thời hạn khi thêm vào giỏ | Customer | Bắt buộc |
| FR-11 | Tính tiền chi tiết: tiền thuê, tiền cọc, phí giao nhận, giảm giá | Customer | Bắt buộc |
| FR-12 | Áp dụng mã khuyến mãi theo điều kiện và phạm vi | Customer | Nên có |
| FR-13 | Đặt đơn thuê và chọn hình thức nhận đồ | Customer | Bắt buộc |
| FR-14 | Thanh toán trực tuyến qua cổng thanh toán | Customer | Bắt buộc |
| FR-15 | Ghi nhận thanh toán tiền mặt/chuyển khoản tại quầy | Staff | Bắt buộc |
| FR-16 | Theo dõi đơn và lịch sử thuê của bản thân | Customer | Bắt buộc |
| FR-17 | Huỷ đơn theo chính sách phí huỷ | Customer, Staff | Bắt buộc |
| FR-18 | Yêu cầu gia hạn thời gian thuê | Customer | Nên có |
| FR-19 | Đánh giá sản phẩm sau khi hoàn tất đơn | Customer | Nên có |
| FR-20 | Tạo đơn thuê tại quầy cho khách vãng lai | Staff | Bắt buộc |
| FR-21 | Xác nhận và huỷ đơn phía cửa hàng | Staff, Manager | Bắt buộc |
| FR-22 | Soạn đồ và gán cá thể cụ thể cho từng dòng đơn | Staff, Warehouse | Bắt buộc |
| FR-23 | Bàn giao đồ có quét mã và lập biên bản lúc giao | Staff | Bắt buộc |
| FR-24 | Nhận lại đồ có quét mã và lập biên bản kiểm tra tình trạng | Staff | Bắt buộc |
| FR-25 | Tự động tính phí trễ hạn theo số ngày quá hạn | Hệ thống | Bắt buộc |
| FR-26 | Áp phí hư hỏng, bẩn nặng, mất đồ kèm ảnh minh chứng | Staff | Bắt buộc |
| FR-27 | Miễn hoặc giảm phí phát sinh (chỉ cấp quản lý) | Manager | Bắt buộc |
| FR-28 | Quyết toán tiền cọc, sinh phiếu hoàn tiền hoặc công nợ | Staff, Manager | Bắt buộc |
| FR-29 | Duyệt hoàn tiền vượt hạn mức | Manager | Bắt buộc |
| FR-30 | Quản lý hàng đợi giặt ủi và sửa chữa | Warehouse | Bắt buộc |
| FR-31 | Cập nhật vòng đời cá thể: giặt, sửa, sẵn sàng, thanh lý, báo mất | Warehouse | Bắt buộc |
| FR-32 | Xem lịch thuê tổng dạng dòng thời gian | Staff, Manager | Nên có |
| FR-33 | Quản lý giao nhận hai chiều và trạng thái vận chuyển | Staff | Nên có |
| FR-34 | Quản lý khuyến mãi và giới hạn lượt dùng | Manager | Nên có |
| FR-35 | Kiểm duyệt và trả lời đánh giá của khách | Manager | Nên có |
| FR-36 | Gửi thông báo: xác nhận đơn, nhắc nhận đồ, nhắc trả đồ, kết quả quyết toán | Hệ thống | Bắt buộc |
| FR-37 | Báo cáo doanh thu theo ngày/tháng | Manager | Nên có |
| FR-38 | Báo cáo tỷ lệ khai thác từng cá thể và hàng tồn ế | Manager | Nên có |
| FR-39 | Quản lý người dùng, vai trò và phân quyền | Admin | Bắt buộc |
| FR-40 | Cấu hình tham số hệ thống | Admin | Bắt buộc |
| FR-41 | Ghi nhật ký kiểm toán mọi thao tác nhạy cảm | Hệ thống | Bắt buộc |
| FR-42 | Tự động giải phóng chỗ giữ tạm đã hết hạn | Hệ thống | Bắt buộc |
| FR-43 | Tự động huỷ đơn quá hạn thanh toán | Hệ thống | Bắt buộc |
| FR-44 | Tự động chuyển đơn sang trạng thái quá hạn trả | Hệ thống | Bắt buộc |

### 4.2. Danh sách yêu cầu phi chức năng (mục 3.2.2)

| Mã | Nhóm | Yêu cầu (đo được) |
|---|---|---|
| NFR-01 | Hiệu năng | API kiểm tra tình trạng rảnh cho một trang 20 sản phẩm phản hồi dưới 300 ms với 10.000 bản ghi booking |
| NFR-02 | Hiệu năng | Trang danh sách sản phẩm hiển thị nội dung chính dưới 2 giây trên mạng 4G |
| NFR-03 | Hiệu năng | Hệ thống phục vụ đồng thời tối thiểu 100 phiên người dùng |
| NFR-04 | Toàn vẹn | Không tồn tại hai booking đã xác nhận chồng lấn trên cùng một cá thể — kiểm chứng bằng kiểm thử tương tranh |
| NFR-05 | Toàn vẹn | Mọi thao tác tiền tệ dùng kiểu số thập phân cố định, sai số làm tròn bằng 0 |
| NFR-06 | Toàn vẹn | Đơn hàng lưu bản chụp tên và giá tại thời điểm đặt, không đổi khi cửa hàng sửa giá |
| NFR-07 | Bảo mật | Mật khẩu băm bằng bcrypt; toàn bộ kênh truyền dùng HTTPS |
| NFR-08 | Bảo mật | Không lưu số giấy tờ tuỳ thân và số thẻ của khách |
| NFR-09 | Bảo mật | Chỉ chấp nhận cập nhật trạng thái thanh toán từ IPN đã xác thực chữ ký |
| NFR-10 | Bảo mật | Mỗi thao tác đổi trạng thái đơn, áp/miễn phí, hoàn tiền đều ghi nhật ký gồm người thực hiện, thời điểm, giá trị cũ và mới |
| NFR-11 | Khả dụng | Giao diện hiển thị đúng trên màn hình từ 360 px đến 1920 px |
| NFR-12 | Khả dụng | Mọi thông báo lỗi hiển thị bằng tiếng Việt, nêu rõ nguyên nhân và hành động tiếp theo |
| NFR-13 | Bảo trì | Nghiệp vụ đặt trong tầng dịch vụ, controller không chứa logic nghiệp vụ |
| NFR-14 | Bảo trì | Độ phủ kiểm thử của các lớp tính toán nghiệp vụ đạt tối thiểu 70% |
| NFR-15 | Mở rộng | Cổng thanh toán thiết kế theo giao diện trừu tượng, thêm cổng mới không sửa mã nghiệp vụ đơn hàng |
| NFR-16 | Tin cậy | Tác vụ nền chạy lại được an toàn, gọi lặp không gây sai lệch dữ liệu |

### 4.3. Mẫu đặc tả use case chi tiết (mục 3.6)

Dùng đúng khuôn này cho cả 6 use case để báo cáo nhất quán:

| Mục | Nội dung |
|---|---|
| **Mã use case** | UC-xx |
| **Tên use case** | … |
| **Tác nhân chính** | … |
| **Tác nhân phụ** | … |
| **Mô tả ngắn** | 1–2 câu |
| **Tiền điều kiện** | … |
| **Luồng sự kiện chính** | Đánh số 1, 2, 3… mỗi bước một hành động của tác nhân hoặc hệ thống |
| **Luồng sự kiện phụ** | Đánh số theo bước rẽ nhánh: 4a, 6a… |
| **Luồng ngoại lệ** | 2a, 10a… |
| **Hậu điều kiện** | Trạng thái hệ thống sau khi kết thúc thành công |
| **Quy tắc nghiệp vụ liên quan** | BR-xx, BR-yy |

> Hai use case UC-04 và UC-12+13 đã có sẵn nội dung đầy đủ ở Đặc tả §3.4 — chỉ cần bổ sung dòng *Tác nhân phụ*, *Mô tả ngắn* và *Quy tắc nghiệp vụ liên quan* cho khớp khuôn.

### 4.4. Nội dung soạn sẵn cho mục 4.5.1 — Thuật toán kiểm tra tình trạng rảnh ⭐

> Đoạn dưới đây viết theo văn phong báo cáo, có thể chép và biên tập nhẹ.

**Phát biểu bài toán.** Cho một biến thể sản phẩm `v` và khoảng ngày thuê `[D1, D2]` do khách chọn, cần xác định số cá thể thuộc `v` có thể phục vụ trọn khoảng ngày đó. Điểm khác biệt căn bản so với hệ thống bán hàng là tồn kho không phải một con số cố định, mà là một hàm phụ thuộc thời gian: cùng một cá thể có thể "hết" trong khoảng ngày này nhưng "còn" trong khoảng ngày khác.

**Khoảng bận thực tế.** Một lượt thuê không chỉ chiếm dụng cá thể trong đúng khoảng khách giữ đồ. Trước ngày giao cần thời gian soạn và kiểm tra, sau ngày trả cần thời gian giặt ủi. Do đó khoảng bận thực tế được mở rộng hai đầu:

```
busy_from = pickup_date − prep_buffer_days
busy_to   = return_date + clean_buffer_days
```

Trong đó `clean_buffer_days` được cấu hình theo từng danh mục vì thời gian xử lý khác nhau đáng kể — váy cưới cần 2 ngày, áo dài 1 ngày, phụ kiện có thể bằng 0.

**Điều kiện chồng lấn.** Hai khoảng thời gian `[a₁, a₂]` và `[b₁, b₂]` giao nhau khi và chỉ khi `a₁ ≤ b₂` và `b₁ ≤ a₂`. Điều kiện này ngắn hơn và ít sai sót hơn cách liệt kê bốn trường hợp riêng lẻ, đồng thời chuyển thẳng được thành mệnh đề `WHERE` của câu truy vấn.

**Định nghĩa hình thức.** Cá thể `U` rảnh trong `[D1, D2]` khi thoả đồng thời hai điều kiện: (1) trạng thái của `U` là *sẵn sàng*; (2) không tồn tại booking `B` của `U` với trạng thái thuộc {*giữ tạm*, *đã xác nhận*} mà khoảng bận của `B` chồng lấn khoảng bận suy rộng của yêu cầu.

**Cài đặt.** Truy vấn dùng mệnh đề `NOT EXISTS`; hai cột `busy_from`, `busy_to` được tính sẵn và lưu trực tiếp trong bảng booking thay vì tính lúc truy vấn, nhờ đó đánh được chỉ mục tổ hợp `(rental_unit_id, busy_from, busy_to)`. Đây là một trường hợp phi chuẩn hoá có chủ đích: chấp nhận dư thừa dữ liệu để đổi lấy tốc độ truy vấn, với cái giá là phải cập nhật lại hai cột này mỗi khi ngày thuê thay đổi.

**Độ phức tạp.** Với chỉ mục nêu trên, mỗi phép kiểm tra một cá thể là một lần dò chỉ mục, chi phí `O(log n)`; tổng chi phí kiểm tra một biến thể có `k` cá thể là `O(k · log n)` với `n` là số booking. Trên thực tế `k` thường nhỏ (dưới 20), nên truy vấn giữ được thời gian phản hồi ổn định khi lượng booking tăng.

**Trường hợp biên cần xử lý.** Thuê và trả trong cùng một ngày (số ngày tính bằng 1); khoảng ngày nằm ngoài cửa sổ đặt trước cho phép; cá thể đang ở trạng thái sửa chữa hoặc thanh lý; booking giữ tạm đã hết hạn nhưng tác vụ giải phóng chưa kịp chạy — trường hợp cuối cần loại trừ ngay trong truy vấn bằng điều kiện về thời điểm hết hạn.

### 4.5. Nội dung soạn sẵn cho mục 4.5.2 — Chống đặt trùng ⭐

**Tình huống.** Hai khách cùng chọn chiếc áo dài cuối cùng cho ngày 20/10 và bấm đặt đơn cách nhau vài mili-giây. Nếu chỉ kiểm tra tình trạng rảnh rồi mới ghi booking mà không có cơ chế bảo vệ, cả hai lần kiểm tra đều diễn ra trước khi bản ghi đầu tiên được lưu, kết quả là cả hai đơn đều thành công và cửa hàng thiếu một bộ đồ vào ngày giao.

**Giải pháp.** Toàn bộ thao tác đặt đơn được bọc trong một giao dịch cơ sở dữ liệu. Ngay đầu giao dịch, các bản ghi cá thể liên quan bị khoá bi quan bằng `SELECT … FOR UPDATE`; luồng thứ hai phải chờ cho tới khi luồng thứ nhất kết thúc. Sau khi giành được khoá, hệ thống **kiểm tra lại tình trạng rảnh một lần nữa bên trong giao dịch** — đây là bước then chốt, vì kết quả kiểm tra ở màn hình giỏ hàng đã có thể lỗi thời. Nếu kiểm tra lại thất bại, giao dịch bị huỷ bỏ và hệ thống trả về mã lỗi 409 kèm danh sách món đã mất để giao diện gợi ý biến thể hoặc ngày khác.

**Các lớp bảo vệ bổ sung.** Một chỉ mục duy nhất trên cặp cá thể và ngày bắt đầu bận đóng vai trò chốt chặn cuối ở tầng cơ sở dữ liệu, phòng trường hợp có luồng nào đó lọt qua tầng ứng dụng. Một khoá phân tán trên Redis theo mã biến thể được đặt trước khi vào giao dịch nhằm giảm số luồng cùng tranh khoá ở tầng cơ sở dữ liệu, qua đó rút ngắn thời gian chờ.

**Vì sao chọn khoá bi quan.** Khoá lạc quan (so sánh phiên bản rồi thử lại) phù hợp khi xung đột hiếm. Ở đây xung đột lại tập trung đúng vào các sản phẩm phổ biến trong mùa cao điểm — tức là xảy ra thường xuyên và có tính bùng nổ, nên chi phí thử lại nhiều lần sẽ lớn hơn chi phí chờ khoá. Ngoài ra, số bản ghi bị khoá trong mỗi giao dịch rất nhỏ và thời gian giữ khoá tính bằng mili-giây, nên rủi ro tắc nghẽn thấp.

**Kiểm chứng.** Xem mục 5.5.4 — kiểm thử tự động bắn hai yêu cầu đặt đơn song song cho cùng một cá thể và khẳng định đúng một yêu cầu thành công.

### 4.6. Bảng ánh xạ Quy tắc nghiệp vụ → Nơi hiện thực (dùng cho mục 3.10)

| Nhóm BR | Mã | Hiện thực tại |
|---|---|---|
| Tồn kho & lịch bận | BR-01 → BR-07 | `AvailabilityService`, bảng `bookings`, tác vụ `ReleaseExpiredHolds` |
| Giá thuê & tiền cọc | BR-10 → BR-14 | `PricingService`, bảng `pricing_tiers` |
| Huỷ đơn & hoàn tiền | BR-20 → BR-23 | `OrderService`, `RefundService`, `OrderPolicy` |
| Phí phát sinh | BR-30 → BR-34 | `FeeCalculator`, `SettlementService`, `InspectionService`, `FeePolicy` |
| Gia hạn | BR-40 → BR-42 | `OrderService`, `AvailabilityService` |
| Khuyến mãi | BR-50 → BR-52 | `PricingService`, bảng `promotions` |
| Đánh giá & nhật ký | BR-60 → BR-62 | `ReviewController`, listener `WriteAuditLog`, bảng `order_status_logs`, `unit_logs` |

### 4.7. Danh mục từ viết tắt (phần thủ tục)

| Viết tắt | Tiếng Anh | Tiếng Việt |
|---|---|---|
| API | Application Programming Interface | Giao diện lập trình ứng dụng |
| BFD | Business Function Diagram | Sơ đồ phân rã chức năng |
| CRS | Costume Rental System | Hệ thống cho thuê trang phục |
| CSDL | Database | Cơ sở dữ liệu |
| ERD | Entity Relationship Diagram | Sơ đồ thực thể – liên kết |
| HTTP/HTTPS | HyperText Transfer Protocol (Secure) | Giao thức truyền siêu văn bản (bảo mật) |
| IPN | Instant Payment Notification | Thông báo thanh toán tức thời |
| ISR | Incremental Static Regeneration | Sinh lại trang tĩnh tăng dần |
| JSON | JavaScript Object Notation | Định dạng dữ liệu JSON |
| MVC | Model – View – Controller | Mô hình MVC |
| ORM | Object Relational Mapping | Ánh xạ đối tượng – quan hệ |
| QR | Quick Response code | Mã phản hồi nhanh |
| RBAC | Role-Based Access Control | Điều khiển truy cập theo vai trò |
| REST | Representational State Transfer | Kiến trúc REST |
| SEO | Search Engine Optimization | Tối ưu hoá công cụ tìm kiếm |
| SQL | Structured Query Language | Ngôn ngữ truy vấn có cấu trúc |
| SSR | Server Side Rendering | Kết xuất phía máy chủ |
| TTL | Time To Live | Thời gian sống của bản ghi tạm |
| UML | Unified Modeling Language | Ngôn ngữ mô hình hoá thống nhất |

### 4.8. Sáu câu hỏi hội đồng và câu trả lời chuẩn bị sẵn

Đưa vào **Phụ lục** hoặc dùng để luyện bảo vệ. Mỗi câu trả lời nên nêu kèm số mục trong báo cáo để trỏ hội đồng tới đó.

| Câu hỏi | Trả lời cốt lõi | Chỉ tới mục |
|---|---|---|
| Hai người cùng đặt một bộ đồ thì sao? | Giao dịch + khoá bi quan trên cá thể, kiểm tra lại tình trạng rảnh bên trong giao dịch, người sau nhận lỗi 409; có kiểm thử tự động chứng minh | §4.5.2, §5.5.4 |
| Sao không dùng một cột số lượng tồn cho đơn giản? | Vì đồ quay vòng: cùng một bộ vừa hết ngày 12/10 vừa còn ngày 20/10. Tồn kho là lịch bận theo thời gian, không phải một con số | §3.1, §4.2.6 |
| Đồ vừa trả có cho thuê ngay hôm sau được không? | Không, có thời gian đệm giặt ủi cấu hình theo danh mục, được cộng vào khoảng bận | §4.5.1 |
| Khách làm hỏng đồ thì xử lý ra sao? | Biên bản kiểm tra hai chiều có ảnh minh chứng, bảng phí cấu hình sẵn, quyết toán trên tiền cọc, vượt hạn mức thì chuyển quản lý duyệt | §3.6 (UC-12+13), §4.5.6 |
| Vì sao tách riêng phần giao diện và phần máy chủ? | Phần giao diện lo SEO và trải nghiệm chọn ngày, phần máy chủ lo nghiệp vụ và giao dịch; hai bên kiểm thử và mở rộng độc lập | §4.1.3 |
| Bảo mật thanh toán thế nào? | Chỉ tin IPN đã xác thực chữ ký, xử lý bất biến theo mã giao dịch của cổng, không bao giờ cập nhật đơn từ đường dẫn quay về | §4.5.7, §4.8 |

---

## Phần 5. Thư viện prompt viết từng chương

Dùng khi nhờ trợ lý AI viết nháp. **Luôn đính kèm file đặc tả** cùng prompt, và luôn tự đọc lại, sửa lại trước khi đưa vào báo cáo — văn AI viết thường đều đều, thiếu chính kiến, hội đồng nhận ra ngay.

**Prompt khung dùng chung — dán ở đầu mọi lần hỏi:**

> Bạn đang giúp mình viết báo cáo đồ án tốt nghiệp ngành Công nghệ thông tin, đề tài "Xây dựng hệ thống cho thuê trang phục". File đính kèm là bản đặc tả hệ thống. Yêu cầu chung: viết tiếng Việt học thuật, xưng "hệ thống"/"đề tài", không xưng "tôi/mình/chúng ta"; văn xuôi liền mạch, hạn chế gạch đầu dòng trừ khi liệt kê thật sự; mỗi khẳng định kỹ thuật phải kèm lý do; không bịa số liệu; thuật ngữ tiếng Anh chỉ để trong ngoặc sau thuật ngữ tiếng Việt ở lần xuất hiện đầu tiên.

| Mục cần viết | Prompt |
|---|---|
| Mở đầu | "Viết phần Mở đầu 2 trang gồm 4 đoạn: bối cảnh nhu cầu thuê trang phục tại Việt Nam, hạn chế của cách quản lý thủ công, giải pháp đề xuất, ba đóng góp chính và bố cục 5 chương." |
| 1.5 Hiện trạng | "Viết mục Khảo sát hiện trạng: mô tả quy trình cho thuê thủ công theo 7 bước từ lúc khách hỏi đến lúc trả đồ, sau đó phân tích 6 nhược điểm kèm hệ quả cụ thể. Trình bày phần nhược điểm dưới dạng bảng." |
| 1.6 Giải pháp hiện có | "Lập bảng so sánh 4 giải pháp quản lý cho thuê hiện có theo 6 tiêu chí: quản lý tới cấp cá thể, thời gian đệm giặt ủi, quản lý tiền cọc và phí phạt, hỗ trợ tiếng Việt, chi phí, khả năng tuỳ biến. Kết luận khoảng trống mà đề tài lấp vào. Nếu không chắc thông tin của sản phẩm nào, hãy ghi rõ là cần kiểm chứng thay vì đoán." |
| Chương 2 | "Viết mục 2.x về <công nghệ>. Cấu trúc: khái niệm cốt lõi, các thành phần chính, và bắt buộc kết thúc bằng đoạn 'Ứng dụng trong đề tài' nêu rõ đề tài dùng thành phần nào của công nghệ này cho chức năng nào. Độ dài <n> trang." |
| 3.1 Đặc thù nghiệp vụ | "Từ bảng 4 điểm khác biệt giữa cho thuê và bán hàng trong đặc tả, viết 4 đoạn văn, mỗi đoạn phân tích một điểm: nêu hiện tượng nghiệp vụ, hệ quả kỹ thuật, và cách hệ thống giải quyết." |
| 3.6 Đặc tả use case | "Viết đặc tả chi tiết use case <UC-xx: tên> theo khuôn 11 mục: mã, tên, tác nhân chính, tác nhân phụ, mô tả ngắn, tiền điều kiện, luồng chính đánh số, luồng phụ, luồng ngoại lệ, hậu điều kiện, quy tắc nghiệp vụ liên quan. Trình bày dạng bảng hai cột." |
| 3.10 Quy tắc nghiệp vụ | "Chuyển nhóm quy tắc <BR-xx đến BR-yy> trong đặc tả thành bảng 4 cột: mã, phát biểu quy tắc, lý do nghiệp vụ, nơi hiện thực. Phát biểu quy tắc viết đủ câu, không viết tắt kiểu ghi chú." |
| 4.2.6 Quyết định thiết kế | "Với mỗi quyết định thiết kế cơ sở dữ liệu sau, viết một đoạn theo cấu trúc: quyết định là gì, lý do chọn, và cái giá phải trả của lựa chọn đó. Danh sách: <5 quyết định>." |
| 4.5 Thuật toán | "Viết mục thuật toán <tên> theo 5 phần: phát biểu bài toán, ý tưởng giải quyết, mã giả có đánh số dòng, đoạn mã hoặc câu truy vấn then chốt kèm giải thích, phân tích độ phức tạp và các trường hợp biên." |
| 5.5 Kiểm thử | "Lập bảng 25 ca kiểm thử thủ công cho hệ thống, phủ đủ các luồng: tìm kiếm theo ngày, giữ chỗ hết hạn, đặt đơn thành công, đặt đơn khi hết đồ, thanh toán thành công/thất bại, huỷ đơn ở các mốc thời gian khác nhau, bàn giao, trả đúng hạn, trả trễ, trả đồ hư hỏng, quyết toán dương và âm, phân quyền miễn phí. Cột: mã, chức năng, tiền điều kiện, dữ liệu vào, kết quả mong đợi." |
| Kết luận | "Viết Kết luận 2 trang gồm: kết quả đạt được đối chiếu với các mục tiêu cụ thể đã nêu, ba đóng góp chính, bốn hạn chế trình bày trung thực, và năm hướng phát triển." |

⚠ **Ba việc AI không nên làm thay bạn:** (1) số liệu khảo sát thực tế; (2) ảnh chụp màn hình và kết quả chạy kiểm thử; (3) phần đánh giá ưu nhược điểm của chính hệ thống mình làm.

---

## Phần 6. Kế hoạch viết theo tuần

Giả định 8 tuần viết báo cáo song song với hoàn thiện mã nguồn.

| Tuần | Việc chính | Sản phẩm cuối tuần |
|---|---|---|
| 1 | Chốt quy cách với GVHD; dựng khung Word đủ tiêu đề 3 cấp, thiết lập Heading style, Caption, mục lục tự động | File `BaoCao.docx` khung rỗng đánh số chuẩn |
| 2 | Khảo sát hiện trạng, viết Chương 1 trọn vẹn | Chương 1 xong bản thảo |
| 3 | Viết Chương 2; song song vẽ Hình 2.1–2.3 | Chương 2 xong bản thảo |
| 4 ⭐ | Vẽ toàn bộ hình Chương 3 (Hình 3.1–3.15); viết 3.1–3.5 | Bộ hình Chương 3 + nửa đầu Chương 3 |
| 5 ⭐ | Viết 3.6–3.10 (đặc tả use case + quy tắc nghiệp vụ) | Chương 3 xong |
| 6 ⭐ | Vẽ ERD + sơ đồ lớp; viết 4.1–4.4 (kiến trúc + CSDL + API) | Nửa đầu Chương 4 |
| 7 ⭐ | Viết 4.5 (thuật toán lõi) + 4.6–4.9 | Chương 4 xong |
| 8 | Chụp màn hình, chạy kiểm thử lấy kết quả thật, viết Chương 5 + Kết luận; chạy checklist Phần 7 | Bản nộp |

> Nếu chỉ còn 4 tuần: gộp tuần 2–3 (Chương 1+2 viết gọn hơn 30%), giữ nguyên thời lượng cho tuần 4–7. **Không được cắt Chương 3 và 4** — đó là chỗ lấy điểm.

---

## Phần 7. Checklist rà soát trước khi nộp

### 7.1. Hình thức

- [ ] Mục lục, danh mục hình, danh mục bảng đều **tự sinh** và đã cập nhật lần cuối (Ctrl+A → F9)
- [ ] Mọi hình có caption ở dưới, mọi bảng có caption ở trên, đánh số liên tục theo chương
- [ ] **Mọi hình và bảng đều được dẫn chiếu ít nhất một lần trong văn** — rà bằng cách tìm chuỗi "Hình 3." và đếm
- [ ] Không có hình nào bị vỡ nét, chữ trong hình đọc được khi in đen trắng
- [ ] Không có bảng nào bị tách trang giữa chừng làm mất dòng tiêu đề
- [ ] Mỗi chương bắt đầu ở trang mới bằng Page Break
- [ ] Đánh số trang đúng: La Mã cho phần đầu, Ả Rập từ Mở đầu
- [ ] Font, cỡ chữ, giãn dòng đồng nhất toàn bài (chọn tất cả → kiểm tra)
- [ ] Không còn chữ đỏ, chữ vàng highlight, hay ghi chú "TODO" sót lại

### 7.2. Nội dung

- [ ] Chương 3 + Chương 4 chiếm ≥ 55% số trang phần chính
- [ ] Mỗi mục lý thuyết ở Chương 2 đều có đoạn "Ứng dụng trong đề tài"
- [ ] Mọi quyết định thiết kế ở Chương 4 đều có nêu lý do
- [ ] Mục 4.2.6 nêu được **cái giá phải trả** của từng quyết định, không chỉ nêu cái lợi
- [ ] Mục tiêu ở §1.2 đều xuất hiện lại trong bảng đối chiếu ở §5.6
- [ ] Số hiệu FR-xx, NFR-xx, UC-xx, BR-xx dùng nhất quán, không nhảy số, không trùng
- [ ] Không có mâu thuẫn số liệu giữa các chương (ví dụ số bảng CSDL nêu ở Chương 4 và ở Kết luận)
- [ ] Ảnh chụp màn hình ở Chương 5 là dữ liệu tiếng Việt hợp lý, không còn `test test`, `aaa`, `123`
- [ ] Kết quả kiểm thử là kết quả chạy thật, không phải bảng điền tay

### 7.3. Trích dẫn và liêm chính học thuật

- [ ] Mọi hình/bảng lấy từ nguồn ngoài đều ghi "Nguồn: [x]"
- [ ] Tài liệu tham khảo ≥ 8 mục, đánh số theo thứ tự trích dẫn, có ngày truy cập cho tài liệu web
- [ ] Mọi số `[x]` trong bài đều tồn tại trong danh mục và ngược lại
- [ ] Đã kiểm tra trùng lặp nếu trường yêu cầu

### 7.4. Chuẩn bị bảo vệ

- [ ] Đã luyện 6 câu hỏi ở Phần 4.8, mỗi câu trả lời trong 60 giây
- [ ] Chuẩn bị **demo kiểm thử tương tranh chạy trực tiếp** — đây là màn ấn tượng nhất
- [ ] Dữ liệu mẫu đủ đẹp để demo: ≥ 20 sản phẩm có ảnh thật, ≥ 60 cá thể, ≥ 30 đơn ở đủ các trạng thái
- [ ] Có kịch bản demo 8 phút: tìm theo ngày → đặt đơn → thanh toán → soạn đồ → bàn giao → trả đồ có hư hỏng → quyết toán → xem lịch tổng
- [ ] Slide ≤ 20 trang, trong đó ≥ 8 trang cho Chương 3–4

---

## Phần 8. Lỗi thường gặp & cách tránh

| # | Lỗi | Vì sao bị trừ điểm | Cách tránh |
|---|---|---|---|
| 1 | Chương 5 dài hơn Chương 4 vì chèn quá nhiều ảnh màn hình | Biến báo cáo phân tích thiết kế thành sách hướng dẫn sử dụng | Giới hạn 10–14 ảnh, mỗi ảnh ≤ 1/2 trang |
| 2 | Chương 2 chép nguyên định nghĩa từ tài liệu framework | Không thể hiện được năng lực chọn lọc | Bắt buộc có đoạn "Ứng dụng trong đề tài" cho mỗi mục |
| 3 | ERD vẽ đủ bảng nhưng không giải thích quyết định thiết kế | Mất trọn phần điểm "thiết kế" | Viết kỹ mục 4.2.6 |
| 4 | Trình bày hệ thống cho thuê y hệt hệ thống bán hàng | Hội đồng kết luận đề tài không có độ khó | Đẩy mục 3.1 và 4.5.1 lên làm điểm nhấn |
| 5 | Sơ đồ use case dùng sai `<<include>>` / `<<extend>>` | Sai kiến thức nền UML | Include = luôn xảy ra; Extend = có điều kiện |
| 6 | Nêu yêu cầu phi chức năng chung chung ("hệ thống phải nhanh") | Không kiểm chứng được | Mọi NFR phải có con số — xem Phần 4.2 |
| 7 | Không nhắc gì tới xử lý đồng thời | Bỏ mất điểm kỹ thuật cao nhất của đề tài | Mục 4.5.2 + kiểm thử 5.5.4 |
| 8 | Dùng kiểu số thực để lưu tiền | Sai nghiệp vụ tài chính, hội đồng bắt lỗi ngay | Nêu rõ dùng `decimal(12,2)` và giải thích lý do |
| 9 | Cập nhật trạng thái đơn từ đường dẫn quay về của cổng thanh toán | Lỗ hổng bảo mật nghiêm trọng | Nêu rõ chỉ tin IPN đã xác thực chữ ký |
| 10 | Mục lục gõ tay, số trang sai sau khi sửa bài | Lỗi hình thức rất dễ thấy | Dùng Heading style + cập nhật trước khi in |
| 11 | Bảng chuyển trạng thái không khớp với sơ đồ trạng thái | Mâu thuẫn nội tại | Vẽ sơ đồ trước, sinh bảng từ sơ đồ |
| 12 | Kết luận chỉ toàn tự khen, không nêu hạn chế | Thiếu tính khoa học | Nêu đủ 4 hạn chế thật |

---

## Phụ lục A. Bảng ánh xạ Đặc tả → Báo cáo

| Mục trong đặc tả | Dùng cho mục nào của báo cáo | Mức xử lý |
|---|---|---|
| §1.1 Bài toán (4 điểm khác biệt) | Mở đầu, §1.1, **§3.1** | Diễn giải thành văn xuôi |
| §1.2 Phạm vi | §1.3 | Chép + làm bảng |
| §1.3 Ngoài phạm vi | §1.3, Kết luận (hạn chế) | Chép |
| §1.4 Kiến trúc tổng thể | **§4.1.1** | Vẽ lại thành hình chuyên nghiệp |
| §2.1 Actor | §3.3.1 | Chép + mô tả thêm |
| §2.2 Ma trận phân quyền | §3.3.2 | Chép nguyên |
| §3.1 Bản đồ chức năng | §3.2.1 (FR), **§3.4 (BFD)** | Chuyển thành FR-xx + vẽ sơ đồ |
| §3.2 Danh sách use case | §3.5.5 | Chép nguyên |
| §3.3 Luồng nghiệp vụ | §3.7 (sơ đồ hoạt động) | Chuyển thành sơ đồ UML |
| §3.4 Đặc tả use case | §3.6 | Chép + bổ sung theo khuôn 11 mục |
| §4.1 Trạng thái đơn | **§3.9 + Bảng 3.13** | Vẽ lại + chép bảng chuyển |
| §4.2 Trạng thái cá thể | §3.9, §3.7 (Hình 3.8) | Vẽ lại |
| §4.3, §4.4 | §3.9 (gộp 1 hình) | Vẽ lại |
| §5.1 Tồn kho & lịch bận | **§3.10 + §4.5.1 + §4.5.2** | Chia đôi: quy tắc ở C3, thuật toán ở C4 |
| §5.2 Giá & cọc | §3.10 + §4.5.5 | Chia đôi |
| §5.3 Huỷ & hoàn tiền | §3.10 | Làm bảng |
| §5.4 Phí phát sinh | §3.10 + **§4.5.6** | Chia đôi |
| §5.5–5.7 | §3.10 | Làm bảng |
| §6.1 ERD | **§4.2.1** | Xuất hình từ mã mermaid |
| §6.2 Đặc tả bảng | **§4.2.3** từ điển dữ liệu | Chuẩn hoá về cùng một dạng bảng 6 cột |
| §6.3 Ghi chú thiết kế | **§4.2.6** | Mở rộng mỗi ý thành 1 đoạn có phân tích đánh đổi |
| §7.1–7.3 API | §4.4.3, Phụ lục B | Chép bảng |
| §7.2 Webhook | §4.4.4, **§4.5.7**, §4.8 | Viết kỹ phần bảo mật |
| §7.4 Job nền | §4.7 | Chép + thêm cột hệ quả |
| §8.1 Bản đồ route | §4.6.2, §4.6.3 | Vẽ sơ đồ điều hướng |
| §8.2 Wireframe | §4.6.4 | Vẽ lại bằng Figma |
| §8.3 Component | §4.6.5 | Chép bảng |
| §9.1, §9.2 Cấu trúc thư mục | §5.2 | Chép + bảng giải thích |
| §10 Lộ trình | §1.4 (phương pháp), §5.1 | Tóm tắt |
| §10.1 Ba điểm quyết định | Mở đầu (đóng góp), Kết luận | Viết thành đóng góp của đề tài |
| §10.2 Câu hỏi hội đồng | Phụ lục + luyện bảo vệ | Giữ nguyên |
| Phụ lục A cấu hình | Phụ lục A báo cáo | Chép nguyên |
| Phụ lục B thuật ngữ | Danh mục từ viết tắt + §2.9 | Tách làm hai chỗ |

---

## Phụ lục B. Mẫu tài liệu tham khảo

Định dạng gợi ý (kiểu IEEE rút gọn, phổ biến trong đồ án CNTT Việt Nam):

**Tiếng Việt**

```
[1]  Nguyễn Văn A, Phân tích và thiết kế hệ thống thông tin, NXB Giáo dục Việt Nam, 2020.
[2]  Trần Thị B, Giáo trình Cơ sở dữ liệu, NXB Đại học Quốc gia TP.HCM, 2019.
```

**Tiếng Anh**

```
[3]  C. Larman, Applying UML and Patterns: An Introduction to Object-Oriented Analysis
     and Design and Iterative Development, 3rd ed., Prentice Hall, 2004.
[4]  M. Fowler, Patterns of Enterprise Application Architecture, Addison-Wesley, 2002.
[5]  E. Gamma et al., Design Patterns: Elements of Reusable Object-Oriented Software,
     Addison-Wesley, 1994.
[6]  R. Elmasri and S. Navathe, Fundamentals of Database Systems, 7th ed., Pearson, 2016.
```

**Tài liệu trực tuyến** *(bắt buộc ghi ngày truy cập)*

```
[7]  Laravel, "Laravel Documentation," https://laravel.com/docs — truy cập 09/2026.
[8]  Vercel, "Next.js Documentation," https://nextjs.org/docs — truy cập 09/2026.
[9]  Oracle, "MySQL 8.0 Reference Manual," https://dev.mysql.com/doc/ — truy cập 09/2026.
[10] Redis Ltd., "Redis Documentation," https://redis.io/docs — truy cập 09/2026.
[11] VNPAY, "Tài liệu tích hợp cổng thanh toán VNPAY," https://sandbox.vnpayment.vn/apis/
     — truy cập 09/2026.
```

⚠ Thay tên và thông tin sách tiếng Việt bằng giáo trình thật mà khoa bạn dùng — **không được để nguyên tên minh hoạ ở [1] và [2]**.

---

*Tài liệu triển khai viết báo cáo — Dự án "Cho thuê trang phục" · Lê Võ Nhật Pin · 09/2026*
