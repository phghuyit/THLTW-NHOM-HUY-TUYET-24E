import { PageHeader, Toolbar } from "@/components/admin/ui/PageParts";
import { IconPlus } from "@/components/admin/ui/Icons";
import { DataTable, RowActions, TableFooter } from "@/components/admin/ui/DataTable";
import { StatusChip } from "@/components/admin/ui/Primitives";

export default function ProductPage() {
  return <>
    <PageHeader title="Sản phẩm" description="Quản lý thông tin, giá thuê và danh mục sản phẩm."
      breadcrumb={[{ label: "Catalog" }, { label: "Sản phẩm" }]}
      actions={<button disabled type="button" className="btn btn-sm gap-1.5"><IconPlus width={14} height={14} />Thêm sản phẩm</button>} />
    <Toolbar searchPlaceholder="Tìm tên sản phẩm hoặc slug..." resultLabel="3 sản phẩm">
      <button disabled type="button" className="btn btn-sm">Tất cả</button>
      <button disabled type="button" className="btn btn-outline btn-sm">Đầm dự tiệc</button>
      <button disabled type="button" className="btn btn-outline btn-sm">Áo dài</button>
      <button disabled type="button" className="btn btn-outline btn-sm">Vest</button>
    </Toolbar>
    <DataTable label="Danh sách sản phẩm" headings={<><th>Sản phẩm</th><th>Danh mục</th><th>Biến thể</th><th>Giá thuê / ngày</th><th>Trạng thái</th><th className="text-right">Thao tác</th></>}>
      <tr><td><ProductName name="Đầm satin" sku="SP001" /></td><td>Đầm dự tiệc</td><td>3</td><td className="num">250.000₫</td><td><StatusChip tone="success">Đang cho thuê</StatusChip></td><td><RowActions /></td></tr>
      <tr><td><ProductName name="Áo dài lụa" sku="SP002" /></td><td>Áo dài</td><td>2</td><td className="num">180.000₫</td><td><StatusChip tone="success">Đang cho thuê</StatusChip></td><td><RowActions /></td></tr>
      <tr><td><ProductName name="Vest thanh lịch" sku="SP003" /></td><td>Vest</td><td>3</td><td className="num">300.000₫</td><td><StatusChip>Đang ẩn</StatusChip></td><td><RowActions /></td></tr>
    </DataTable>
    <TableFooter label="3 sản phẩm" />
  </>;
}

function ProductName({ name, sku }) {
  return <div className="flex items-center gap-2.5">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-line bg-beige text-[10px] text-ink-3">Ảnh</span>
    <div><p className="font-medium">{name}</p><p className="mt-0.5 text-[11px] text-ink-3">{sku}</p></div>
  </div>;
}

