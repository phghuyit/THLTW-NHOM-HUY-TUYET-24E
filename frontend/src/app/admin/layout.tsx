/**
 * Layout trang quản trị — Sidebar + Topbar, không dùng Header/Footer của khách.
 *
 * Task AD-02 sẽ bọc thêm route guard ở đây:
 *   - chưa đăng nhập        → đá về /login
 *   - role !== 'admin'      → trang 403
 *   - API trả 401           → xoá token, về /login
 */
const MENU = [
  { label: "Dashboard", href: "/admin", task: "AD-18" },
  { label: "Đơn thuê", href: "/admin/orders", task: "AD-11" },
  { label: "Trả đồ", href: "/admin/returns", task: "AD-14" },
  { label: "Sản phẩm", href: "/admin/products", task: "AD-06" },
  { label: "Danh mục", href: "/admin/categories", task: "AD-04" },
  { label: "Thương hiệu", href: "/admin/brands", task: "AD-05" },
  { label: "Tồn kho", href: "/admin/stock", task: "AD-08" },
  { label: "Mã giảm giá", href: "/admin/coupons", task: "AD-10" },
  { label: "Bài viết", href: "/admin/posts", task: "AD-15" },
  { label: "Cấu hình", href: "/admin/settings", task: "AD-19" },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1">
      <aside className="w-56 shrink-0 border-r bg-neutral-50">
        <div className="border-b px-4 py-4 font-semibold">CRS Admin</div>
        <nav className="p-2 text-sm">
          {MENU.map((item) => (
            <div
              key={item.href}
              className="flex items-center justify-between rounded px-2 py-1.5 text-neutral-600"
            >
              <span>{item.label}</span>
              <span className="text-[10px] text-neutral-400">{item.task}</span>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="border-b px-6 py-4 text-sm text-neutral-500">
          {/* AD-02: hiện tên admin đang đăng nhập + nút đăng xuất */}
          Topbar — chờ task AD-02
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
