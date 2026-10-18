"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useMounted, useScrollY } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  IconBag,
  IconSearch,
  IconUser,
} from "@/components/ui/Icons";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { authErrorMessage } from "@/services/authService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const scrollY = useScrollY();
  const mounted = useMounted();
  const cart = useCart();
  const { user, loading: authLoading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setAuthError("");
    try {
      await logout();
    } catch (error) {
      setAuthError(authErrorMessage(error));
    } finally {
      setLoggingOut(false);
    }
  }
  const [keyword, setKeyword] = useState("");

  const overHero = pathname === "/";
  const solid = scrollY > 24 || !overHero;

  const navLinks = [
    { label: "Tất cả sản phẩm", href: "/products" },
    { label: "Áo dài", href: "/products?category=ao-dai" },
    { label: "Đầm dạ hội", href: "/products?category=dam-da-hoi" },
    { label: "Vest nam", href: "/products?category=vest-nam" },
    { label: "Váy cưới", href: "/products?category=vay-cuoi" },
    { label: "Phụ kiện", href: "/products?category=tui-clutch" },
  ];

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-500 ease-luxe",
        overHero ? "fixed" : "sticky",
        solid
          ? "border-b border-line bg-canvas/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-[76px] items-center justify-between gap-4">
        <Link
          href="/"
          className={cn(
            "font-display text-[22px] transition-colors duration-500 ease-luxe",
            solid ? "text-ink" : "text-canvas",
          )}
          style={{ letterSpacing: "0.04em" }}
        >
          StyleRent
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "link-line link-underline-in text-[11.5px] uppercase tracking-[0.13em] transition-colors",
                  solid
                    ? active
                      ? "text-accent font-semibold"
                      : "text-ink"
                    : active
                      ? "text-canvas font-semibold"
                      : "text-canvas/85",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (keyword.trim()) {
                router.push(`/products?search=${encodeURIComponent(keyword.trim())}`);
              }
            }}
            className="relative hidden sm:block"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm..."
              className={cn(
                "h-9 w-36 lg:w-44 rounded-sm border px-3 pl-8 text-[12.5px] outline-none transition-colors",
                solid
                  ? "border-line bg-surface text-ink placeholder:text-ink-3"
                  : "border-canvas/30 bg-canvas/10 text-canvas placeholder:text-canvas/60",
              )}
            />
            <IconSearch
              width={13}
              height={13}
              className={cn(
                "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2",
                solid ? "text-ink-3" : "text-canvas/70",
              )}
            />
          </form>

          <Link
            href="/cart"
            aria-label="Giỏ thuê"
            className={cn(
              "relative p-2 transition-colors",
              solid ? "text-ink hover:text-accent" : "text-canvas",
            )}
          >
            <IconBag width={18} height={18} />
            {mounted && cart.count > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-[16px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {cart.count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className={cn("hidden max-w-24 truncate text-xs sm:block", solid ? "text-ink" : "text-canvas")} title={user.name || user.fullname}>
                {user.name || user.fullname}
              </span>
              <button type="button" onClick={handleLogout} disabled={loggingOut} className={cn("btn btn-sm disabled:opacity-60", solid ? "btn-outline" : "border-canvas/60 text-canvas")}>
                {loggingOut ? "Đang thoát..." : "Đăng xuất"}
              </button>
            </div>
          ) : (
            <Link href="/login" className={cn("btn btn-sm gap-1.5", solid ? "btn-outline" : "border-canvas/60 text-canvas hover:bg-canvas hover:text-ink")}>
              <IconUser width={14} height={14} />
              {authLoading ? "Đang kiểm tra..." : "Đăng nhập"}
            </Link>
          )}
        </div>
      </div>
      {authError && <p role="alert" className="shell pb-3 text-sm text-danger">{authError}</p>}
    </header>
  );
}
