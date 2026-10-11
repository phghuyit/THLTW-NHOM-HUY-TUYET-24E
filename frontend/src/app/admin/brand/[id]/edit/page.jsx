"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BrandForm from "@/components/admin/brand/BrandForm";
import { getBrand, updateBrand } from "@/services/brandService";
import { PageHeader } from "@/components/admin/ui/PageParts";
import { IconArrowLeft } from "@/components/admin/ui/Icons";

export default function EditBrandPage() {
  const { id } = useParams();
  return <EditBrandContent key={id} id={id} />;
}

function EditBrandContent({ id }) {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    getBrand(id, controller.signal)
      .then((result) => {
        setBrand(result.data);
        setError("");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(error.response?.status === 404
          ? "Thương hiệu không tồn tại hoặc đã bị xóa."
          : "Không tải được thông tin thương hiệu.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return <>
    <PageHeader title="Cập nhật thương hiệu" description="Chỉnh sửa thông tin, logo và trạng thái của thương hiệu."
      breadcrumb={[{ label: "Catalog" }, { label: "Thương hiệu" }, { label: "Chỉnh sửa" }]}
      actions={<Link href="/admin/brand" className="btn btn-outline btn-sm"><IconArrowLeft width={14} height={14} />Về danh sách</Link>} />
    {loading
      ? <p role="status">Đang tải thương hiệu...</p>
      : error
        ? <p role="alert" className="rounded-md border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger">{error}</p>
        : <BrandForm key={brand.id} brand={brand} onSave={(data) => updateBrand(brand.id, data)}
            submitLabel="Lưu thay đổi" successMessage="Cập nhật thương hiệu thành công!" />}
  </>;
}
