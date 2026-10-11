import Link from "next/link";

export function DataTable({ headings, children, label }) {
  return <div className="card overflow-x-auto">
    <table aria-label={label} className="w-full min-w-[720px] text-left text-[12px]">
      <thead className="border-b border-line bg-surface-2 text-[11px] text-ink-3">
        <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-medium">{headings}</tr>
      </thead>
      <tbody className="divide-y divide-line [&>tr>td]:px-4 [&>tr>td]:py-4">{children}</tbody>
    </table>
  </div>
}

export function RowActions({ editHref, onDelete, disabled = false }) {
  return <div className="flex justify-end gap-1.5">
    {editHref
      ? <Link href={editHref} className="btn btn-outline btn-sm">Sửa</Link>
      : <button disabled type="button" className="btn btn-outline btn-sm">Sửa</button>}
    <button disabled={!onDelete || disabled} onClick={onDelete} type="button" className="btn btn-danger btn-sm">Xóa</button>
  </div>;
}

export function TableFooter({ label, note = "Hàng minh họa giao diện" }) {
  return <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-ink-3">
    <span>{label} · {note}</span>
    <div className="flex items-center gap-2">
      <button disabled type="button" className="btn btn-outline btn-sm">Trước</button><span>Trang 1 / 1</span>
      <button disabled type="button" className="btn btn-outline btn-sm">Sau</button>
    </div>
  </div>;
}

