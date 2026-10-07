"use client";

import { useState } from "react";
import { Reveal, Stars } from "@/components/ui/Primitives";
import { formatDate } from "@/lib/date";

export function ReviewList({
  reviews = [],
  rating = 5,
  reviewCount = 0,
}) {
  const [visible, setVisible] = useState(3);

  const breakdown = [
    { stars: 5, count: Math.round(reviewCount * 0.7), ratio: 0.7 },
    { stars: 4, count: Math.round(reviewCount * 0.2), ratio: 0.2 },
    { stars: 3, count: Math.round(reviewCount * 0.1), ratio: 0.1 },
    { stars: 2, count: 0, ratio: 0 },
    { stars: 1, count: 0, ratio: 0 },
  ];

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
      <Reveal>
        <h2 className="display-3">Đánh giá</h2>
        <div className="mt-6 flex items-end gap-4">
          <span className="font-display text-[52px] leading-none">{rating ? rating.toFixed(1).replace(".", ",") : "5,0"}</span>
          <div className="pb-1.5">
            <Stars value={rating} size={14} />
            <p className="mt-1 text-[12.5px] text-ink-2">{reviewCount || reviews.length} đánh giá</p>
          </div>
        </div>

        <ul className="mt-7 space-y-2">
          {breakdown.map((row) => (
            <li key={row.stars} className="flex items-center gap-3 text-[12px] text-ink-2">
              <span className="w-3 tabular-nums">{row.stars}</span>
              <span className="h-1 flex-1 bg-line">
                <span
                  className="block h-full bg-ink transition-[width] duration-700 ease-luxe"
                  style={{ width: `${Math.round(row.ratio * 100)}%` }}
                />
              </span>
              <span className="w-5 text-right tabular-nums">{row.count}</span>
            </li>
          ))}
        </ul>

        <p className="mt-7 border-t border-line pt-5 text-[12px] leading-relaxed text-ink-3">
          Chỉ khách đã hoàn tất đơn thuê sản phẩm này mới gửi được đánh giá, trong vòng 30 ngày sau khi trả đồ. Mọi
          đánh giá đều qua kiểm duyệt trước khi hiển thị.
        </p>
      </Reveal>

      <div className="min-w-0">
        {reviews.length === 0 ? (
          <p className="text-[14px] text-ink-3">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div className="divide-y divide-line">
            {reviews.slice(0, visible).map((rev) => (
              <article key={rev.id} className="py-6 first:pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[14px]">{rev.author}</p>
                    {rev.sizeWorn && <p className="text-[12px] text-ink-3">Size đã mặc: {rev.sizeWorn}</p>}
                  </div>
                  <Stars value={rev.rating} size={12} />
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{rev.content}</p>
                {rev.createdAt && (
                  <p className="mt-2 text-[11.5px] text-ink-3">{formatDate(rev.createdAt)}</p>
                )}
              </article>
            ))}

            {reviews.length > visible && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + 3)}
                className="btn btn-outline btn-block mt-4"
              >
                Xem thêm đánh giá
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
