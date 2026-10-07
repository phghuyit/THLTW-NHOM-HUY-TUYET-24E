"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ImageGallery } from "./ImageGallery";
import { VariantSelector } from "./VariantSelector";
import { PricingTiers } from "@/components/rental/PricingTiers";
import { PriceBreakdown } from "@/components/rental/PriceBreakdown";
import { ReviewList } from "./ReviewList";
import { ProductRail } from "@/components/user/ProductGrid";
import {
  IconCalendar,
  IconHeart,
  IconShield,
  IconStore,
  IconTruck,
} from "@/components/ui/Icons";
import {
  Accordion,
  Chip,
  QuantityStepper,
  Stars,
} from "@/components/ui/Primitives";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/store/cart";
import { useRentalDates } from "@/store/rentalDates";
import { useWishlist } from "@/store/wishlist";
import { useMounted } from "@/hooks";
import { formatVnd } from "@/lib/money";
import { rentalDays, todayISO, addDays, formatDate } from "@/lib/date";
import { buildQuote } from "@/lib/pricing";
import { REVIEWS } from "@/data/reviews";
import { PRODUCTS } from "@/data/products";
import { OCCASIONS, CATEGORIES } from "@/data/catalog";
import { SHIPPING, STORE } from "@/lib/settings";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }) {
  const router = useRouter();
  const mounted = useMounted();
  const toast = useToast();
  const cart = useCart();
  const wishlist = useWishlist();
  const {
    pickupDate: globalPickup,
    returnDate: globalReturn,
    setRange,
  } = useRentalDates();

  const variants = product?.variants || [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const firstVariant = variants[0] || {
    id: `var-${product?.id || 1}`,
    size: "M",
    color: "Tiêu chuẩn",
    pricePerDay: product?.rental_price_per_day || 350000,
    depositAmount: product?.deposit || 500000,
    extraDayPrice: product?.rental_price_per_day || 350000,
    tiers: [
      {
        days: 3,
        price: Math.round((product?.rental_price_per_day || 350000) * 2.5),
        label: "Gói 3 ngày",
      },
      {
        days: 7,
        price: Math.round((product?.rental_price_per_day || 350000) * 4.2),
        label: "Gói 7 ngày",
      },
    ],
  };

  const [color, setColor] = useState(firstVariant.color || "Tiêu chuẩn");
  const [size, setSize] = useState(firstVariant.size || "M");
  const [quantity, setQuantity] = useState(1);
  const [pickup, setPickup] = useState(globalPickup || todayISO());
  const [returnDate, setReturnDate] = useState(
    globalReturn || addDays(todayISO(), 3),
  );
  const [dateEditing, setDateEditing] = useState(false);

  const category = CATEGORIES.find((c) => c.slug === product?.categorySlug);

  const variant = useMemo(() => {
    return (
      variants.find((v) => v.size === size && v.color === color) || firstVariant
    );
  }, [variants, size, color, firstVariant]);

  const days = Math.max(1, rentalDays(pickup, returnDate));

  const quote = useMemo(() => {
    return buildQuote([{ variant, days, quantity }]);
  }, [variant, days, quantity]);

  const saved = wishlist.hydrated && wishlist.has(product?.slug);

  const productReviews = useMemo(() => {
    return REVIEWS.filter((r) => r.productSlug === product?.slug);
  }, [product?.slug]);

  const related = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        p.slug !== product?.slug && p.categorySlug === product?.categorySlug,
    ).slice(0, 4);
  }, [product?.slug, product?.categorySlug]);

  function handleAddToCart(redirect = false) {
    if (!pickup || !returnDate) {
      toast.push({
        tone: "danger",
        title: "Vui lòng chọn ngày nhận và ngày trả đồ",
      });
      return;
    }

    setRange(pickup, returnDate);

    cart.addLine({
      productSlug: product.slug,
      variantId: variant.id,
      quantity,
      pickupDate: pickup,
      returnDate,
    });

    toast.push({
      tone: "success",
      title: "Đã thêm vào giỏ thuê",
      body: `${product.name} · ${color} · ${size}`,
      action: { label: "Xem giỏ thuê", href: "/cart" },
    });

    if (redirect) {
      router.push("/cart");
    }
  }

  const accordionItems = [
    {
      title: "Chính sách cọc & hoàn tiền",
      content: (
        <div className="space-y-2">
          <p>
            • Cọc giữ đồ được hoàn lại 100% khi khách trả trang phục nguyên vẹn.
          </p>
          <p>
            • Quy trình kiểm tra và hoàn tiền chuyển khoản trong vòng 24 giờ sau
            khi nhận lại đồ.
          </p>
          <p>• Miễn phí vệ sinh vết bẩn nhẹ thông thường.</p>
        </div>
      ),
    },
    {
      title: "Giao nhận & Thử đồ",
      content: (
        <div className="space-y-2">
          <p>
            • Hỗ trợ giao nhận 2 chiều tận nơi tại TP. Hồ Chí Minh và các tỉnh
            lân cận.
          </p>
          <p>
            • Khách có thể ghé trực tiếp showroom để thử đồ và chỉnh sửa nhẹ vừa
            dáng miễn phí.
          </p>
          <p>
            • Đồ được giao trước ngày sự kiện ít nhất 1 buổi để bạn chuẩn bị chu
            đáo.
          </p>
        </div>
      ),
    },
    {
      title: "Giặt hấp & Khử khuẩn",
      content: (
        <p>
          Tất cả trang phục đều trải qua quy trình giặt hấp chuyên nghiệp, ủi
          phẳng và bọc màng bảo vệ trước khi bàn giao tới bạn.
        </p>
      ),
    },
  ];

  return (
    <div>
      <nav className="shell py-6 text-[12px] text-ink-2">
        <Link href="/" className="link-line link-underline-in">
          Trang chủ
        </Link>
        <span className="mx-2 text-ink-3">/</span>
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="link-line link-underline-in"
        >
          {category?.name || "Bộ sưu tập"}
        </Link>
        <span className="mx-2 text-ink-3">/</span>
        <span className="text-ink-3">{product?.name}</span>
      </nav>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-[1.15fr_minmax(380px,0.85fr)] lg:gap-16">
        <div className="min-w-0">
          <ImageGallery images={product?.images} name={product?.name} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-[100px] lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            {product?.isNew && <Chip tone="ink">Mới về</Chip>}
            {product?.occasions?.slice(0, 2).map((o) => (
              <Chip key={o}>
                {OCCASIONS.find((x) => x.slug === o)?.name || o}
              </Chip>
            ))}
          </div>

          <p className="eyebrow mt-5 text-ink-3">
            {product?.brandLine || product?.brand?.name || "StyleRent"}
          </p>
          <h1 className="display-2 mt-2">{product?.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Stars value={product?.rating || 5} size={14} />
            <span className="text-[12.5px] text-ink-2">
              {product?.rating
                ? product.rating.toFixed(1).replace(".", ",")
                : "5,0"}{" "}
              ({product?.reviewCount || 18} đánh giá)
            </span>
            <span className="text-[12.5px] text-ink-3">
              · đã thuê {product?.rentalCount || 65} lượt
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-[26px] text-ink">
              {formatVnd(variant.pricePerDay)}
            </span>
            <span className="text-[14px] text-ink-2">/ ngày</span>
          </div>
          <p className="mt-1.5 text-[13px] text-ink-2">
            Cọc {formatVnd(variant.depositAmount)} — hoàn lại khi trả nguyên vẹn
          </p>

          <p className="mt-5 max-w-[54ch] text-[13.5px] leading-relaxed text-ink-2">
            {product?.description}
          </p>

          <div className="mt-8 space-y-6">
            <div className="border border-ink">
              <button
                type="button"
                onClick={() => setDateEditing((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-warm"
              >
                <span className="flex items-center gap-3">
                  <IconCalendar className="shrink-0 text-ink-2" />
                  <span>
                    <span className="eyebrow block text-ink-3">Ngày thuê</span>
                    <span className="mt-1 block text-[14px]">
                      {pickup && returnDate ? (
                        <>
                          {formatDate(pickup)}{" "}
                          <span className="text-ink-3">→</span>{" "}
                          {formatDate(returnDate)}
                        </>
                      ) : (
                        "Chọn ngày nhận và ngày trả"
                      )}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-ink-2">
                  {dateEditing ? "Đóng" : "Đổi ngày"}
                </span>
              </button>

              {dateEditing && (
                <div className="border-t border-line bg-surface p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-ink-3 uppercase">
                        Ngày nhận
                      </label>
                      <input
                        type="date"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="field mt-1 text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ink-3 uppercase">
                        Ngày trả
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="field mt-1 text-[13px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-line bg-warm px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[13px]">{days} ngày thuê</span>
                  <span className="text-[15px] font-semibold tabular-nums">
                    {formatVnd(quote.subtotalRental)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="field-label mb-2">Gói thuê</p>
              <PricingTiers
                variant={variant}
                activeDays={days}
                onPick={(d) => setReturnDate(addDays(pickup, d))}
              />
            </div>

            <VariantSelector
              product={product}
              size={size}
              color={color}
              onSizeChange={setSize}
              onColorChange={setColor}
            />

            <div>
              <p className="field-label mb-2">Số lượng</p>
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>

            <PriceBreakdown quote={quote} />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                className="btn btn-outline flex-1 py-3 text-[12px]"
              >
                Thêm vào giỏ thuê
              </button>
              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                className="btn flex-1 py-3 text-[12px]"
              >
                Thuê ngay
              </button>
              <button
                type="button"
                aria-label="Yêu thích"
                onClick={() => wishlist.toggle(product.slug)}
                className={cn(
                  "grid h-12 w-12 place-items-center border border-line bg-surface transition-colors",
                  saved
                    ? "text-accent border-accent"
                    : "text-ink hover:border-ink",
                )}
              >
                <IconHeart width={18} height={18} filled={saved} />
              </button>
            </div>
          </div>

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[12.5px] text-ink-2">
            <li className="flex items-start gap-2.5">
              <IconStore width={15} height={15} className="mt-0.5 shrink-0" />
              Nhận tại cửa hàng miễn phí — {STORE.address}
            </li>
            <li className="flex items-start gap-2.5">
              <IconTruck width={15} height={15} className="mt-0.5 shrink-0" />
              Giao tận nơi 2 chiều {formatVnd(SHIPPING.round_trip_fee)} · miễn
              phí cho đơn thuê từ {formatVnd(SHIPPING.free_shipping_threshold)}
            </li>
            <li className="flex items-start gap-2.5">
              <IconShield width={15} height={15} className="mt-0.5 shrink-0" />
              Đã giặt hấp và kiểm tra trước khi bàn giao
            </li>
          </ul>

          <div className="mt-8 border-t border-line pt-6">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>

      <div className="shell mt-20 border-t border-line pt-16">
        <ReviewList
          reviews={productReviews}
          rating={product?.rating || 5}
          reviewCount={product?.reviewCount || productReviews.length}
        />
      </div>

      {related.length > 0 && (
        <div className="shell mt-20 border-t border-line pt-16">
          <div className="mb-8">
            <p className="eyebrow text-ink-3">Gợi ý cho bạn</p>
            <h2 className="display-3 mt-2">Sản phẩm tương tự</h2>
          </div>
          <ProductRail products={related} />
        </div>
      )}
    </div>
  );
}
