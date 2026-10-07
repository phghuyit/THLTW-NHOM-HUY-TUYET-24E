"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { findPromotion } from "@/data/promotions";
import { findVariantGlobal, getProduct } from "@/data/products";
import { rentalDays } from "@/lib/date";
import { formatVnd } from "@/lib/money";
import { buildQuote } from "@/lib/pricing";
import { SETTINGS } from "@/lib/settings";

const STORAGE_KEY = "stylerent.cart.v1";
const PROMO_KEY = "stylerent.promo.v1";

const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải nằm trong <CartProvider>");
  return ctx;
}

function holdDeadline(minutes = SETTINGS.hold_ttl_minutes) {
  return Date.now() + minutes * 60000;
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [promotionCode, setPromotionCode] = useState(null);
  const [promotionError, setPromotionError] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
      const promo = window.localStorage.getItem(PROMO_KEY);
      if (promo) setPromotionCode(promo);
    } catch {
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
    }
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (promotionCode) window.localStorage.setItem(PROMO_KEY, promotionCode);
      else window.localStorage.removeItem(PROMO_KEY);
    } catch {
    }
  }, [promotionCode, hydrated]);

  useEffect(() => {
    if (lines.length === 0) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lines.length]);

  const detailed = useMemo(() => {
    return lines
      .map((line) => {
        const product = getProduct(line.productSlug);
        const found = findVariantGlobal(line.variantId);
        if (!product || !found) return null;
        const days = rentalDays(line.pickupDate, line.returnDate);
        const quote = buildQuote([{ variant: found.variant, days, quantity: line.quantity }]);
        return {
          line,
          product,
          variant: found.variant,
          days,
          rentalTotal: quote.subtotalRental,
          depositTotal: quote.totalDeposit,
          expired: now > 0 && line.holdExpiresAt <= now,
        };
      })
      .filter(Boolean);
  }, [lines, now]);

  const promotion = useMemo(() => (promotionCode ? findPromotion(promotionCode) || null : null), [promotionCode]);

  const quote = useMemo(
    () =>
      buildQuote(
        detailed.map((d) => ({ variant: d.variant, days: d.days, quantity: d.line.quantity })),
        { promotion },
      ),
    [detailed, promotion],
  );

  const buildQuoteWith = useCallback(
    ({ pickupMethod, paymentPlan }) =>
      buildQuote(
        detailed.map((d) => ({ variant: d.variant, days: d.days, quantity: d.line.quantity })),
        { promotion, pickupMethod, paymentPlan },
      ),
    [detailed, promotion],
  );

  const addLine = useCallback((input) => {
    setLines((prev) => {
      const match = prev.find(
        (l) =>
          l.variantId === input.variantId &&
          l.pickupDate === input.pickupDate &&
          l.returnDate === input.returnDate,
      );
      if (match) {
        return prev.map((l) =>
          l.id === match.id
            ? { ...l, quantity: Math.min(9, l.quantity + input.quantity), holdExpiresAt: holdDeadline() }
            : l,
        );
      }
      return [
        ...prev,
        {
          id: `line-${Date.now()}-${Math.round(Math.random() * 1000)}`,
          productSlug: input.productSlug,
          variantId: input.variantId,
          quantity: input.quantity,
          pickupDate: input.pickupDate,
          returnDate: input.returnDate,
          holdExpiresAt: holdDeadline(),
        },
      ];
    });
  }, []);

  const updateLine = useCallback((id, patch) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? {
              ...line,
              ...patch,
              holdExpiresAt: holdDeadline(),
            }
          : line,
      ),
    );
  }, []);

  const removeLine = useCallback((id) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setPromotionCode(null);
  }, []);

  const renewHolds = useCallback((minutes) => {
    setLines((prev) => prev.map((line) => ({ ...line, holdExpiresAt: holdDeadline(minutes) })));
  }, []);

  const applyPromotion = useCallback(
    (code) => {
      const found = findPromotion(code);
      if (!found) {
        setPromotionError("Mã giảm giá không tồn tại hoặc đã hết hiệu lực.");
        return { ok: false, message: "Mã giảm giá không tồn tại hoặc đã hết hiệu lực." };
      }
      const subtotal = quote.subtotalRental;
      if (found.type !== "freeship" && subtotal < found.minOrder) {
        const message = `Mã ${found.code} áp dụng cho đơn thuê từ ${formatVnd(found.minOrder)}.`;
        setPromotionError(message);
        return { ok: false, message };
      }
      setPromotionError(null);
      setPromotionCode(found.code);
      return { ok: true, message: `Đã áp dụng mã ${found.code}.` };
    },
    [quote.subtotalRental],
  );

  const clearPromotion = useCallback(() => {
    setPromotionCode(null);
    setPromotionError(null);
  }, []);

  const holdExpiresAt = useMemo(
    () => (lines.length ? Math.min(...lines.map((l) => l.holdExpiresAt)) : null),
    [lines],
  );

  const value = {
    lines,
    detailed,
    hydrated,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
    quote,
    promotion,
    promotionError,
    holdExpiresAt,
    hasExpiredHold: detailed.some((d) => d.expired),
    addLine,
    updateLine,
    removeLine,
    clear,
    renewHolds,
    applyPromotion,
    clearPromotion,
    buildQuoteWith,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
