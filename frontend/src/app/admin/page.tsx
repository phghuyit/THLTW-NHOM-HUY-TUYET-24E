import Link from "next/link";

/**
 * A01 — Dashboard quản trị (task AD-18).
 * Hiện là trang tạm để xác nhận route group admin chạy đúng.
 */
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-neutral-600">
        Trang quản trị — nhóm route <code>admin</code>, layout tách hoàn toàn
        khỏi giao diện khách.
      </p>

      <ul className="mt-8 space-y-2 text-sm text-neutral-600">
        <li>AD-01 — Màn đăng nhập quản trị</li>
        <li>AD-02 — Route guard + layout hoàn chỉnh</li>
        <li>AD-18 — Dashboard: số liệu hôm nay, đơn cần xử lý, biểu đồ</li>
      </ul>

      <Link
        href="/"
        className="mt-8 inline-block text-sm underline underline-offset-4"
      >
        ← Về giao diện khách
      </Link>
    </div>
  );
}
