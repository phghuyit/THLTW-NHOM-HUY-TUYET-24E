import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

/**
 * Root layout — chỉ lo <html>, font và metadata chung.
 *
 * Giao diện thật nằm ở 3 nhóm route con, mỗi nhóm có layout riêng:
 *   (shop)/  — giao diện khách: Header + Footer
 *   admin/   — trang quản trị: Sidebar + kiểm tra quyền
 *   (auth)/  — đăng nhập, đăng ký, quên mật khẩu
 */
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tiệm Thuê Đồ Xinh",
    template: "%s · Tiệm Thuê Đồ Xinh",
  },
  description:
    "Cho thuê trang phục dạ hội, áo dài, vest và cosplay tại TP.HCM.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
