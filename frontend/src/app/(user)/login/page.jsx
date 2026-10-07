import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-ink">Đăng nhập StyleRent</h1>
        <p className="mt-1 text-center text-xs text-ink-2">Nhập thông tin tài khoản của bạn để tiếp tục</p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input type="email" placeholder="name@example.com" className="field" />
          </div>

          <div>
            <label className="field-label">Mật khẩu</label>
            <input type="password" placeholder="••••••••" className="field" />
          </div>

          <button type="button" className="btn btn-block mt-2">
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-2">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
