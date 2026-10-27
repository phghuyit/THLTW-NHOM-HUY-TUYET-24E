"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { brandService } from "@/services/brandService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@/components/ui/Icons";
import { useToast } from "@/components/ui/Toast";
import { formatVnd } from "@/lib/money";

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    brand_id: "",
    rental_price_per_day: "",
    original_value: "",
    thumbnail: "",
    description: "",
  });

  const loadData = async () => {
    try {
      const [prods, cats, brs] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
        brandService.getBrands(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setBrands(brs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category_id: categories[0]?.id || "",
      brand_id: brands[0]?.id || "",
      rental_price_per_day: "",
      original_value: "",
      thumbnail: "",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || "",
      category_id: prod.category_id || prod.category?.id || categories[0]?.id || "",
      brand_id: prod.brand_id || prod.brand?.id || "",
      rental_price_per_day: prod.rental_price_per_day || prod.pricePerDay || "",
      original_value: prod.original_value || prod.replacementValue || "",
      thumbnail: prod.thumbnail || "",
      description: prod.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.push({ tone: "danger", title: "Vui lòng nhập tên sản phẩm." });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category_id: parseInt(formData.category_id, 10),
        brand_id: formData.brand_id ? parseInt(formData.brand_id, 10) : null,
        rental_price_per_day: parseInt(formData.rental_price_per_day, 10) || 0,
        original_value: parseInt(formData.original_value, 10) || 0,
        thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        description: formData.description || null,
      };

      if (!editingProduct) {
        payload.sizes = [{ size: "FreeSize", stock_quantity: 10 }];
        payload.images = [{ image_url: payload.thumbnail, sort_order: 1 }];
        await productService.createProduct(payload);
        toast.push({ tone: "success", title: "Thêm sản phẩm thành công!" });
      } else {
        await productService.updateProduct(editingProduct.id, payload);
        toast.push({ tone: "success", title: "Cập nhật sản phẩm thành công!" });
      }

      setModalOpen(false);
      await loadData();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.name?.[0] ||
        err.response?.data?.message ||
        "Không thể lưu sản phẩm. Vui lòng kiểm tra lại.";
      toast.push({ tone: "danger", title: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productService.deleteProduct(id);
        toast.push({ tone: "success", title: "Đã chuyển sản phẩm vào thùng rác." });
        await loadData();
      } catch (err) {
        toast.push({ tone: "danger", title: "Không thể xóa sản phẩm." });
      }
    }
  };

  const columns = [
    {
      key: "product",
      header: "Sản phẩm",
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=120&q=80"}
            alt={p.name}
            className="h-10 w-10 rounded object-cover"
          />
          <div>
            <p className="font-medium text-ink">{p.name}</p>
            <p className="text-[11.5px] text-ink-3">{p.sku || `SP-${p.id}`}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Danh mục",
      render: (p) => p.category?.name || p.categorySlug || "Áo dài",
    },
    {
      key: "price",
      header: "Giá thuê / ngày",
      align: "right",
      sortValue: (p) => p.rental_price_per_day || p.pricePerDay || 0,
      render: (p) => (
        <span className="font-semibold text-accent">
          {formatVnd(p.rental_price_per_day || p.pricePerDay || 0)}
        </span>
      ),
    },
    {
      key: "original",
      header: "Giá trị gốc",
      align: "right",
      render: (p) => formatVnd(p.original_value || p.replacementValue || 0),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (p) => (
        <StatusChip tone={p.is_featured ? "warning" : "success"}>
          {p.is_featured ? "Nổi bật" : "Sẵn sàng"}
        </StatusChip>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPreviewProduct(p)}
            className="btn btn-outline btn-sm gap-1"
            title="Xem chi tiết"
          >
            <IconEye width={13} height={13} /> Xem
          </button>
          <button
            type="button"
            onClick={() => openEditModal(p)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(p.id)}
            className="btn btn-danger btn-sm gap-1"
          >
            <IconTrash width={13} height={13} /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý sản phẩm"
        description="Danh sách sản phẩm trong kho phục vụ cho thuê."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm sản phẩm
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={products}
        getKey={(p) => p.id}
        loading={loading}
      />

      <Drawer
        open={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
        title={previewProduct?.name || "Chi tiết sản phẩm"}
        subtitle={previewProduct?.sku || `Mã SP: ${previewProduct?.id || ""}`}
        width="max-w-md"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const prod = previewProduct;
                setPreviewProduct(null);
                openEditModal(prod);
              }}
              className="btn btn-outline btn-sm gap-1.5"
            >
              <IconEdit width={14} height={14} /> Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => setPreviewProduct(null)}
              className="btn btn-sm"
            >
              Đóng
            </button>
          </div>
        }
      >
        {previewProduct && (
          <div className="space-y-5 text-[13px]">
            <div className="overflow-hidden rounded-lg border border-line bg-surface">
              <img
                src={previewProduct.thumbnail || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"}
                alt={previewProduct.name}
                className="h-56 w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-warm px-2 py-0.5 text-xs font-medium text-ink">
                {previewProduct.category?.name || previewProduct.categorySlug || "Áo dài"}
              </span>
              {previewProduct.brand?.name && (
                <span className="rounded bg-line px-2 py-0.5 text-xs text-ink-2">
                  {previewProduct.brand.name}
                </span>
              )}
              <StatusChip tone={previewProduct.is_featured ? "warning" : "success"}>
                {previewProduct.is_featured ? "Nổi bật" : "Sẵn sàng cho thuê"}
              </StatusChip>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-surface p-4">
              <div>
                <p className="text-[11px] text-ink-3">Giá thuê / ngày</p>
                <p className="text-base font-bold text-accent">
                  {formatVnd(previewProduct.rental_price_per_day || previewProduct.pricePerDay || 0)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-ink-3">Giá trị sản phẩm</p>
                <p className="text-sm font-semibold text-ink">
                  {formatVnd(previewProduct.original_value || previewProduct.replacementValue || 0)}
                </p>
              </div>
            </div>

            {previewProduct.sizes && previewProduct.sizes.length > 0 && (
              <div className="rounded-lg border border-line bg-surface p-4">
                <h4 className="text-xs font-semibold text-ink mb-2">Kích thước & Số lượng trong kho</h4>
                <div className="flex flex-wrap gap-2">
                  {previewProduct.sizes.map((s, idx) => (
                    <div key={idx} className="rounded border border-line px-2.5 py-1 text-xs">
                      <span className="font-semibold text-ink">{s.size}</span>
                      <span className="ml-1.5 text-ink-3">({s.stock_quantity ?? s.stock ?? 1} cái)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-line bg-surface p-4">
              <h4 className="text-xs font-semibold text-ink mb-1.5">Mô tả sản phẩm</h4>
              <p className="text-xs text-ink-2 leading-relaxed whitespace-pre-line">
                {previewProduct.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>

            {previewProduct.slug && (
              <div className="pt-1">
                <Link
                  href={`/products/${previewProduct.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
                  <span>Xem trên trang người dùng</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên sản phẩm</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Danh mục</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="field"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Thương hiệu</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="field"
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Giá thuê / ngày (VNĐ)</label>
              <input
                type="number"
                required
                value={formData.rental_price_per_day}
                onChange={(e) => setFormData({ ...formData, rental_price_per_day: e.target.value })}
                className="field"
              />
            </div>

            <div>
              <label className="field-label">Giá trị gốc (VNĐ)</label>
              <input
                type="number"
                value={formData.original_value}
                onChange={(e) => setFormData({ ...formData, original_value: e.target.value })}
                className="field"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Link ảnh (Thumbnail URL)</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="field"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="field-label">Mô tả</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="field"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Hủy
            </button>
            <button type="submit" disabled={submitting} className="btn btn-sm">
              {submitting ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
