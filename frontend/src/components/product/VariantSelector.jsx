"use client";

import { cn } from "@/lib/utils";

export function VariantSelector({
  product,
  size,
  color,
  onSizeChange,
  onColorChange,
  showSizeGuide,
}) {
  const variants = product.variants || [];
  const colorMap = new Map();
  variants.forEach((v) => {
    if (v.color && !colorMap.has(v.color)) {
      colorMap.set(v.color, v.colorHex || "#333333");
    }
  });

  const colors = colorMap.size > 0
    ? [...colorMap.entries()].map(([name, hex]) => ({ name, hex }))
    : [{ name: "Tiêu chuẩn", hex: "#333333" }];

  const rawSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const sizes = rawSizes.length > 0 ? rawSizes : (product.sizes || ["Free"]);

  return (
    <div className="space-y-6">
      {colors.length > 1 && (
        <div>
          <div className="flex items-baseline justify-between">
            <p className="field-label mb-0">
              Màu sắc{color && <span className="ml-2 normal-case tracking-normal text-ink">· {color}</span>}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {colors.map((c) => {
              const active = color === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onColorChange(c.name)}
                  aria-label={`Màu ${c.name}`}
                  aria-pressed={active}
                  className={cn(
                    "group relative h-11 w-11 border transition-all duration-200 ease-luxe",
                    active ? "border-ink" : "border-line hover:border-ink-3",
                  )}
                >
                  <span
                    className="absolute inset-[3px] block"
                    style={{ backgroundColor: c.hex, border: "1px solid rgba(0,0,0,0.06)" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="field-label mb-0">Kích cỡ</p>
          {showSizeGuide && (
            <button
              type="button"
              onClick={showSizeGuide}
              className="link-line link-underline-in text-[11px] uppercase tracking-[0.12em] text-ink-2"
            >
              Bảng gợi ý size
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = size === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onSizeChange(s)}
                aria-pressed={active}
                className={cn(
                  "min-w-14 border px-4 py-2.5 text-center text-[12.5px] font-medium uppercase tracking-[0.08em] transition-all duration-200 ease-luxe",
                  active ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
