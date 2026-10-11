"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { forceDeleteProduct, getTrashedProducts, restoreProduct } from "@/services/productService";
import { PageHeader, StatCard } from "@/components/admin/ui/PageParts";
import { DataTable } from "@/components/admin/ui/DataTable";
import { IconArrowLeft, IconTrash } from "@/components/admin/ui/Icons";

export default function ProductTrashPage() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processing, setProcessing] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getTrashedProducts(controller.signal, page)
      .then((result) => {
        setProducts(result.data);
        setMeta(result.meta);
        setError("");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(error.response?.data?.message || "Không tải được thùng rác.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, reload]);

  async function handleAction(product, type) {
    const isDelete = type === "delete";
    const confirmation = isDelete
      ? `Xóa vĩnh viễn sản phẩm "${product.name}" và ảnh đã tải lên? Không thể khôi phục sau khi xóa.`
      : `Khôi phục sản phẩm "${product.name}"?`;
    if (processing !== null || !window.confirm(confirmation)) return;
    setProcessing({ id: product.id, type });
    setActionError("");

    try {
      if (isDelete) {
        const result = await forceDeleteProduct(product.id);
        window.alert(result.message);
      } else {
        await restoreProduct(product.id);
        window.alert("Khôi phục sản phẩm thành công!");
      }
      setLoading(true);
      if (products.length === 1 && page > 1) setPage(page - 1);
      else setReload((value) => value + 1);
    } catch (error) {
      setActionError(error.response?.status === 404
        ? "Sản phẩm không còn trong thùng rác. Hãy tải lại trang."
        : error.response?.data?.message || "Không thực hiện được thao tác.");
    } finally {
      setProcessing(null);
    }
  }

  function changePage(nextPage) {
    setLoading(true);
    setPage(nextPage);
  }

  return <>
    <PageHeader title="Thùng rác sản phẩm" description="Khôi phục để đưa về danh sách hoặc xóa vĩnh viễn sản phẩm không còn sử dụng."
      breadcrumb={[{ label: "Catalog" }, { label: "Sản phẩm" }, { label: "Thùng rác" }]}
      actions={<Link href="/admin/product" className="btn btn-outline btn-sm"><IconArrowLeft width={14} height={14} />Về danh sách</Link>} />
    <div className="mb-5"><StatCard label="Sản phẩm trong thùng rác" value={meta?.total ?? "—"} sub="Dữ liệu vẫn được giữ để khôi phục" /></div>
    {actionError && <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger">{actionError}</p>}
    {loading ? <p role="status">Đang tải thùng rác...</p>
      : error ? <p role="alert" className="text-danger">{error}</p>
        : <>
          <DataTable label="Sản phẩm đã xóa" headings={<><th>ID</th><th>Sản phẩm</th><th>Slug</th><th>Ngày xóa</th><th className="text-right">Thao tác</th></>}>
            {products.length === 0 && <tr><td colSpan={5} className="text-center text-ink-2">Thùng rác trống.</td></tr>}
            {products.map((product) => <tr key={product.id}>
              <td>{product.id}</td><td className="font-medium">{product.name}</td><td>{product.slug}</td>
              <td>{product.deleted_at ? new Date(product.deleted_at).toLocaleString("vi-VN") : "—"}</td>
              <td><div className="flex justify-end gap-2">
                <button type="button" className="btn btn-outline btn-sm" disabled={processing !== null}
                  onClick={() => handleAction(product, "restore")}>{processing?.id === product.id && processing.type === "restore" ? "Đang khôi phục..." : "Khôi phục"}</button>
                <button type="button" className="btn btn-danger btn-sm gap-1.5" disabled={processing !== null}
                  onClick={() => handleAction(product, "delete")}><IconTrash width={14} height={14} />{processing?.id === product.id && processing.type === "delete" ? "Đang xóa..." : "Xóa vĩnh viễn"}</button>
              </div></td>
            </tr>)}
          </DataTable>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-ink-3">
            <span>{meta?.total ?? 0} sản phẩm đã xóa</span>
            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-outline btn-sm" disabled={page <= 1 || processing !== null} onClick={() => changePage(page - 1)}>Trước</button>
              <span>Trang {page} / {meta?.last_page ?? 1}</span>
              <button type="button" className="btn btn-outline btn-sm" disabled={page >= (meta?.last_page ?? 1) || processing !== null} onClick={() => changePage(page + 1)}>Sau</button>
            </div>
          </div>
        </>}
  </>;
}
