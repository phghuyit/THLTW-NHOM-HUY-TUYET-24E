import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-ink">Tạo tài khoản mới</h1>
        <p className="mt-1 text-center text-xs text-ink-2">Trở thành thành viên StyleRent để nhận ưu đãi thuê đồ</p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="field-label">Họ và tên</label>
            <input type="text" placeholder="Nguyễn Văn A" className="field" />
          </div>

          <div>
            <label className="field-label">Email</label>
            <input type="email" placeholder="name@example.com" className="field" />
          </div>

          <div>
            <label className="field-label">Số điện thoại</label>
            <input type="tel" placeholder="0901234567" className="field" />
          </div>

          <div>
            <label className="field-label">Địa chỉ</label>
            <input type="text" placeholder="Số nhà, đường, quận/huyện, TP.HCM" className="field" />
          </div>

          <div>
            <label className="field-label">Mật khẩu</label>
            <input type="password" placeholder="••••••••" className="field" />
          </div>

          <div>
            <label className="field-label">Xác nhận mật khẩu</label>
            <input type="password" placeholder="••••••••" className="field" />
          </div>

          <button type="button" className="btn btn-block mt-2">
            Đăng ký tài khoản
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-2">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
