import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-stone-100 text-gray-900">
      <div className="relative flex items-center justify-center px-8 py-6">
        <Link href="/" className="absolute left-8 font-bold">
          Trang chủ
        </Link>

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
