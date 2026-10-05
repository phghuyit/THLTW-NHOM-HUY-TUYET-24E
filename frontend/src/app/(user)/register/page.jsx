import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-md border border-gray-200 bg-white p-6 text-gray-900">
        <h1 className="mb-6 text-center text-2xl font-bold">Đăng ký</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="fullname" className="mb-2 block">Họ và tên</label>
            <input id="fullname" name="fullname" type="text" autoComplete="name" placeholder="Nhập họ và tên" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="Nhập email" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block">Số điện thoại</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Nhập số điện thoại" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="mb-2 block">Địa chỉ</label>
            <input id="address" name="address" type="text" autoComplete="street-address" placeholder="Nhập địa chỉ" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block">Mật khẩu</label>
            <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Nhập mật khẩu" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <div className="mb-6">
            <label htmlFor="password_confirmation" className="mb-2 block">Nhập lại mật khẩu</label>
            <input id="password_confirmation" name="password_confirmation" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <button type="button" className="w-full rounded bg-gray-900 py-3 font-bold text-white hover:bg-gray-700">
            Đăng ký
          </button>
        </form>

        <p className="mt-6 text-center">
          Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </main>
  );
}
