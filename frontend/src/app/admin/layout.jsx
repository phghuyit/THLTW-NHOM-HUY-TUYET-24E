import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 h-screen w-60 border-r border-gray-800 bg-gray-900 p-4 text-white">
        <h2 className="mb-6 text-xl font-bold">Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="rounded px-3 py-2 hover:bg-gray-800">
            Dashboard
          </Link>
          <Link href="/admin/brand" className="rounded px-3 py-2 hover:bg-gray-800">
            Brand
          </Link>
          <Link href="/admin/danh-muc" className="rounded px-3 py-2 hover:bg-gray-800">
            Danh mục
          </Link>
          <Link href="/admin/san-pham" className="rounded px-3 py-2 hover:bg-gray-800">
            Sản phẩm
          </Link>
        </nav>
      </aside>
      <main className="ml-60 flex-1 bg-gray-950 p-6 text-gray-100">{children}</main>
    </div>
  );
}
