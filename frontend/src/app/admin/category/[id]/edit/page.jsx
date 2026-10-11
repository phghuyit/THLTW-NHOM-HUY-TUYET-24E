"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CategoryForm from "@/components/admin/category/CategoryForm";
import { getCategory, getCategoryParents, updateCategory } from "@/services/categoryService";
import { PageHeader } from "@/components/admin/ui/PageParts";
import { IconArrowLeft } from "@/components/admin/ui/Icons";

export default function EditCategoryPage() {
  const { id } = useParams();
  return <EditCategoryContent key={id} id={id} />;
}

function EditCategoryContent({ id }) {
  const [category, setCategory] = useState(null);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getCategory(id, controller.signal), getCategoryParents(controller.signal)])
      .then(([categoryResult, parentResult]) => {
        setCategory(categoryResult.data);
        setParents(parentResult.data);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(error.response?.status === 404
          ? "Danh mục không tồn tại hoặc đã bị xóa."
          : "Không tải được thông tin danh mục.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  return <>
    <PageHeader title="Cập nhật danh mục" description="Chỉnh sửa thông tin, danh mục cha, ảnh và trạng thái."
      breadcrumb={[{ label: "Catalog" }, { label: "Danh mục" }, { label: "Chỉnh sửa" }]}
      actions={<Link href="/admin/category" className="btn btn-outline btn-sm"><IconArrowLeft width={14} height={14} />Về danh sách</Link>} />
    {loading ? <p role="status">Đang tải danh mục...</p>
      : error ? <p role="alert" className="text-danger">{error}</p>
        : <CategoryForm category={category} parents={parents} onSave={(data) => updateCategory(category.id, data)}
            submitLabel="Lưu thay đổi" successMessage="Cập nhật danh mục thành công!" />}
  </>;
}
