import Link from "next/link";
import { IconSearch } from "./Icons";

export function PageHeader({ title, description, breadcrumb, actions }) {
  return <header className="mb-5">
    {breadcrumb && <nav className="mb-2 text-[12px] text-ink-3">{breadcrumb.map(item => item.label).join(" / ")}</nav>}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h1 className="h-page">{title}</h1><p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">{description}</p></div>{actions}
    </div>
  </header>;
}

export function Toolbar({ searchPlaceholder = "Tìm kiếm...", resultLabel, children }) {
  return <div className="mb-3 space-y-2.5">
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1 sm:max-w-[340px]">
        <IconSearch width={15} height={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3" />
        <input disabled placeholder={searchPlaceholder} className="field pl-8" aria-label={searchPlaceholder} />
      </div>
      <span className="ml-auto text-[12px] text-ink-2">{resultLabel}</span>
      <button disabled type="button" className="btn btn-outline btn-sm">Thoáng</button>
      <button disabled type="button" className="btn btn-outline btn-sm">Gọn</button>
    </div>
    {children && <div className="flex flex-wrap gap-1.5">{children}</div>}
  </div>;
}

export function StatCard({ label, value, sub, tone = "neutral", href, icon }) {
  const card = <div className="card card-pad flex h-full flex-col">
    <div className="flex items-start justify-between gap-2"><p className="text-[12px] text-ink-2">{label}</p>{icon}</div>
    <p className={`num mt-2 text-2xl font-medium ${tone === "success" ? "text-success" : "text-ink"}`}>{value}</p>
    <p className="mt-2 text-[11.5px] text-ink-3">{sub}</p>
  </div>;
  return href ? <Link href={href} className="block">{card}</Link> : card;
}

export function Section({ title, description, children }) {
  return <section><h2 className="h-section">{title}</h2><p className="mb-3 mt-1 text-[12px] text-ink-2">{description}</p>{children}</section>;
}

