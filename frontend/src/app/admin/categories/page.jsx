"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Overlay";
import { IconEdit, IconPlus, IconTrash } from "@/components/ui/Icons";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const loadCategories = async () => {
    setLoading(true);
    const data = await categoryService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id, formData);
    } else {
      await categoryService.createCategory(formData);
    }
    setModalOpen(false);
    await loadCategories();
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      await categoryService.deleteCategory(id);
      await loadCategories();
    }
  };

  const columns = [
    {
      key: "name",
      header: "Tên danh mục",
      sortValue: (c) => c.name,
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
            onClick={() => openEditModal(c)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(c.id)}
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
        title="Quản lý danh mục"
        description="Các danh mục phân loại trang phục trong hệ thống."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm danh mục
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={categories}
        getKey={(c) => c.id || c.slug}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên danh mục</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
            />
          </div>

          <div>
            <label className="field-label">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="de-trong-tu-dong-tao"
              className="field"
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
              Lưu danh mục
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
