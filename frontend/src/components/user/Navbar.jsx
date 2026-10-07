"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMounted, useScrollY } from "@/hooks";
import { cn } from "@/lib/utils";
import { IconBag, IconHeart, IconSearch, IconUser } from "@/components/ui/Icons";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

export default function Navbar() {
  const pathname = usePathname();
  const scrollY = useScrollY();
  const mounted = useMounted();
  const cart = useCart();
  const wishlist = useWishlist();
  const [keyword, setKeyword] = useState("");

  const overHero = pathname === "/";
  const solid = scrollY > 24 || !overHero;

  const navLinks = [
    { label: "Mới về", href: "/products" },
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
        solid ? "border-b border-line bg-canvas/92 backdrop-blur-md" : "border-b border-transparent bg-transparent",
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
                  solid ? (active ? "text-accent font-semibold" : "text-ink") : (active ? "text-canvas font-semibold" : "text-canvas/85"),
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
                window.location.href = `/products?search=${encodeURIComponent(keyword.trim())}`;
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
                solid ? "border-line bg-surface text-ink placeholder:text-ink-3" : "border-canvas/30 bg-canvas/10 text-canvas placeholder:text-canvas/60",
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

          <Link
            href="/login"
            className={cn(
              "btn btn-sm gap-1.5",
              solid ? "btn-outline" : "border-canvas/60 text-canvas hover:bg-canvas hover:text-ink",
            )}
          >
            <IconUser width={14} height={14} />
            Đăng nhập
          </Link>

          <Link href="/admin" className="btn btn-sm">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
