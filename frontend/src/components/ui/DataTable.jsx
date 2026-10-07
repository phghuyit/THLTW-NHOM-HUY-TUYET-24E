"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "./Icons";
import { EmptyState, Skeleton } from "./Primitives";

export function DataTable({
  columns = [],
  rows = [],
  getKey,
  density = "comfortable",
  loading = false,
  empty,
  onRowClick,
}) {
  const [sort, setSort] = useState(null);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = col.sortValue(a);
      const vb = col.sortValue(b);
      const r = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "vi");
      return sort.dir === "asc" ? r : -r;
    });
    return copy;
  }, [rows, sort, columns]);

  if (loading) {
    return (
      <div className="card p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (sortedRows.length === 0) {
    return <div className="card">{empty || <EmptyState title="Không có dữ liệu" body="Chưa có bản ghi nào." />}</div>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-line bg-surface-2 text-[12px] font-semibold text-ink-2 uppercase tracking-wider">
            {columns.map((col) => {
              const sortable = Boolean(col.sortValue);
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn("px-4 py-3", col.align === "right" && "text-right")}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort(active ? { key: col.key, dir: sort.dir === "asc" ? "desc" : "asc" } : { key: col.key, dir: "asc" })
                      }
                      className="inline-flex items-center gap-1 hover:text-ink"
                    >
                      {col.header}
                      <IconChevronDown
                        width={12}
                        height={12}
                        className={cn("transition-transform", active ? (sort.dir === "asc" ? "rotate-180" : "") : "opacity-30")}
                      />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-[13px]">
          {sortedRows.map((row) => {
            const key = getKey ? getKey(row) : row.id || row.slug || row.code;
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn("transition-colors hover:bg-line-2/40", onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      density === "compact" ? "px-4 py-2" : "px-4 py-3.5",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
