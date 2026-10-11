"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/admin/ui/Pagination";
import Image from "next/image";
import { deleteProduct, getProducts } from "@/services/productService";
import { PageHeader, Toolbar } from "@/components/admin/ui/PageParts";
import { IconPlus, IconTrash } from "@/components/admin/ui/Icons";
import { DataTable, RowActions } from "@/components/admin/ui/DataTable";
import { StatusChip } from "@/components/admin/ui/Primitives";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getProducts(controller.signal, page, perPage)
      .then((result) => {
        setProducts(result.data);
        setMeta(result.meta);
        setError("");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(error.response?.data?.message || "Không tải được danh sách sản phẩm.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, perPage, reload]);

  async function handleDelete(product) {
    if (deleting || !window.confirm(`Chuyển sản phẩm "${product.name}" vào thùng rác? Có thể khôi phục sau.`)) return;
    setDeleting(true);
    setActionError("");
    try {
      const result = await deleteProduct(product.id);
      window.alert(result.message);
      setLoading(true);
      if (products.length === 1 && page > 1) setPage(page - 1);
      else setReload((value) => value + 1);
    } catch (error) {
      setActionError(error.response?.status === 404
        ? "Sản phẩm không tồn tại hoặc đã bị xóa. Hãy tải lại trang."
        : error.response?.data?.message || "Không xóa được sản phẩm.");
    } finally {
      setDeleting(false);
    }
  }

  function changePage(nextPage) {
    setLoading(true);
    setPage(nextPage);
  }

  return <>
    <PageHeader title="Sản phẩm" description="Quản lý thông tin, giá thuê và tồn kho sản phẩm."
      breadcrumb={[{ label: "Catalog" }, { label: "Sản phẩm" }]}
      actions={<div className="flex flex-wrap items-center gap-2"><Link href="/admin/product/trash" className="btn btn-danger btn-sm gap-1.5"><IconTrash width={14} height={14} />Thùng rác</Link><Link href="/admin/product/create" className="btn btn-sm gap-1.5"><IconPlus width={14} height={14} />Thêm sản phẩm</Link></div>} />
    {actionError && <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger">{actionError}</p>}
    {loading ? <p role="status">Đang tải sản phẩm...</p>
      : error ? <p role="alert" className="text-danger">{error}</p>
        : <>
          <Toolbar searchPlaceholder="Tìm tên sản phẩm hoặc slug..." resultLabel={`${meta?.total ?? products.length} sản phẩm`} />
          <DataTable label="Danh sách sản phẩm" headings={<><th>ID</th><th>Sản phẩm</th><th>Danh mục</th><th>Thương hiệu</th><th>Size / Tồn kho</th><th>Giá thuê / ngày</th><th>Trạng thái</th><th className="text-right">Thao tác</th></>}>
            {products.length === 0 && <tr><td colSpan={8} className="text-center text-ink-2">Chưa có sản phẩm.</td></tr>}
            {products.map((product) => <tr key={product.id}>
              <td>{product.id}</td><td><div className="flex items-center gap-2.5"><ProductThumbnail key={product.thumbnail} src={product.thumbnail} name={product.name} /><div className="min-w-0"><p className="font-medium">{product.name}</p><p className="mt-1 text-[11px] text-ink-3">{product.slug}</p></div></div></td><td>{product.category?.name || "—"}</td>
              <td>{product.brand?.name || "—"}</td>
              <td>{product.sizes?.length ?? 0} size · {product.sizes?.reduce((total, size) => total + size.stock_quantity, 0) ?? 0} sản phẩm</td><td className="num">{Number(product.rental_price_per_day).toLocaleString("vi-VN")}₫</td>
              <td><StatusChip tone={product.status === "active" ? "success" : "neutral"}>{product.status === "active" ? "Đang hiển thị" : "Đang ẩn"}</StatusChip></td>
              <td><RowActions editHref={`/admin/product/${product.id}/edit`} onDelete={() => handleDelete(product)} disabled={deleting} /></td>
            </tr>)}
          </DataTable>
          <Pagination meta={meta} page={page} perPage={perPage} label="sản phẩm" disabled={deleting || loading}
            onPageChange={changePage} onPerPageChange={(value) => { setLoading(true); setPerPage(value); setPage(1); }} />
        </>}
  </>;
}


function ProductThumbnail({ src, name }) {
  const [failed, setFailed] = useState(false);
  return src && !failed
    ? <Image src={src} alt={name} width={40} height={48} unoptimized onError={() => setFailed(true)} className="h-12 w-10 shrink-0 rounded border border-line object-cover" />
    : <span className="grid h-12 w-10 shrink-0 place-items-center rounded border border-line bg-beige text-[10px] text-ink-3">Ảnh</span>;
}
