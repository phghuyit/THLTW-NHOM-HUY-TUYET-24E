/**
 * Layout cho các màn xác thực — đăng nhập, đăng ký, quên mật khẩu.
 *
 * Không có Header/Footer của khách cũng không có Sidebar của admin:
 * một khung giữa màn hình dùng chung cho cả hai bên.
 *
 * Màn đăng nhập admin (AD-01) và đăng ký khách (FE-01) đều nằm trong nhóm này.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
