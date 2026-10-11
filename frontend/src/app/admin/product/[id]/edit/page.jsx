"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/product/ProductForm";
import { getProduct, getProductOptions, updateProduct } from "@/services/productService";
import { PageHeader } from "@/components/admin/ui/PageParts";
import { IconArrowLeft } from "@/components/admin/ui/Icons";

export default function EditProductPage() {
  const { id } = useParams();
  return <EditProductContent key={id} id={id} />;
}

function EditProductContent({ id }) {
  const [product, setProduct] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getProduct(id, controller.signal), getProductOptions(controller.signal)])
      .then(([productResult, optionResult]) => {
        setProduct(productResult.data);
        setOptions(optionResult.data);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(error.response?.status === 404
          ? "Sản phẩm không tồn tại hoặc đã bị xóa."
          : "Không tải được thông tin sản phẩm.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  return <>
    <PageHeader title="Cập nhật sản phẩm" description="Chỉnh sửa thông tin, giá thuê, size, ảnh và trạng thái."
      breadcrumb={[{ label: "Catalog" }, { label: "Sản phẩm" }, { label: "Chỉnh sửa" }]}
      actions={<Link href="/admin/product" className="btn btn-outline btn-sm"><IconArrowLeft width={14} height={14} />Về danh sách</Link>} />
    {loading ? <p role="status">Đang tải sản phẩm...</p>
      : error ? <p role="alert" className="text-danger">{error}</p>
        : <ProductForm product={product} options={options} onSave={(data) => updateProduct(product.id, data)}
            submitLabel="Lưu thay đổi" successMessage="Cập nhật sản phẩm thành công!" />}
  </>;
}
