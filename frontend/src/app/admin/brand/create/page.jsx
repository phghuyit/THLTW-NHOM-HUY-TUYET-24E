"use client";

import Link from "next/link";
import BrandForm from "@/components/admin/brand/BrandForm";
import { createBrand } from "@/services/brandService";
import { PageHeader } from "@/components/admin/ui/PageParts";
import { IconArrowLeft } from "@/components/admin/ui/Icons";

export default function CreateBrandPage() {
  return <>
    <PageHeader title="Thêm thương hiệu" description="Tạo thương hiệu mới và thiết lập thông tin hiển thị trong danh mục."
      breadcrumb={[{ label: "Catalog" }, { label: "Thương hiệu" }, { label: "Thêm mới" }]}
      actions={<Link href="/admin/brand" className="btn btn-outline btn-sm"><IconArrowLeft width={14} height={14} />Về danh sách</Link>} />
    <BrandForm onSave={createBrand} submitLabel="Lưu thương hiệu" successMessage="Thêm thương hiệu thành công!" />
  </>;
}
