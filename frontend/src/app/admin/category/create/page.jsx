"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryForm from "@/components/admin/category/CategoryForm";
import { createCategory, getCategoryParents } from "@/services/categoryService";
import { PageHeader } from "@/components/admin/ui/PageParts";
import { IconArrowLeft } from "@/components/admin/ui/Icons";

export default function CreateCategoryPage() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getCategoryParents(controller.signal)
      .then((result) => setParents(result.data))
      .catch(() => {
        if (!controller.signal.aborted) setError("Không tải được danh mục cha. Hãy tải lại trang.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return <>
    <PageHeader title="Thêm danh mục" description="Tạo danh mục mới và thiết lập thông tin hiển thị."
      breadcrumb={[{ label: "Catalog" }, { label: "Danh mục" }, { label: "Thêm mới" }]}
      actions={<Link href="/admin/category" className="btn btn-outline btn-sm"><IconArrowLeft width={14} height={14} />Về danh sách</Link>} />
    {loading ? <p role="status">Đang tải danh mục cha...</p>
      : error ? <p role="alert" className="text-danger">{error}</p>
        : <CategoryForm parents={parents} onSave={createCategory} submitLabel="Lưu danh mục" successMessage="Thêm danh mục thành công!" />}
  </>;
}
