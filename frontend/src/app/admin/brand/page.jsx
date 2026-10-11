"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteBrand, getBrands } from "@/services/brandService";
import { PageHeader, StatCard, Toolbar } from "@/components/admin/ui/PageParts";
import { IconPlus, IconTrash } from "@/components/admin/ui/Icons";
import { DataTable, RowActions, TableFooter } from "@/components/admin/ui/DataTable";
import { StatusChip } from "@/components/admin/ui/Primitives";

export default function BrandPage() {

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getBrands(controller.signal)
      .then((result) => {
        setBrands(result.data);
        setError("");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;

        setError(error.response?.data?.message || "Không tải được danh sách thương hiệu.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reload]);

  async function handleDelete(brand) {
    if (deleting || !window.confirm(`Chuyển thương hiệu "${brand.name}" vào thùng rác? Có thể khôi phục sau.`)) return;
    setDeleting(true);
    setActionError("");

    try {
      const result = await deleteBrand(brand.id);
      window.alert(result.message);
      setLoading(true);
      setReload((value) => value + 1);
    } catch (error) {
      setActionError(error.response?.status === 404
        ? "Thương hiệu không tồn tại hoặc đã được xóa. Hãy tải lại trang."
        : error.response?.data?.message || "Không xóa được thương hiệu.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p role="status">Đang tải thương hiệu...</p>;
  if (error) return <p role="alert" className="text-danger">{error}</p>;

  const activeCount = brands.filter((brand) => brand.status === "active").length;

  return <>

    <PageHeader title="Thương hiệu" description="Quản lý tên, logo và thông tin các thương hiệu trong danh mục sản phẩm."
      breadcrumb={[{ label: "Catalog" }, { label: "Thương hiệu" }]}
      actions={<div className="flex flex-wrap items-center gap-2"><Link href="/admin/brand/trash" className="btn btn-danger btn-sm gap-1.5"><IconTrash width={14} height={14} />Thùng rác</Link><Link href="/admin/brand/create" className="btn btn-sm gap-1.5"><IconPlus width={14} height={14} />Thêm thương hiệu</Link></div>} />
    {actionError && <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger-soft p-3 text-[13px] text-danger">{actionError}</p>}
    <div className="mb-5 grid grid-cols-1 gap-2.5 @lg:grid-cols-3">
      <StatCard label="Thương hiệu trang này" value={brands.length} sub="Số hàng đã tải từ backend" />
      <StatCard label="Đang hiển thị" value={activeCount} tone="success" sub="Trong trang đang tải" />
      <StatCard label="Đang ẩn" value={brands.length - activeCount} sub="Trong trang đang tải" />
    </div>
    <Toolbar searchPlaceholder="Tìm tên thương hiệu hoặc slug..." resultLabel={`${brands.length} thương hiệu`}>
      <button disabled type="button" className="btn btn-sm">Tất cả · {brands.length}</button>
      <button disabled type="button" className="btn btn-outline btn-sm">Đang hiển thị · {activeCount}</button>
      <button disabled type="button" className="btn btn-outline btn-sm">Đang ẩn · {brands.length - activeCount}</button>
    </Toolbar>
    <DataTable label="Danh sách thương hiệu" headings={<><th>ID</th><th>Thương hiệu</th><th>Slug</th><th>Mô tả</th><th>Trạng thái</th><th className="text-right">Thao tác</th></>}>
    {brands.length === 0 && <tr><td colSpan={6} className="text-center text-ink-2">Chưa có thương hiệu.</td></tr>}
    {brands.map((brand) => (
  <tr key={brand.id}>
    <td>{brand.id}</td>

    <td>
      <BrandName
        initials={brand.name.slice(0, 2).toUpperCase()}
        name={brand.name}
        logo={brand.logo}
      />
    </td>

    <td>{brand.slug}</td>
    <td>{brand.description || "—"}</td>

    <td>
      <StatusChip
        tone={brand.status === "active" ? "success" : "neutral"}
      >
        {brand.status === "active" ? "Đang hiển thị" : "Đang ẩn"}
      </StatusChip>
    </td>

    <td><RowActions editHref={`/admin/brand/${brand.id}/edit`} onDelete={() => handleDelete(brand)} disabled={deleting} /></td>
  </tr>
))}
    </DataTable>
    <TableFooter label={`${brands.length} thương hiệu`} note="Dữ liệu từ backend" />
  </>;
}

function BrandName({ initials, name, logo }) {
  return <div className="flex items-center gap-2.5">
    {logo
      ? <Image src={logo} alt={`Logo ${name}`} width={36} height={36} unoptimized className="h-9 w-9 shrink-0 rounded border border-line object-cover" />
      : <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-line bg-accent-soft text-[10px] font-medium text-accent">{initials}</span>}
    <span className="text-[12.5px] font-medium">{name}</span>
  </div>;
}

