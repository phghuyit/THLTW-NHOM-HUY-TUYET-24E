import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata = {
  title: "StyleRent — Cho thuê trang phục cao cấp",
  description: "Dịch vụ thuê trang phục dạ hội, áo dài, vest và váy cưới thiết kế.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
