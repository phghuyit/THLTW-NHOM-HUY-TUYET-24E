import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-stone-100 text-gray-900">
      <nav aria-label="Tài khoản" className="flex justify-end gap-4 px-8 py-2 text-sm">
        <Link href="/login" className="hover:text-blue-600">Đăng nhập</Link>
        <Link href="/register" className="hover:text-blue-600">Đăng ký</Link>
      </nav>
      <div className="relative flex items-center justify-center px-8 py-6">
        <nav aria-label="Menu trang" className="absolute left-8 flex items-center gap-4">
          <Link href="/" className="font-bold hover:text-blue-600">
            Trang chủ
          </Link>
          <Link href="/products" className="font-bold hover:text-blue-600">
            Sản phẩm
          </Link>
        </nav>

        <nav aria-label="Điều hướng chính" className="flex items-center gap-6">
          <a href="#">Mới về</a>
          <a href="#">Nữ</a>
          <a href="#">Nam</a>

          <Link href="/" className="text-2xl font-bold">
            H & T Shop
          </Link>

          <a href="#">Đầm & Váy</a>
          <a href="#">Dịp</a>
          <a href="#">Phụ kiện</a>
        </nav>
      </div>
    </header>
  );
}
