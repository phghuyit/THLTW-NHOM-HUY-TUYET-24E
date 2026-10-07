"use client";

import Link from "next/link";
import { useState } from "react";
import { formatVnd } from "@/lib/money";
import { ProductMedia } from "./ProductMedia";
import { Chip, Stars } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

export function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  if (!product) return null;

  const price = product.rental_price_per_day || product.pricePerDay || 0;
  const deposit = product.deposit || Math.round(price * 2);
  const primary = product.images?.[0] || product.thumbnail || product.image;
  const secondary = product.images?.[1] || primary;
  const brandName = product.brand?.name || product.brandLine || product.brand_name || "StyleRent";

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products?selected=${product.slug || product.id}`} className="block">
        <div className="relative overflow-hidden bg-warm">
          <ProductMedia image={primary} ratio="3/4" />
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-luxe",
              hovered ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          >
            <ProductMedia image={secondary} ratio="3/4" />
          </div>

          <div className="pointer-events-none absolute left-0 top-0 flex flex-col items-start gap-1.5 p-3">
            {product.isNew && <Chip tone="ink">Mới về</Chip>}
            {product.is_featured && <Chip tone="warning">Nổi bật</Chip>}
          </div>
        </div>
      </Link>

      <div className="pt-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5">
        <p className="eyebrow text-ink-3">{brandName}</p>
        <h3 className="mt-1.5 text-[14.5px] leading-snug">
          <Link href={`/products?selected=${product.slug || product.id}`} className="link-line link-underline-in">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[14px]">{formatVnd(price)}</span>
          <span className="text-[12px] text-ink-2">/ ngày</span>
          <span className="text-[12px] text-ink-3">· cọc {formatVnd(deposit)}</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Stars value={product.rating || 5} size={12} />
          <span className="text-[11.5px] text-ink-3">
            {product.rating ? product.rating.toFixed(1).replace(".", ",") : "5,0"} · {product.reviewCount || 10} đánh giá
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
