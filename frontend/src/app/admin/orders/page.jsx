"use client";

import { useEffect, useMemo, useState } from "react";
import { orderService } from "@/services/orderService";
import { PageHeader, Toolbar } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Overlay";
import { OrderStatusChip } from "@/components/admin/Chips";
import { formatDate, formatDateTime } from "@/lib/date";
import { formatVnd } from "@/lib/money";
import { ORDER_STATUS } from "@/lib/order-status";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewOrder, setPreviewOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    const data = await orderService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (code, newStatus) => {
    await orderService.updateOrderStatus(code, newStatus);
    await loadOrders();
    if (previewOrder?.code === code) {
      setPreviewOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${o.code} ${o.receiverName} ${o.receiverPhone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const columns = [
    {
      key: "code",
      header: "Mã đơn",
      sortValue: (o) => o.code,
      render: (o) => (
        <div>
          <p className="font-semibold text-ink">{o.code}</p>
          <p className="text-[11px] text-ink-3">
            {o.channel === "walk_in" ? "Tại quầy" : "Online"} · {formatDate(o.createdAt?.slice(0, 10))}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Khách hàng",
      sortValue: (o) => o.receiverName,
      render: (o) => (
        <div>
          <p className="font-medium text-ink">{o.receiverName}</p>
          <p className="text-[11.5px] text-ink-2">{o.receiverPhone}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Món thuê",
      render: (o) => (
        <span className="line-clamp-1 text-[12.5px] text-ink-2">
          {o.items?.[0]?.productNameSnapshot || "Trang phục"}
          {o.items?.length > 1 ? ` (+${o.items.length - 1})` : ""}
        </span>
      ),
    },
    {
      key: "period",
      header: "Kỳ thuê",
      render: (o) => (
        <span className="text-[12px] text-ink-2">
          {formatDate(o.pickupDate)} → {formatDate(o.returnDate)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Tổng tiền",
      align: "right",
      sortValue: (o) => o.grandTotal,
      render: (o) => <span className="font-semibold text-accent">{formatVnd(o.grandTotal)}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (o) => <OrderStatusChip status={o.status} />,
    },
    {
      key: "actions",
      header: "Chi tiết",
      align: "right",
      render: (o) => (
        <button
          type="button"
          onClick={() => setPreviewOrder(o)}
          className="btn btn-outline btn-sm"
        >
          Xem
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý đơn thuê"
        description="Toàn bộ đơn thuê trang phục của khách hàng."
      />

      <Toolbar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Tìm mã đơn, tên khách, số điện thoại..."
        quickFilters={[
          { key: "all", label: "Tất cả", count: orders.length },
          { key: "pending_payment", label: "Chờ thanh toán" },
          { key: "confirmed", label: "Đã xác nhận" },
          { key: "ready", label: "Sẵn sàng" },
          { key: "in_use", label: "Đang thuê" },
          { key: "overdue", label: "Quá hạn" },
          { key: "completed", label: "Hoàn tất" },
        ]}
        activeQuick={statusFilter}
        onQuickChange={setStatusFilter}
        resultLabel={`${filteredOrders.length} đơn hàng`}
      />

      <DataTable
        columns={columns}
        rows={filteredOrders}
        getKey={(o) => o.code}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewOrder)}
        onClose={() => setPreviewOrder(null)}
        title={`Chi tiết đơn: ${previewOrder?.code || ""}`}
        subtitle={`${previewOrder?.receiverName || ""} · ${previewOrder?.receiverPhone || ""}`}
      >
        {previewOrder && (
          <div className="space-y-5 text-[13px]">
            <div className="flex items-center justify-between">
              <OrderStatusChip status={previewOrder.status} />
              <span className="text-[12px] text-ink-3">Tạo lúc: {formatDateTime(previewOrder.createdAt)}</span>
            </div>

            <div className="card p-3">
              <h4 className="font-semibold mb-2">Cập nhật trạng thái đơn</h4>
              <select
                value={previewOrder.status}
                onChange={(e) => handleStatusChange(previewOrder.code, e.target.value)}
                className="field"
              >
                {Object.keys(ORDER_STATUS).map((st) => (
                  <option key={st} value={st}>
                    {ORDER_STATUS[st]?.label || st}
                  </option>
                ))}
              </select>
            </div>

            <div className="card divide-y divide-line">
              {previewOrder.items?.map((it, idx) => (
                <div key={idx} className="flex gap-3 p-3">
                  <img src={it.image} alt={it.productNameSnapshot} className="h-16 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{it.productNameSnapshot}</p>
                    <p className="text-[12px] text-ink-2">
                      Size: {it.variantSnapshot?.size} · Màu: {it.variantSnapshot?.color}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-accent">{formatVnd(it.lineRentalTotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-2">Tiền thuê:</span>
                <span className="font-medium">{formatVnd(previewOrder.subtotalRental)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-2">Tiền cọc giữ:</span>
                <span className="font-medium">{formatVnd(previewOrder.totalDeposit)}</span>
              </div>
              <div className="border-t border-line pt-2 flex justify-between font-bold">
                <span>Tổng đơn:</span>
                <span className="text-accent">{formatVnd(previewOrder.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Đã thanh toán:</span>
                <span>{formatVnd(previewOrder.paidAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
