import Link from "next/link";

/**
 * S01 — Trang chủ (task FE-04).
 * Hiện là trang tạm để xác nhận route group (shop) chạy đúng.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Tiệm Thuê Đồ Xinh</h1>
      <p className="mt-2 text-neutral-600">
        Giao diện khách — nhóm route <code>(shop)</code>.
      </p>

      <ul className="mt-8 space-y-2 text-sm text-neutral-600">
        <li>FE-04 — Trang chủ: banner, danh mục, sản phẩm nổi bật</li>
        <li>FE-05 — Danh sách sản phẩm + bộ lọc</li>
        <li>FE-06 — Chi tiết sản phẩm</li>
      </ul>

      <Link
        href="/admin"
        className="mt-8 inline-block text-sm underline underline-offset-4"
      >
        Sang trang quản trị →
      </Link>
    </div>
  );
}
