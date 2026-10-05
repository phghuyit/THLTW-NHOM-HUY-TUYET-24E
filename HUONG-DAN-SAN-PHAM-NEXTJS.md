# Ghi chú thực hành Next.js: từ sản phẩm nổi bật

Project: THLTW-NHOM-HUY-TUYET-24E. Frontend Next.js App Router, backend Laravel.
Các đường dẫn bên dưới tính từ thư mục gốc project. Code “trước/sau” chỉ ghi phần cần thay đổi; giữ nguyên các phần khác.

## 1. Chạy và kiểm tra API

Mở hai terminal riêng:

```powershell
# Terminal backend, từ thư mục gốc
cd backend
php artisan serve
```

```powershell
# Terminal frontend, từ thư mục gốc
cd frontend
npm run dev
```

Postman: `GET http://127.0.0.1:8000/api/products`.
Phản hồi Laravel có `data` (sản phẩm), `meta` (phân trang). Không chạy npm ở thư mục gốc vì package.json nằm trong frontend.

## 2. Lọc sản phẩm nổi bật ở backend

**Sửa:** `backend/app/Http/Controllers/ProductController.php`, hàm `index()`.

Trước:

```php
public function index()
{
    $products = Product::with(['category:id,name', 'brand:id,name'])
        ->active()->latest()->paginate(12);
    return ProductResource::collection($products);
}
```

Sau:

```php
public function index(Request $request)
{
    $products = Product::with(['category:id,name', 'brand:id,name'])
        ->active();

    if ($request->boolean('featured')) {
        $products->where('is_featured', true);
    }

    $products = $products->latest()->paginate(12);
    return ProductResource::collection($products);
}
```

`Request` đã được import trong file. `featured` là tham số URL, `is_featured` là cột database. Phải lọc **trước** `paginate()`: sau phân trang, truy vấn đã chạy.

- `/api/products`: danh sách sản phẩm đang hoạt động, 12 sản phẩm/trang.
- `/api/products?featured=1`: chỉ sản phẩm nổi bật.
- `/api/products?page=2`: trang 2.

## 3. Khai báo kiểu dữ liệu

**Tạo:** `frontend/src/types/product.ts` (trước chưa có).

```ts
export interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  rental_price_per_day: string | number;
  is_featured: boolean;
}

export interface ProductListResponse {
  data: Product[];
}
```

`interface` mô tả dữ liệu; không tự gọi API. `Product[]` là danh sách sản phẩm. `@/` trỏ đến `src`. Giá cho phép string vì Laravel có thể trả decimal dưới dạng chuỗi.

## 4. Viết hàm gọi API

**Tạo:** `frontend/src/app/lib/product.ts`.

Bản đơn giản ban đầu:

```ts
export async function getFeaturedProducts() {
  const response = await fetch(
    "http://127.0.0.1:8000/api/products?featured=1"
  );
  const result = await response.json();
  return result.data;
}
```

`async` cho phép dùng `await`; `fetch` gọi API; `.json()` đọc JSON; `result.data` lấy danh sách. Hàm chạy trên server khi được gọi từ page hiện tại. Bản học này chưa thêm xử lý lỗi API.

## 5. Gọi hàm trong trang chủ

**Sửa:** `frontend/src/app/page.tsx`.

Trước: `Home()` chỉ trả giao diện tĩnh.

Sau, kiểm tra số sản phẩm trước:

```tsx
import { getFeaturedProducts } from "./lib/product";

export default async function Home() {
  const products = await getFeaturedProducts();
  return (
    <main className="flex-1 p-6">
      <h1>Sản phẩm nổi bật</h1>
      <p>Có {products.length} sản phẩm nổi bật</p>
    </main>
  );
}
```

Nếu `await` báo đỏ, kiểm tra hàm có `async` chưa. Đổi `p-90` thành `p-6` để bỏ khoảng đệm quá lớn. Không cần import globals.css lần nữa vì layout đã nạp.

## 6. Hiển thị từng sản phẩm và chia 3 cột

**Sửa:** `frontend/src/app/page.tsx`; thêm import:

```tsx
import type { Product } from "@/types/product";
```

Thêm dưới dòng đếm:

```tsx
<div className="mt-6 grid grid-cols-3 gap-6">
  {products.map((product: Product) => (
    <div key={product.id} className="border p-4">
      <h2>{product.name}</h2>
      <p>Giá thuê mỗi ngày: {product.rental_price_per_day} đồng</p>
    </div>
  ))}
</div>
```

Trước lưới là `className="mt-6"`, thẻ có `mb-4`. Sau dùng `grid grid-cols-3 gap-6`, bỏ `mb-4` vì gap đã tạo khoảng cách.

`map` tạo một thẻ cho mỗi sản phẩm; `key` giúp React phân biệt thẻ. Dữ liệu API thay đổi số lượng nên dùng map thay vì viết cứng.

## 7. Thêm ảnh, rồi tách ProductCard

**Tạo:** `frontend/src/app/components/ProductCard.tsx`.
Trước: phần ảnh/tên/giá viết trực tiếp trong map của page.
Sau: chuyển vào component riêng:

```tsx
import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border p-4">
      {product.thumbnail && (
        <Image
          src={product.thumbnail}
          alt={product.name}
          width={400}
          height={500}
          unoptimized
          className="mb-4 h-80 w-full object-cover"
        />
      )}
      <h2>{product.name}</h2>
      <p>Giá thuê mỗi ngày: {product.rental_price_per_day} đồng</p>
    </div>
  );
}
```

`thumbnail &&` chỉ hiện ảnh khi có URL. `unoptimized` tải ảnh trực tiếp, chưa dùng bộ tối ưu ảnh của Next.js. `object-cover` lấp đầy vùng ảnh, có thể cắt mép.

**Sửa page.tsx:** bỏ import Image, thêm:

```tsx
import ProductCard from "./components/ProductCard";
```

Thay thẻ dài trong map bằng:

```tsx
{products.map((product: Product) => (
  <ProductCard key={product.id} product={product} />
))}
```

`product={product}` truyền dữ liệu vào component. Component tái sử dụng không nhất thiết đặt trong layout; đặt ở trang cần nó.

## 8. Thêm cột giá khuyến mãi

**Chạy tại backend:**

```powershell
php artisan make:migration add_sale_price_per_day_to_products_table --table=products
```

**Sửa migration mới:** `backend/database/migrations/2026_10_04_200251_add_sale_price_per_day_to_products_table.php`.
Trước: hai hàm chưa thêm/xóa cột. Sau:

```php
public function up(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->decimal('sale_price_per_day', 12, 2)->nullable();
    });
}

public function down(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropColumn('sale_price_per_day');
    });
}
```

```powershell
php artisan migrate
```

decimal(12,2) lưu tiền; nullable cho phép không khuyến mãi. `up` thêm cột, `down` phục vụ rollback. Không cần chạy lại migration khi chỉ sửa Model/Resource.

## 9. Cho Model nhận giá sale và API trả về

**Sửa:** `backend/app/Models/Product.php`.
Trước chưa có sale. Thêm trong `$fillable`:

```php
'sale_price_per_day',
```

Thêm trong `$casts`:

```php
'sale_price_per_day' => 'decimal:2',
```

fillable cho phép create/update trường này; cast định dạng giá. Không thêm trùng `rental_price_per_day`.

**Sửa:** `backend/app/Http/Resources/ProductResource.php`; thêm sau giá gốc:

```php
'sale_price_per_day' => $this->sale_price_per_day,
```

Resource quyết định dữ liệu API trả về. Test GET products: ban đầu sale là null.

## 10. Kiểm tra giá sale khi tạo sản phẩm

**Sửa:** `backend/app/Http/Requests/Product/StoreProductRequest.php`, trong rules:

```php
'sale_price_per_day' => 'nullable|numeric|gt:0|lt:rental_price_per_day',
```

Trước chưa có rule. Sau: có thể null; nếu có phải là số, lớn hơn 0 và nhỏ hơn giá gốc. Giá gốc 200000, sale 150000 hợp lệ; 250000 không hợp lệ.

## 11. Kiểm tra giá sale khi cập nhật

**Sửa:** `backend/app/Http/Requests/Product/UpdateProductRequest.php`.
Thêm rule:

```php
'sale_price_per_day' => 'sometimes|nullable|numeric|gt:0',
```

Thêm hàm trong class, bên dưới rules:

```php
public function withValidator($validator): void
{
    $validator->after(function ($validator) {
        if ($validator->errors()->isNotEmpty()) {
            return;
        }

        $product = $this->route('product');
        $price = $this->input('rental_price_per_day', $product->rental_price_per_day);
        $salePrice = $this->input('sale_price_per_day', $product->sale_price_per_day);

        if ($salePrice !== null && $salePrice >= $price) {
            $validator->errors()->add(
                'sale_price_per_day',
                'Giá khuyến mãi phải nhỏ hơn giá thuê gốc.'
            );
        }
    });
}
```

Lý do: PATCH có thể chỉ gửi một giá. Dùng giá mới nếu được gửi, nếu không dùng giá đang lưu. Route admin hiện dùng model binding Product.

## 12. Nhập sale bằng Postman

Ví dụ sản phẩm ID 1 có giá gốc 350000:

```text
PATCH http://127.0.0.1:8000/api/admin/products/1
Authorization: Bearer <token đăng nhập admin>
Accept: application/json
Content-Type: application/json
```

Body raw JSON:

```json
{ "sale_price_per_day": 250000 }
```

Thay ID/giá theo dữ liệu thật. Muốn bỏ khuyến mãi, gửi `{"sale_price_per_day": null}`.

## 13. Lọc sản phẩm sale ở backend

**Sửa:** ProductController.php, index; thêm trước paginate:

```php
if ($request->boolean('sale')) {
    $products->where('sale_price_per_day', '>', 0)
        ->whereColumn('sale_price_per_day', '<', 'rental_price_per_day');
}
```

`whereColumn` so sánh hai cột. Test: `GET /api/products?sale=1`. data trống nếu chưa có sale hợp lệ. `/api/products` vẫn lấy danh sách bình thường.

## 14. Đưa địa chỉ API vào env và thêm các hàm gọi API

**Tạo:** `frontend/.env.local` (ở frontend, không đặt trong src).

```env
API_BASE_URL=http://127.0.0.1:8000/api
```

Trước URL viết cứng. **Sau, file `frontend/src/app/lib/product.ts`:**

```ts
export async function getFeaturedProducts() {
  const response = await fetch(`${process.env.API_BASE_URL}/products?featured=1`);
  const result = await response.json();
  return result.data;
}

export async function getSaleProducts() {
  const response = await fetch(`${process.env.API_BASE_URL}/products?sale=1`);
  const result = await response.json();
  return result.data;
}

export async function getProducts(page: number = 1) {
  const response = await fetch(`${process.env.API_BASE_URL}/products?page=${page}`);
  const result = await response.json();
  return result;
}
```

Không cần NEXT_PUBLIC_ vì gọi trên server. Env được gitignore. Khi đổi env: Ctrl+C rồi `npm run dev`. getProducts trả cả result để giữ meta; hai hàm đầu chỉ trả data.

## 15. Hiển thị sale trên trang chủ

**Sửa:** `frontend/src/app/page.tsx`.
Import thêm getSaleProducts, rồi lấy dữ liệu trong Home:

```tsx
const products = await getFeaturedProducts();
const saleProducts = await getSaleProducts();
```

Trước chỉ có phần nổi bật. Thêm sau lưới nổi bật, trước đóng main:

```tsx
<section className="mt-12">
  <h2 className="text-2xl font-bold">Sản phẩm khuyến mãi</h2>
  <div className="mt-6 grid grid-cols-3 gap-6">
    {saleProducts.map((product: Product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</section>
```

## 16. Hiện giá gốc gạch ngang và giá sale

**Sửa:** `frontend/src/types/product.ts`, thêm trong Product:

```ts
sale_price_per_day: string | number | null;
```

**Sửa:** ProductCard.tsx. Trước chỉ hiện rental_price_per_day. Thay đoạn giá bằng:

```tsx
{product.sale_price_per_day != null &&
 Number(product.sale_price_per_day) > 0 &&
 Number(product.sale_price_per_day) < Number(product.rental_price_per_day) ? (
  <div>
    <p className="text-gray-500 line-through">
      {product.rental_price_per_day} đồng/ngày
    </p>
    <p className="font-bold text-red-600">
      {product.sale_price_per_day} đồng/ngày
    </p>
  </div>
) : (
  <p>{product.rental_price_per_day} đồng/ngày</p>
)}
```

`điều kiện ? khi đúng : khi sai`. Number chuyển giá thành số để so sánh. line-through gạch ngang. ProductCard dùng ở mọi trang nên sửa một lần có hiệu lực ở cả phần nổi bật và sale.

## 17. Tạo trang toàn bộ sản phẩm

**Tạo:** `frontend/src/app/products/page.tsx`.
Ban đầu chỉ có tiêu đề:

```tsx
export default function ProductsPage() {
  return <main className="flex-1 p-6"><h1>Tất cả sản phẩm</h1></main>;
}
```

Thư mục products + page.tsx tạo URL `/products`; Header/Footer lấy từ layout gốc.
Sau thêm import getProducts, ProductCard và kiểu Product; đổi thành async và gọi `const result = await getProducts()`.
Hiển thị tổng `result.meta.total`, map `result.data` thành ProductCard. Bước đầu mặc định trang 1.

## 18. Đọc số trang từ URL và thêm nút phân trang

**Sửa:** products/page.tsx. Trước getProducts() cố định trang 1. Sau, bản hoàn chỉnh:

```tsx
import { getProducts } from "../lib/product";
import ProductCard from "../components/ProductCard";
import type { Product } from "@/types/product";
import Link from "next/link";

export default async function ProductsPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const pageNumber = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isSafeInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const result = await getProducts(page);

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
      <p>Có {result.meta.total} sản phẩm</p>
      <div className="mt-6 grid grid-cols-3 gap-6">
        {result.data.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <nav aria-label="Phân trang sản phẩm"
        className="mt-8 flex items-center justify-center gap-4">
        {result.meta.current_page > 1 && (
          <Link href={`/products?page=${result.meta.current_page - 1}`}
            className="border px-4 py-2">Trang trước</Link>
        )}
        <span>Trang {result.meta.current_page} / {result.meta.last_page}</span>
        {result.meta.current_page < result.meta.last_page && (
          <Link href={`/products?page=${result.meta.current_page + 1}`}
            className="border px-4 py-2">Trang sau</Link>
        )}
      </nav>
    </main>
  );
}
```

searchParams là Promise ở Next.js hiện tại, cần await. URL page không hợp lệ dùng 1. `../` đi lên từ products về app. Nút đổi URL, server gọi API theo trang mới. Tối đa 12 sản phẩm thì chỉ thấy Trang 1/1. Trang vượt số trang cuối có thể trống; hiện chưa tự chuyển về trang cuối.

## 19. Thêm menu Sản phẩm

**Sửa:** `frontend/src/app/components/Header.tsx`.
Trước chỉ có Link Trang chủ bên trái. Sau:

```tsx
<nav aria-label="Menu trang" className="absolute left-8 flex items-center gap-4">
  <Link href="/" className="font-bold hover:text-blue-600">Trang chủ</Link>
  <Link href="/products" className="font-bold hover:text-blue-600">Sản phẩm</Link>
</nav>
```

Link điều hướng nội bộ Next.js. Absolute đặt riêng menu theo phần tử cha relative. Bố cục Header hiện cần kiểm tra thêm trên màn hình nhỏ.

## 20. Giao diện đăng nhập và đăng ký tĩnh

**Tạo:** `frontend/src/app/login/page.tsx`, `frontend/src/app/register/page.tsx`.
Trước chưa có hai trang. Sau có URL `/login`, `/register`.
Mẫu trang login:

```tsx
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-md border border-gray-200 bg-white p-6 text-gray-900">
        <h1 className="mb-6 text-center text-2xl font-bold">Đăng nhập</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block">Email</label>
            <input id="email" name="email" type="email" autoComplete="email"
              placeholder="Nhập email" className="w-full rounded border border-gray-300 p-3" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block">Mật khẩu</label>
            <input id="password" name="password" type="password" autoComplete="current-password"
              placeholder="Nhập mật khẩu" className="w-full rounded border border-gray-300 p-3" />
          </div>
          <button type="button" className="w-full rounded bg-gray-900 py-3 font-bold text-white hover:bg-gray-700">
            Đăng nhập
          </button>
        </form>
        <p className="mt-6 text-center">Chưa có tài khoản? <Link href="/register" className="text-blue-600 hover:underline">Đăng ký</Link></p>
      </div>
    </main>
  );
}
```

Register dùng cùng khung, tên hàm RegisterPage, tiêu đề/nút Đăng ký, liên kết cuối `/login`. Viết cứng các nhóm label/input giống login, không map:

| Nhãn | id và name | type | autoComplete |
|---|---|---|---|
| Họ và tên | fullname | text | name |
| Email | email | email | email |
| Số điện thoại | phone | tel | tel |
| Địa chỉ | address | text | street-address |
| Mật khẩu | password | password | new-password |
| Nhập lại mật khẩu | password_confirmation | password | new-password |

label htmlFor phải trùng id. type password che chữ. type button giữ nút ở dạng giao diện tĩnh; chưa xử lý đăng nhập/đăng ký, chưa gọi API.

**Header:** thêm hàng liên kết trước div menu hiện tại:

```tsx
<nav aria-label="Tài khoản" className="flex justify-end gap-4 px-8 py-2 text-sm">
  <Link href="/login" className="hover:text-blue-600">Đăng nhập</Link>
  <Link href="/register" className="hover:text-blue-600">Đăng ký</Link>
</nav>
```

## 21. Kiểm tra sau khi sửa

Tại frontend:

```powershell
npm run lint
npm run build
```

Lint đã chạy đạt sau các thay đổi thực hiện trong chat. Build đã đạt ở thời điểm kiểm tra frontend ban đầu, trước các bước API; chưa xác nhận lại build toàn bộ sau tính năng mới. Lấy dữ liệu server cần backend hoạt động; font Google có thể cần mạng lúc build.

Kiểm tra cú pháp PHP từ gốc project:

```powershell
php -l backend/app/Http/Controllers/ProductController.php
php -l backend/app/Http/Requests/Product/UpdateProductRequest.php
```

Trình duyệt: `/`, `/products`, `/products?page=2`, `/login`, `/register`.
Postman: featured chỉ trả is_featured=true; sale chỉ trả giá giảm hợp lệ; PATCH thử giá sale thấp hơn và cao hơn giá gốc.

## Nhớ nhanh

- layout.tsx: khung chung Header + children + Footer.
- page.tsx: nội dung trang tại đường dẫn tương ứng.
- lib/product.ts: gọi API; types/product.ts: mô tả dữ liệu; ProductCard: hiển thị một sản phẩm.
- Phân trang chỉ lấy từng trang, không tải toàn bộ sản phẩm một lần.
- flex: bố cục linh hoạt; grid-cols-3: ba cột; gap: khoảng cách; p: đệm; m: khoảng ngoài; x: trái/phải; y: trên/dưới.
- Bản hiện tại là nền tảng học: chưa có xử lý lỗi API, thông báo danh sách trống hoặc tối ưu đầy đủ cho điện thoại.
