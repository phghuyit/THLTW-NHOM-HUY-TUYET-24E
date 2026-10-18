"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { brandService } from "@/services/brandService";
import { orderService } from "@/services/orderService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { OrderStatusChip } from "@/components/admin/Chips";
import { IconRotateCcw, IconTrash } from "@/components/ui/Icons";
import { formatDate } from "@/lib/date";
import { formatVnd } from "@/lib/money";

export default function AdminTrashPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const loadTrash = async () => {
    setLoading(true);
    const [oList, pList, cList, bList] = await Promise.all([
      orderService.getTrashOrders(),
      productService.getTrashProducts(),
      categoryService.getTrashCategories(),
      brandService.getTrashBrands(),
    ]);
    setOrders(Array.isArray(oList) ? oList : []);
    setProducts(Array.isArray(pList) ? pList : []);
    setCategories(Array.isArray(cList) ? cList : []);
    setBrands(Array.isArray(bList) ? bList : []);
    setLoading(false);
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (type, id) => {
    if (type === "orders") await orderService.restoreOrder(id);
    if (type === "products") await productService.restoreProduct(id);
    if (type === "categories") await categoryService.restoreCategory(id);
    if (type === "brands") await brandService.restoreBrand(id);
    await loadTrash();
  };

  const handleForceDelete = async (type, id) => {
    if (!confirm("Hành động này sẽ xóa vĩnh viễn và không thể khôi phục. Tiếp tục?")) return;
    if (type === "orders") await orderService.forceDeleteOrder(id);
    if (type === "products") await productService.forceDeleteProduct(id);
    if (type === "categories") await categoryService.forceDeleteCategory(id);
    if (type === "brands") await brandService.forceDeleteBrand(id);
    await loadTrash();
  };

  const orderColumns = [
    {
      key: "code",
      header: "Mã đơn",
      render: (o) => (
        <div>
          <p className="font-semibold text-ink">{o.code}</p>
          <p className="text-[11px] text-ink-3">{formatDate(o.createdAt?.slice(0, 10))}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Khách hàng",
      render: (o) => (
        <div>
          <p className="font-medium text-ink">{o.receiverName}</p>
          <p className="text-[11.5px] text-ink-2">{o.receiverPhone}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Tổng tiền",
      align: "right",
      render: (o) => <span className="font-semibold text-accent">{formatVnd(o.grandTotal)}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (o) => <OrderStatusChip status={o.status || "cancelled"} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (o) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("orders", o.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục đơn
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("orders", o.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const productColumns = [
    {
      key: "product",
      header: "Sản phẩm",
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80"}
            alt={p.name}
            className="h-10 w-10 rounded object-cover opacity-75"
          />
          <div>
            <p className="font-medium text-ink">{p.name}</p>
            <p className="text-[11.5px] text-ink-3">ID: {p.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Giá thuê / ngày",
      align: "right",
      render: (p) => formatVnd(p.rental_price_per_day || 0),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("products", p.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("products", p.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const categoryColumns = [
    {
      key: "name",
      header: "Tên danh mục",
      render: (c) => <span className="font-semibold text-ink">{c.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (c) => <span className="font-mono text-xs text-ink-3">{c.slug}</span>,
    },
    {
      key: "description",
      header: "Mô tả",
      render: (c) => <span className="text-[12.5px] text-ink-2">{c.description || "—"}</span>,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("categories", c.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("categories", c.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  const brandColumns = [
    {
      key: "name",
      header: "Tên thương hiệu",
      render: (b) => <span className="font-semibold text-ink">{b.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (b) => <span className="font-mono text-xs text-ink-3">{b.slug}</span>,
    },
    {
      key: "description",
      header: "Mô tả",
      render: (b) => <span className="text-[12.5px] text-ink-2">{b.description || "—"}</span>,
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (b) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleRestore("brands", b.id)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconRotateCcw width={13} height={13} /> Khôi phục
          </button>
          <button
            type="button"
            onClick={() => handleForceDelete("brands", b.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa vĩnh viễn
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Thùng rác hệ thống"
        description="Khôi phục hoặc xóa vĩnh viễn đơn hủy, sản phẩm, danh mục và thương hiệu đã xóa."
      />

      <div className="mb-4 flex flex-wrap gap-2 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "orders"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Đơn đã hủy ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "products"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Sản phẩm ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "categories"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Danh mục ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("brands")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === "brands"
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2 hover:text-ink"
          }`}
        >
          Thương hiệu ({brands.length})
        </button>
      </div>

      {activeTab === "orders" && (
        <DataTable
          columns={orderColumns}
          rows={orders}
          getKey={(o) => o.code || o.id}
          loading={loading}
          emptyText="Thùng rác đơn hàng trống."
        />
      )}

      {activeTab === "products" && (
        <DataTable
          columns={productColumns}
          rows={products}
          getKey={(p) => p.id}
          loading={loading}
          emptyText="Thùng rác sản phẩm trống."
        />
      )}

      {activeTab === "categories" && (
        <DataTable
          columns={categoryColumns}
          rows={categories}
          getKey={(c) => c.id || c.slug}
          loading={loading}
          emptyText="Thùng rác danh mục trống."
        />
      )}

      {activeTab === "brands" && (
        <DataTable
          columns={brandColumns}
          rows={brands}
          getKey={(b) => b.id || b.slug}
          loading={loading}
          emptyText="Thùng rác thương hiệu trống."
        />
      )}
    </div>
  );
}
