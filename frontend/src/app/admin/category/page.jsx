import { PageHeader, Toolbar } from "@/components/admin/ui/PageParts";
import { IconPlus } from "@/components/admin/ui/Icons";
import { DataTable, RowActions, TableFooter } from "@/components/admin/ui/DataTable";

export default function CategoryPage() {
  return <>
    <PageHeader title="Danh mục" description="Tổ chức danh mục để khách hàng dễ tìm và lựa chọn trang phục."
      breadcrumb={[{ label: "Catalog" }, { label: "Danh mục" }]}
      actions={<button disabled type="button" className="btn btn-sm gap-1.5"><IconPlus width={14} height={14} />Thêm danh mục</button>} />
    <Toolbar searchPlaceholder="Tìm tên danh mục hoặc slug..." resultLabel="3 danh mục" />
    <DataTable label="Danh sách danh mục" headings={<><th>ID</th><th>Danh mục</th><th>Slug</th><th>Mô tả</th><th>Sản phẩm</th><th className="text-right">Thao tác</th></>}>
      <tr><td>1</td><td className="font-medium">Đầm dự tiệc</td><td>dam-du-tiec</td><td>Trang phục dành cho các buổi tiệc.</td><td>1</td><td><RowActions /></td></tr>
      <tr><td>2</td><td className="font-medium">Áo dài</td><td>ao-dai</td><td>Thiết kế truyền thống và hiện đại.</td><td>1</td><td><RowActions /></td></tr>
      <tr><td>3</td><td className="font-medium">Vest</td><td>vest</td><td>Trang phục lịch sự cho sự kiện.</td><td>1</td><td><RowActions /></td></tr>
    </DataTable>
    <TableFooter label="3 danh mục" />
  </>;
}

