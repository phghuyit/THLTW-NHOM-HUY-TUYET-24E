"use client";

import { useEffect, useState } from "react";
import { brandService } from "@/services/brandService";
import { PageHeader } from "@/components/ui/PageParts";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Overlay";
import { IconEdit, IconPlus, IconTrash } from "@/components/ui/Icons";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const loadBrands = async () => {
    setLoading(true);
    const data = await brandService.getBrands();
    setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({ name: "", slug: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBrand(b);
    setFormData({
      name: b.name || "",
      slug: b.slug || "",
      description: b.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingBrand) {
      await brandService.updateBrand(editingBrand.id, formData);
    } else {
      await brandService.createBrand(formData);
    }
    setModalOpen(false);
    await loadBrands();
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      await brandService.deleteBrand(id);
      await loadBrands();
    }
  };

  const columns = [
    {
      key: "name",
      header: "Tên thương hiệu",
      sortValue: (b) => b.name,
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
            onClick={() => openEditModal(b)}
            className="btn btn-outline btn-sm gap-1"
          >
            <IconEdit width={13} height={13} /> Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(b.id)}
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
        title="Quản lý thương hiệu"
        description="Các thương hiệu, nhà thiết kế thời trang hợp tác."
        actions={
          <button type="button" onClick={openCreateModal} className="btn btn-sm gap-1.5">
            <IconPlus width={14} height={14} /> Thêm thương hiệu
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={brands}
        getKey={(b) => b.id || b.slug}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Tên thương hiệu</label>
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
              Lưu thương hiệu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
