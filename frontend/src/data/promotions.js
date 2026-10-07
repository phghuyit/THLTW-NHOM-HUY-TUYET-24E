import { addDays, todayISO } from "@/lib/date";

export const PROMOTIONS = [
  {
    code: "SEN10",
    type: "percent",
    value: 10,
    maxDiscount: 300000,
    minOrder: 800000,
    description: "Giảm 10% tiền thuê, tối đa 300.000₫ cho đơn từ 800.000₫",
    endsAt: addDays(todayISO(), 45),
  },
  {
    code: "STYLE150",
    type: "fixed",
    value: 150000,
    maxDiscount: null,
    minOrder: 1000000,
    description: "Giảm thẳng 150.000₫ tiền thuê cho đơn từ 1.000.000₫",
    endsAt: addDays(todayISO(), 20),
  },
  {
    code: "FREESHIP",
    type: "freeship",
    value: 0,
    maxDiscount: null,
    minOrder: 500000,
    description: "Miễn phí giao nhận 2 chiều trong nội thành",
    endsAt: addDays(todayISO(), 60),
  },
  {
    code: "CUOI2026",
    type: "percent",
    value: 15,
    maxDiscount: 800000,
    minOrder: 3000000,
    description: "Ưu đãi mùa cưới — giảm 15% tiền thuê, tối đa 800.000₫",
    endsAt: addDays(todayISO(), 90),
  },
];

export function findPromotion(code) {
  if (!code) return undefined;
  return PROMOTIONS.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
}
