"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductForm from "@/components/admin/product/ProductForm";
import { createProduct, getProductOptions } from "@/services/productService";
import { PageHeader } from "@/components/admin/ui/PageParts";
import { IconArrowLeft } from "@/components/admin/ui/Icons";

export default function CreateProductPage() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getProductOptions(controller.signal)
      .then((result) => setOptions(result.data))
      .catch(() => {
        if (!controller.signal.aborted) setError("Không tải được danh mục và thương hiệu. Hãy tải lại trang.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return <>
    <PageHeader title="Thêm sản phẩm" description="Tạo sản phẩm mới và thiết lập thông tin hiển thị."
      breadcrumb={[{ label: "Catalog" }, { label: "Sản phẩm" }, { label: "Thêm mới" }]}
      actions={<Link href="/admin/product" className="btn btn-outline btn-sm"><IconArrowLeft width={14} height={14} />Về danh sách</Link>} />
    {loading ? <p role="status">Đang tải danh mục và thương hiệu...</p>
      : error ? <p role="alert" className="text-danger">{error}</p>
        : <ProductForm options={options} onSave={createProduct} submitLabel="Lưu sản phẩm" successMessage="Thêm sản phẩm thành công!" />}
  </>;
}
