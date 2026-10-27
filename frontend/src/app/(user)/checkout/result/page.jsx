"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/store/cart";
import { formatVnd } from "@/lib/money";
import { IconCheck, IconAlert } from "@/components/ui/Icons";

function ResultContent() {
  const searchParams = useSearchParams();
  const cart = useCart();
  const [order, setOrder] = useState(null);

  const orderCode = searchParams.get("code") || searchParams.get("vnp_TxnRef") || "SR-TEST";
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const queryStatus = searchParams.get("status");

  const isSuccess = vnpResponseCode === "00" || queryStatus === "success" || (!vnpResponseCode && !queryStatus);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("last_order");
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {
      // ignore
    }

    if (isSuccess) {
      cart.clear();
    }
  }, [isSuccess]);

  return (
    <div className="shell py-16 md:py-24 max-w-2xl mx-auto">
      <div className="bg-surface border border-line p-8 rounded-sm shadow-sm text-center">
        <div
          className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full text-white ${
            isSuccess ? "bg-success" : "bg-danger"
          }`}
        >
          {isSuccess ? <IconCheck width={28} height={28} /> : <IconAlert width={28} height={28} />}
        </div>

        <h1 className="text-2xl font-bold font-serif text-ink mb-2">
          {isSuccess ? "Đặt đơn thuê thành công!" : "Thanh toán chưa hoàn tất"}
        </h1>

        <p className="text-sm text-ink-2 mb-6">
          {isSuccess
            ? `Cảm ơn bạn đã đặt thuê tại StyleRent. Mã đơn hàng của bạn là #${orderCode}.`
            : `Giao dịch #${orderCode} đã bị huỷ hoặc có lỗi trong quá trình thanh toán.`}
        </p>

        {/* THÔNG TIN CHI TIẾT ĐƠN HÀNG */}
        {order && (
          <div className="bg-warm/50 border border-line p-5 rounded-sm text-left text-xs space-y-2.5 mb-8">
            <div className="flex justify-between border-b border-line pb-2">
              <span className="text-ink-2">Mã đơn hàng:</span>
              <strong className="text-ink font-mono text-sm">#{order.orderCode}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-2">Người nhận:</span>
              <span className="font-medium text-ink">{order.name} ({order.phone})</span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-2">Địa chỉ giao:</span>
              <span className="font-medium text-ink text-right max-w-[260px] truncate">{order.address}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-2">Phương thức:</span>
              <span className="font-medium text-ink">
                {order.paymentMethod === "vnpay" ? "Cổng online VNPay" : "Thanh toán khi nhận đồ (COD)"}
              </span>
            </div>

            <div className="flex justify-between border-t border-line pt-2 text-sm font-bold text-ink">
              <span>Tổng thanh toán:</span>
              <span className="text-accent">{formatVnd(order.totalAmount)}</span>
            </div>
          </div>
        )}

        {/* NÚT THAO TÁC */}
        <div className="flex justify-center gap-4">
          <Link href="/products" className="btn btn-outline text-xs">
            Tiếp tục xem đồ
          </Link>

          {isSuccess && (
            <Link href="/orders" className="btn text-xs">
              Xem đơn thuê của tôi
            </Link>
          )}

          {!isSuccess && (
            <Link href="/checkout" className="btn text-xs">
              Thử đặt lại
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-24 text-center">
          <p className="text-sm text-ink-2">Đang tải thông tin đơn hàng...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
