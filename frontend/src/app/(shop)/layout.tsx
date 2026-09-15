/**
 * Layout giao diện khách — Header + Footer bọc toàn bộ trang công khai.
 *
 * Header và Footer sẽ đọc động từ GET /configs và GET /menus ở task FE-03.
 * Hiện để khung tĩnh cho route chạy được.
 */
export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold">Tiệm Thuê Đồ Xinh</span>
          <nav className="text-sm text-neutral-500">
            {/* FE-03: đổ menu từ GET /menus?position=header */}
            Header — chờ task FE-03
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-500">
          {/* FE-03: đổ thông tin từ GET /configs */}
          Footer — chờ task FE-03
        </div>
      </footer>
    </>
  );
}
