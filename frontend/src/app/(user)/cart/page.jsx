"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductMedia } from "@/components/user/ProductMedia";
import { IconBag, IconTrash, IconArrowRight, IconShield, IconTruck } from "@/components/ui/Icons";
import { EmptyState, Note, QuantityStepper, Reveal } from "@/components/ui/Primitives";
import { PriceBreakdown } from "@/components/rental/PriceBreakdown";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks";
import { formatDate } from "@/lib/date";
import { formatVnd } from "@/lib/money";

export default function CartPage() {
  const mounted = useMounted();
  const cart = useCart();
  const toast = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [checkoutModal, setCheckoutModal] = useState(false);

  if (mounted && cart.detailed.length === 0) {
    return (
      <div className="shell py-16 md:py-24">
        <h1 className="display-2 mb-8">Giỏ thuê của bạn</h1>
        <EmptyState
          icon={<IconBag width={36} height={36} />}
          title="Giỏ thuê đang trống"
          body="Chọn khoảng ngày bạn cần, các món đồ rảnh sẽ sẵn sàng cho bạn đặt thuê. Mỗi món thêm vào giỏ được giữ chỗ đảm bảo."
          action={
            <Link href="/products" className="btn mt-4">
              Khám phá bộ sưu tập
            </Link>
          }
        />
      </div>
    );
  }

  function handleApplyCoupon(e) {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const res = cart.applyPromotion(promoCode.trim());
    if (res.ok) {
      toast.push({ tone: "success", title: res.message });
      setPromoCode("");
    } else {
      toast.push({ tone: "danger", title: res.message });
    }
  }

  function handleCheckout() {
    setCheckoutModal(true);
  }

  return (
    <div className="shell pb-24 pt-10 md:pt-14">
      <Reveal className="mb-10">
        <p className="eyebrow text-ink-3">Bước 1 / 2</p>
        <h1 className="display-2 mt-2">Giỏ thuê của bạn</h1>
        <p className="mt-2 text-[14px] text-ink-2">
          Đang có {cart.count} sản phẩm trong giỏ thuê.
        </p>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] xl:gap-16">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {cart.detailed.map(({ line, product, variant, days, rentalTotal, depositTotal }) => (
              <li key={line.id} className="py-6 sm:py-8">
                <div className="flex gap-4 sm:gap-6">
                  <Link href={`/products/${product.slug}`} className="w-24 shrink-0 sm:w-28">
                    <ProductMedia image={product.images?.[0]} ratio="3/4" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="eyebrow text-ink-3">{product.brandLine || "StyleRent"}</p>
                          <h3 className="mt-1 text-[15px] font-medium leading-snug">
                            <Link href={`/products/${product.slug}`} className="hover:underline">
                              {product.name}
                            </Link>
                          </h3>
                        </div>

                        <button
                          type="button"
                          aria-label="Xoá khỏi giỏ"
                          onClick={() => {
                            cart.removeLine(line.id);
                            toast.push({ tone: "neutral", title: "Đã xoá món đồ khỏi giỏ" });
                          }}
                          className="p-1.5 text-ink-3 hover:text-danger"
                        >
                          <IconTrash width={16} height={16} />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-2">
                        <span>Màu: <strong className="text-ink">{variant.color}</strong></span>
                        <span>Size: <strong className="text-ink">{variant.size}</strong></span>
                        <span>Thời gian: <strong className="text-ink">{days} ngày</strong> ({formatDate(line.pickupDate)} → {formatDate(line.returnDate)})</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-line-2">
                      <QuantityStepper
                        value={line.quantity}
                        compact
                        onChange={(qty) => cart.updateLine(line.id, { quantity: qty })}
                      />

                      <div className="text-right">
                        <p className="text-[15px] font-semibold text-ink">{formatVnd(rentalTotal)}</p>
                        <p className="text-[11.5px] text-ink-3">Cọc {formatVnd(depositTotal)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between">
            <Link href="/products" className="btn btn-outline btn-sm">
              ← Tiếp tục xem đồ
            </Link>
            <button
              type="button"
              onClick={() => {
                cart.clear();
                toast.push({ tone: "neutral", title: "Đã làm trống giỏ hàng" });
              }}
              className="text-[12px] text-ink-3 hover:text-danger"
            >
              Xoá toàn bộ
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <div className="sticky top-28 rounded border border-line bg-surface p-6">
            <h2 className="text-[16px] font-medium">Tóm tắt thanh toán</h2>

            <form onSubmit={handleApplyCoupon} className="mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Mã giảm giá (SEN10, FREESHIP...)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="field flex-1 uppercase text-[12px]"
              />
              <button type="submit" className="btn btn-sm shrink-0">
                Áp dụng
              </button>
            </form>

            {cart.promotion && (
              <div className="mt-3 flex items-center justify-between rounded bg-success-soft p-2.5 text-[12px] text-success">
                <span>Mã <strong>{cart.promotion.code}</strong> đã kích hoạt</span>
                <button
                  type="button"
                  onClick={cart.clearPromotion}
                  className="font-bold hover:underline"
                >
                  Xoá
                </button>
              </div>
            )}

            <PriceBreakdown quote={cart.quote} className="mt-5" />

            <button
              type="button"
              onClick={handleCheckout}
              className="btn btn-block mt-6 py-3.5 text-[12px]"
            >
              Tiến hành đặt thuê ({formatVnd(cart.quote.dueNow)})
            </button>

            <div className="mt-6 space-y-2.5 border-t border-line pt-4 text-[12px] text-ink-2">
              <p className="flex items-center gap-2">
                <IconShield width={14} height={14} className="text-accent shrink-0" />
                Cọc hoàn 100% khi trả lại trang phục nguyên vẹn
              </p>
              <p className="flex items-center gap-2">
                <IconTruck width={14} height={14} className="text-accent shrink-0" />
                Giao trước ngày sự kiện 1 buổi, miễn phí giặt hấp
              </p>
            </div>
          </div>
        </div>
      </div>

      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded bg-surface p-6 shadow-xl animate-scale-in">
            <h3 className="text-lg font-bold text-ink">Xác nhận đơn đặt thuê</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
              Đơn thuê gồm {cart.count} sản phẩm với tổng tiền cần thanh toán trước là <strong>{formatVnd(cart.quote.dueNow)}</strong>.
            </p>
            <div className="mt-4 rounded bg-warm p-3 text-[12.5px] space-y-1">
              <div className="flex justify-between">
                <span>Tiền cọc:</span>
                <span className="font-semibold">{formatVnd(cart.quote.totalDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Trả trước 30% thuê:</span>
                <span className="font-semibold">{formatVnd(Math.round(cart.quote.subtotalRental * 0.3))}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCheckoutModal(false)}
                className="btn btn-outline btn-sm"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.push({ tone: "success", title: "Đặt thuê thành công!", body: "Chúng tôi sẽ liên hệ bạn để xác nhận lịch giao." });
                  cart.clear();
                  setCheckoutModal(false);
                }}
                className="btn btn-sm"
              >
                Xác nhận đặt thuê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
