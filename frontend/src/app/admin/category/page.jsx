"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/admin/ui/Pagination";
import { deleteCategory, getCategories } from "@/services/categoryService";
import { PageHeader, Toolbar } from "@/components/admin/ui/PageParts";
import { IconPlus, IconTrash } from "@/components/admin/ui/Icons";
import { DataTable, RowActions } from "@/components/admin/ui/DataTable";
import { StatusChip } from "@/components/admin/ui/Primitives";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
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
    getCategories(controller.signal, page, perPage)
      .then((result) => {
        setCategories(result.data);
        setMeta(result.meta);
        setError("");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(error.response?.data?.message || "Không tải được danh sách danh mục.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, perPage, reload]);

  async function handleDelete(category) {
    if (deleting || !window.confirm(`Chuyển danh mục "${category.name}" vào thùng rác? Có thể khôi phục sau.`)) return;
    setDeleting(true);
    setActionError("");
    try {
      const result = await deleteCategory(category.id);
      window.alert(result.message);
      setLoading(true);
      if (categories.length === 1 && page > 1) setPage(page - 1);
      else setReload((value) => value + 1);
    } catch (error) {
      setActionError(error.response?.status === 404
        ? "Danh mục không tồn tại hoặc đã bị xóa. Hãy tải lại trang."
        : error.response?.data?.message || "Không xóa được danh mục.");
    } finally {
      setDeleting(false);
    }
  }

  function changePage(nextPage) {
    setLoading(true);
    setPage(nextPage);
  }

  return <>
    <PageHeader title="Danh mục" description="Tổ chức danh mục để khách hàng dễ tìm và lựa chọn trang phục."
      breadcrumb={[{ label: "Catalog" }, { label: "Danh mục" }]}
      actions={<div className="flex flex-wrap items-center gap-2"><Link href="/admin/category/trash" className="btn btn-danger btn-sm gap-1.5"><IconTrash width={14} height={14} />Thùng rác</Link><Link href="/admin/category/create" className="btn btn-sm gap-1.5"><IconPlus width={14} height={14} />Thêm danh mục</Link></div>} />
    {actionError && <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger">{actionError}</p>}
    {loading ? <p role="status">Đang tải danh mục...</p>
      : error ? <p role="alert" className="text-danger">{error}</p>
        : <>
          <Toolbar searchPlaceholder="Tìm tên danh mục hoặc slug..." resultLabel={`${meta?.total ?? categories.length} danh mục`} />
          <DataTable label="Danh sách danh mục" headings={<><th>ID</th><th>Danh mục</th><th>Slug</th><th>Danh mục cha</th><th>Mô tả</th><th>Sản phẩm</th><th>Trạng thái</th><th className="text-right">Thao tác</th></>}>
            {categories.length === 0 && <tr><td colSpan={8} className="text-center text-ink-2">Chưa có danh mục.</td></tr>}
            {categories.map((category) => <tr key={category.id}>
              <td>{category.id}</td><td><div className="flex items-center gap-2.5"><CategoryImage key={category.image} src={category.image} name={category.name} /><span className="font-medium">{category.name}</span></div></td><td>{category.slug}</td>
              <td>{category.parent_id ? category.parent_name || `ID #${category.parent_id}` : "Danh mục gốc"}</td>
              <td>{category.description || "—"}</td><td>{category.products_count ?? 0}</td>
              <td><StatusChip tone={category.status === "active" ? "success" : "neutral"}>{category.status === "active" ? "Đang hiển thị" : "Đang ẩn"}</StatusChip></td>
              <td><RowActions editHref={`/admin/category/${category.id}/edit`} onDelete={() => handleDelete(category)} disabled={deleting} /></td>
            </tr>)}
          </DataTable>
          <Pagination meta={meta} page={page} perPage={perPage} label="danh mục" disabled={deleting || loading}
            onPageChange={changePage} onPerPageChange={(value) => { setLoading(true); setPerPage(value); setPage(1); }} />
        </>}
  </>;
}


function CategoryImage({ src, name }) {
  const [failed, setFailed] = useState(false);
  return src && !failed
    ? <Image src={src} alt={`Ảnh ${name}`} width={40} height={40} unoptimized onError={() => setFailed(true)} className="h-10 w-10 shrink-0 rounded border border-line object-cover" />
    : <span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-line bg-beige text-[10px] text-ink-3">Ảnh</span>;
}
