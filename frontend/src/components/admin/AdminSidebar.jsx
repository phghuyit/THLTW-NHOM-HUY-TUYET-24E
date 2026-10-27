"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconBox, IconList, IconMenu, IconStore, IconTag, IconTrash, IconTruck, IconUser } from "@/components/ui/Icons";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/admin", icon: <IconStore width={16} height={16} /> },
    { label: "Sản phẩm", href: "/admin/products", icon: <IconTag width={16} height={16} /> },
    { label: "Đơn hàng", href: "/admin/orders", icon: <IconTruck width={16} height={16} /> },
    { label: "Danh mục", href: "/admin/categories", icon: <IconList width={16} height={16} /> },
    { label: "Thương hiệu", href: "/admin/brands", icon: <IconBox width={16} height={16} /> },
    { label: "Người dùng", href: "/admin/users", icon: <IconUser width={16} height={16} /> },
    {
      label: "Bài viết & Tin tức",
      href: "/admin/posts",
      icon: (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      ),
    },
    { label: "Menu điều hướng", href: "/admin/menus", icon: <IconMenu width={16} height={16} /> },
    { label: "Thùng rác", href: "/admin/trash", icon: <IconTrash width={16} height={16} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-line bg-surface p-4 flex flex-col justify-between z-30">
      <div>
        <div className="mb-6 flex items-center justify-between px-2">
          <Link href="/admin" className="text-lg font-bold tracking-tight text-ink">
            StyleRent Admin
          </Link>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded px-3 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "text-ink-2 hover:bg-line-2 hover:text-ink"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-line pt-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded px-3 py-2 text-[12.5px] text-ink-2 hover:bg-line-2 hover:text-ink"
        >
          <span>← Về trang khách hàng</span>
        </Link>
      </div>
    </aside>
  );
}
