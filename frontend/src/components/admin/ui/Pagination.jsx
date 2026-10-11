"use client";

export default function Pagination({ meta, page, perPage, onPageChange, onPerPageChange, disabled = false, label }) {
  const lastPage = meta?.last_page ?? 1;
  const start = Math.max(1, Math.min(page - 2, lastPage - 4));
  const pages = Array.from({ length: Math.min(5, lastPage) }, (_, index) => start + index);

  function pageButton(number) {
    return <button key={number} type="button" aria-label={`Trang ${number}`} aria-current={number === page ? "page" : undefined}
      disabled={disabled || number === page} onClick={() => onPageChange(number)}
      className={`btn btn-sm min-w-8 ${number === page ? "" : "btn-outline"}`}>{number}</button>;
  }

  return <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-ink-2">
    <div className="flex flex-wrap items-center gap-3">
      <span>Hiển thị {meta?.from ?? 0}–{meta?.to ?? 0} / {meta?.total ?? 0} {label}</span>
      <label className="flex items-center gap-2">Số dòng / trang
        <select value={perPage} disabled={disabled} onChange={(event) => onPerPageChange(Number(event.target.value))} className="field w-auto">
          {[5, 12, 24, 48].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
    </div>
    <nav aria-label="Phân trang" className="flex flex-wrap items-center gap-1.5">
      <button type="button" className="btn btn-outline btn-sm" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>Trước</button>
      {start > 1 && pageButton(1)}
      {start > 2 && <span aria-hidden="true">…</span>}
      {pages.map(pageButton)}
      {start + pages.length < lastPage && <span aria-hidden="true">…</span>}
      {start + pages.length <= lastPage && pageButton(lastPage)}
      <button type="button" className="btn btn-outline btn-sm" disabled={disabled || page >= lastPage} onClick={() => onPageChange(page + 1)}>Sau</button>
      <span className="ml-2">Trang {page} / {lastPage}</span>
    </nav>
  </div>;
}
