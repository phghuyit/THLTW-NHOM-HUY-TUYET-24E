import { formatDateLong, todayISO } from "@/lib/date";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-6 backdrop-blur-sm">
      <div className="text-[12.5px] text-ink-2">
        Hôm nay: {formatDateLong(todayISO())}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12.5px] font-medium text-ink">Quản trị viên</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
