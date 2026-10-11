import Link from "next/link";
import { IconBox, IconGrid, IconStore, IconTag, IconBell, IconChevronDown, IconPanel, IconSearch } from "./ui/Icons";

export default function AdminShell({ children }) {
  return <div className="admin-theme min-h-screen bg-canvas text-ink">
    <aside className="border-b border-line bg-surface lg:fixed lg:inset-y-0 lg:left-0 lg:w-[var(--sidebar-w)] lg:border-r">
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-4">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-[12px] font-semibold text-white">S</span>
        <div><p className="text-[13.5px] font-semibold">StyleRent</p><p className="text-[11px] text-ink-3">Operations</p></div>
      </div>
      <nav aria-label="Điều hướng admin" className="flex flex-wrap gap-1 p-2 lg:block lg:space-y-1 lg:py-4">
        <p className="label-xs hidden px-2 pb-1.5 lg:block">Vận hành</p>
        <NavLink href="/admin" icon={<IconGrid width={16} height={16} />}>Bảng điều hành</NavLink>
        <p className="label-xs hidden px-2 pb-1.5 pt-4 lg:block">Catalog</p>
        <NavLink href="/admin/product" icon={<IconTag width={16} height={16} />}>Sản phẩm</NavLink>
        <NavLink href="/admin/brand" icon={<IconStore width={16} height={16} />}>Thương hiệu</NavLink>
        <NavLink href="/admin/category" icon={<IconBox width={16} height={16} />}>Danh mục</NavLink>
      </nav>
      <div className="absolute bottom-0 hidden w-full border-t border-line p-2 lg:block">
        <button disabled type="button" className="btn btn-ghost btn-sm w-full justify-start"><IconPanel width={16} height={16} />Thu gọn</button>
      </div>
    </aside>
    <div className="flex min-h-screen min-w-0 flex-col lg:pl-[var(--sidebar-w)]">
      <header className="sticky top-0 z-20 flex h-[var(--header-h)] items-center gap-3 border-b border-line bg-white px-4">
        <span className="hidden text-[13px] font-medium md:block">Quản trị</span>
        <div className="mx-auto flex h-[34px] min-w-0 max-w-[420px] flex-1 items-center gap-2 rounded-md border border-line bg-surface px-2.5 text-[12px] text-ink-3">
          <IconSearch width={15} height={15} /><span className="truncate">Tìm đơn, khách hàng, sản phẩm...</span>
        </div>
        <button disabled type="button" aria-label="Thông báo" className="btn btn-ghost btn-sm btn-icon"><IconBell width={16} height={16} /></button>
        <button disabled type="button" className="btn btn-outline btn-sm"><span className="rounded bg-beige px-1.5 py-1 text-[10px]">AD</span>Admin<IconChevronDown width={12} height={12} /></button>
      </header>
      <main className="flex-1 px-3 py-4 sm:px-5 sm:py-6"><div className="@container mx-auto w-full max-w-[1560px]">{children}</div></main>
    </div>
  </div>;
}

function NavLink({ href, icon, children }) {
  return <Link href={href} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-ink-2 hover:bg-beige hover:text-ink">{icon}{children}</Link>;
}

