"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { userService } from "@/services/userService";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useMounted } from "@/hooks";
import { formatVnd } from "@/lib/money";
import { formatDate } from "@/lib/date";
import { ProductMedia } from "@/components/user/ProductMedia";
import { useToast } from "@/components/ui/Toast";

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();
  const cart = useCart();
  const toast = useToast();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUserProfile() {
      if (!user) return;

      let currentName = user.fullname || user.name || "";
      let currentPhone = user.phone || "";
      let currentAddress = user.address || "";

      if (!currentPhone || !currentAddress) {
        try {
          const profile = await userService.getProfile();
          if (active && profile) {
            if (profile.fullname || profile.name) {
              currentName = profile.fullname || profile.name;
            }
            if (profile.phone) currentPhone = profile.phone;
            if (profile.address) currentAddress = profile.address;

            if (updateUser) {
              updateUser(profile);
            }
          }
        } catch {
        }
      }

      if (active) {
        let filledSomething = false;
        if (currentName) {
          setName((prev) => prev || currentName);
          filledSomething = true;
        }
        if (currentPhone) {
          setPhone((prev) => prev || currentPhone);
          filledSomething = true;
        }
        if (currentAddress) {
          setAddress((prev) => prev || currentAddress);
          filledSomething = true;
        }

        if (filledSomething) {
          setHasAutoFilled(true);
        }
      }
    }

    loadUserProfile();

    return () => {
      active = false;
    };
  }, [user, updateUser]);

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);

  const totalRental = cart.quote?.subtotalRental || 0;
  const totalDeposit = cart.quote?.totalDeposit || 0;
  const totalAmount = cart.quote?.dueNow || totalRental + totalDeposit;

  if (mounted && cart.detailed.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="text-2xl font-bold mb-4 font-serif">Giỏ thuê của bạn đang trống</h1>
        <p className="text-sm text-ink-2 mb-6">Hãy chọn trang phục trước khi tiến hành thanh toán.</p>
        <Link href="/products" className="btn">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  async function handleOrderSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập đầy đủ họ tên, SĐT và địa chỉ nhận đồ" });
      return;
    }

    setLoading(true);
    const orderCode = "SR" + Date.now().toString().slice(-6);

    const orderSnapshot = {
      orderCode,
      name,
      phone,
      address,
      note,
      paymentMethod,
      totalAmount,
      totalRental,
      totalDeposit,
      items: cart.detailed.map((d) => ({
        name: d.product.name,
        image: d.product.images?.[0] || d.product.thumbnail,
        size: d.variant.size,
        color: d.variant.color,
        quantity: d.line.quantity,
        rentalTotal: d.rentalTotal,
        pickupDate: d.line.pickupDate,
        returnDate: d.line.returnDate,
      })),
    };

    try {
      window.sessionStorage.setItem("last_order", JSON.stringify(orderSnapshot));
    } catch {
    }

    try {
      await api.post("/orders", {
        order_code: orderCode,
        receiver_name: name,
        receiver_phone: phone,
        address: address,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        items: cart.detailed.map((d) => ({
          product_size_id: 1,
          quantity: d.line.quantity,
          pickupDate: d.line.pickupDate,
          returnDate: d.line.returnDate,
          rentalTotal: d.rentalTotal,
          depositTotal: d.depositTotal,
        })),
      });

      if (paymentMethod === "vnpay") {
        const res = await api.post("/payment/vnpay/create", {
          order_code: orderCode,
          amount: totalAmount,
        });

        if (res.data && res.data.payment_url) {
          window.location.href = res.data.payment_url;
          return;
        }
      }

      cart.clear();
      router.push(`/checkout/result?code=${orderCode}&status=success`);
    } catch (error) {
      console.error("Order error:", error);
      cart.clear();
      router.push(`/checkout/result?code=${orderCode}&status=success`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell py-12 md:py-16">
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="text-3xl font-serif text-ink font-bold">Thanh toán đơn thuê</h1>
        <p className="mt-1 text-sm text-ink-2">Điền thông tin giao nhận và chọn phương thức thanh toán.</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleOrderSubmit} className="space-y-8">
          <section className="bg-surface border border-line p-6 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-ink">1. Thông tin người nhận đồ</h2>
            </div>

            {user ? (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-emerald-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">✓</span>
                  {hasAutoFilled
                    ? `Đã tự động điền thông tin từ tài khoản (${user.fullname || user.name})`
                    : `Đã kết nối tài khoản (${user.fullname || user.name})`}
                </span>
                <Link href="/account" className="text-[11px] font-medium text-emerald-700 underline hover:text-emerald-900">
                  Cập nhật hồ sơ
                </Link>
              </div>
            ) : (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded border border-line bg-warm/40 px-3.5 py-2.5 text-xs text-ink-2">
                <span>
                  💡 Đăng nhập tài khoản để tự động điền thông tin người nhận và theo dõi đơn thuê.
                </span>
                <Link href="/login" className="font-semibold text-accent underline">
                  Đăng nhập
                </Link>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                />
              </div>

              <div>
                <label className="field-label">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="field-label">Địa chỉ nhận đồ *</label>
              <input
                type="text"
                required
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="field"
              />
            </div>

            <div className="mt-4">
              <label className="field-label">Ghi chú cho shop</label>
              <textarea
                rows={2}
                placeholder="Ví dụ: giao trước 10h sáng, hoặc cần chỉnh chiều dài váy..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="field"
              />
            </div>
          </section>

          <section className="bg-surface border border-line p-6 rounded-sm">
            <h2 className="text-base font-semibold text-ink mb-4">2. Chọn phương thức thanh toán</h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "vnpay" ? "border-ink bg-warm/30" : "border-line hover:border-ink-3"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "vnpay"}
                  onChange={() => setPaymentMethod("vnpay")}
                  className="mt-1 accent-[#181818]"
                />
                <div>
                  <span className="font-medium text-sm text-ink block">Cổng thanh toán VNPay (Khuyên dùng)</span>
                  <span className="text-xs text-ink-2 mt-0.5 block">
                    Thanh toán online qua thẻ ATM nội địa, quét mã QR VNPay hoặc thẻ Visa/Mastercard.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "cod" ? "border-ink bg-warm/30" : "border-line hover:border-ink-3"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 accent-[#181818]"
                />
                <div>
                  <span className="font-medium text-sm text-ink block">Thanh toán khi nhận đồ (COD / Tiền mặt)</span>
                  <span className="text-xs text-ink-2 mt-0.5 block">
                    Thanh toán tiền thuê và cọc trực tiếp cho nhân viên giao hàng hoặc tại quầy.
                  </span>
                </div>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-block py-4 text-sm font-semibold"
          >
            {loading ? "Đang xử lý..." : `Xác nhận & Thanh toán (${formatVnd(totalAmount)})`}
          </button>
        </form>

        <aside className="border border-line bg-surface p-6 rounded-sm self-start">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-ink border-b border-line pb-3">
            Tóm tắt đơn ({cart.count} món)
          </h2>

          <ul className="divide-y divide-line my-4 max-h-72 overflow-y-auto pr-1">
            {cart.detailed.map(({ line, product, variant, rentalTotal }) => (
              <li key={line.id} className="py-3 flex gap-3 text-xs">
                <ProductMedia image={product.images?.[0] || product.thumbnail} ratio="3/4" className="w-12 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{product.name}</p>
                  <p className="text-ink-2 mt-0.5">Size {variant.size} · Màu {variant.color}</p>
                  <p className="text-ink-2 mt-0.5">
                    {formatDate(line.pickupDate)} → {formatDate(line.returnDate)}
                  </p>
                  <p className="font-semibold text-ink mt-1">{formatVnd(rentalTotal)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-ink-2">
              <span>Tổng tiền thuê:</span>
              <span>{formatVnd(totalRental)}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Tiền cọc (hoàn lại 100%):</span>
              <span>{formatVnd(totalDeposit)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-ink border-t border-line pt-3 mt-3">
              <span>Cần thanh toán:</span>
              <span className="text-accent">{formatVnd(totalAmount)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
