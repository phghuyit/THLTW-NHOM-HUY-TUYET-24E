# src/lib

Tiện ích dùng chung cho **cả giao diện khách và trang quản trị**.
Đây là lý do chính để gộp hai frontend làm một — hai bên phải dùng
chung đúng một bản logic, không được có hai bản copy lệch nhau.

| File | Nội dung | Task |
|---|---|---|
| `api-client.ts` | Wrapper fetch, gắn `Authorization: Bearer`, parse lỗi `{message, errors, code}` | FND-00 |
| `money.ts` | Định dạng VNĐ, tránh sai số làm tròn | FND-00 |
| `date.ts` | Tính `rental_days` **tính cả hai đầu** (BR-10), format ngày | FND-00 |
| `validators.ts` | Zod schema dùng chung cho form | FND-00 |
