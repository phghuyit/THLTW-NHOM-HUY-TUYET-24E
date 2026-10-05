import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-md border border-gray-200 bg-white p-6 text-gray-900">
        <h1 className="mb-6 text-center text-2xl font-bold">Đăng nhập</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="Nhập email" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block">Mật khẩu</label>
            <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" className="w-full rounded border border-gray-300 p-3" />
          </div>

          <button type="button" className="w-full rounded bg-gray-900 py-3 font-bold text-white hover:bg-gray-700">
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center">
          Chưa có tài khoản? <Link href="/register" className="text-blue-600 hover:underline">Đăng ký</Link>
        </p>
      </div>
    </main>
  );
}
