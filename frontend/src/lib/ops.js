import { ORDERS, UNITS, MAINTENANCE } from "@/data/operations";
import { PRODUCTS } from "@/data/products";
import { todayISO, diffDays, formatDate, addDays } from "./date";

const TODAY = todayISO();

export function counters() {
  return {
    todayPickups: ORDERS.filter((o) => o.pickupDate === TODAY && ["ready", "preparing", "confirmed"].includes(o.status)).length,
    todayReturns: ORDERS.filter((o) => o.returnDate === TODAY && ["in_use", "overdue"].includes(o.status)).length,
    activeRentals: ORDERS.filter((o) => ["in_use", "overdue"].includes(o.status)).length,
    overdue: ORDERS.filter((o) => o.status === "overdue").length,
    pendingPayment: ORDERS.filter((o) => o.status === "pending_payment").length,
    cleaning: UNITS.filter((u) => u.status === "cleaning").length,
    repairing: UNITS.filter((u) => u.status === "repairing").length,
    revenue30d: ORDERS.reduce((sum, o) => sum + (o.subtotalRental || 0), 0),
    totalDeposit: ORDERS.reduce((sum, o) => sum + (o.totalDeposit || 0), 0),
  };
}

export function attentionItems() {
  const items = [];
  const overdue = ORDERS.filter((o) => o.status === "overdue");
  if (overdue.length > 0) {
    items.push({
      id: "att-overdue",
      tone: "danger",
      title: `${overdue.length} đơn quá hạn trả đồ`,
      detail: `${overdue[0].code} — ${overdue[0].receiverName}, cần liên hệ thu hồi.`,
      href: "/admin/orders",
      actionLabel: "Xem đơn quá hạn",
    });
  }
  const pending = ORDERS.filter((o) => o.status === "pending_payment");
  if (pending.length > 0) {
    items.push({
      id: "att-payment",
      tone: "warning",
      title: `${pending.length} đơn chờ thanh toán`,
      detail: "Khách cần thanh toán để xác nhận giữ chỗ cho trang phục.",
      href: "/admin/orders",
      actionLabel: "Kiểm tra thanh toán",
    });
  }
  const maint = MAINTENANCE.filter((m) => m.status === "todo");
  if (maint.length > 0) {
    items.push({
      id: "att-maint",
      tone: "info",
      title: `${maint.length} trang phục chờ giặt ủi & bảo quản`,
      detail: "Cần hoàn tất chuẩn bị trước lịch bàn giao tiếp theo.",
      href: "/admin/products",
      actionLabel: "Xem danh sách kho",
    });
  }
  return items;
}

export function todayTimeline() {
  const events = [];
  for (const o of ORDERS) {
    if (o.pickupDate === TODAY) {
      events.push({
        time: "10:00",
        kind: o.pickupMethod === "delivery" ? "delivery" : "pickup",
        orderCode: o.code,
        customerName: o.receiverName,
        summary: o.items.map((i) => i.productNameSnapshot).join(" · "),
        status: o.status,
      });
    }
    if (o.returnDate === TODAY || o.status === "overdue") {
      events.push({
        time: "18:00",
        kind: "return",
        orderCode: o.code,
        customerName: o.receiverName,
        summary: o.items.map((i) => i.productNameSnapshot).join(" · "),
        status: o.status,
        overdue: o.status === "overdue",
      });
    }
  }
  return events;
}

export function statusDistribution() {
  const allStatuses = ["pending_payment", "confirmed", "preparing", "ready", "in_use", "overdue", "completed", "cancelled"];
  return allStatuses.map((st) => ({
    status: st,
    count: ORDERS.filter((o) => o.status === st).length,
  }));
}

export function revenueSeries(days = 14) {
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(TODAY, -i);
    const val = (i % 3 === 0) ? 1200000 : (i % 2 === 0) ? 850000 : 0;
    series.push({ date: d, value: val });
  }
  return series;
}

export function topProducts(limit = 5) {
  return [...PRODUCTS]
    .sort((a, b) => b.rentalCount - a.rentalCount)
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      rentals: p.rentalCount,
      revenue: p.rentalCount * p.pricePerDay,
    }));
}
