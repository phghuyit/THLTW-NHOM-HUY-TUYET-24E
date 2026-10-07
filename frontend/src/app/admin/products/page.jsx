"use client";

import { useEffect, useMemo, useState } from "react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { brandService } from "@/services/brandService";
import { PageHeader, Toolbar } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Overlay";
import { StatusChip } from "@/components/ui/Primitives";
import { IconEdit, IconPlus, IconTrash } from "@/components/ui/Icons";
import { formatVnd } from "@/lib/money";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    setLoading(true);
    const [prods, cats, brs] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories(),
      brandService.getBrands(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setBrands(brs);
    setLoading(false);
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
      category_id: prod.category_id || "",
      brand_id: prod.brand_id || "",
      rental_price_per_day: prod.rental_price_per_day || prod.pricePerDay || "",
      original_value: prod.original_value || prod.replacementValue || "",
      thumbnail: prod.thumbnail || "",
      description: prod.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, formData);
    } else {
      await productService.createProduct(formData);
    }
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      await productService.deleteProduct(id);
      await loadData();
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "all") {
        const match =
          String(p.category_id) === String(categoryFilter) ||
          p.categorySlug === categoryFilter;
        if (!match) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [products, categoryFilter, search]);

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

      <Toolbar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Tìm theo tên hoặc mã..."
        quickFilters={[
          { key: "all", label: "Tất cả", count: products.length },
          ...categories.map((c) => ({
            key: c.slug || String(c.id),
            label: c.name,
          })),
        ]}
        activeQuick={categoryFilter}
        onQuickChange={setCategoryFilter}
        resultLabel={`${filteredProducts.length} sản phẩm`}
      />

      <DataTable
        columns={columns}
        rows={filteredProducts}
        getKey={(p) => p.id}
        loading={loading}
      />

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
            <button type="submit" className="btn btn-sm">
              Lưu sản phẩm
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
