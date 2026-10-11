import Link from "next/link";
import { PageHeader, Section, StatCard } from "@/components/admin/ui/PageParts";
import { IconArrowRight, IconBox, IconStore, IconTag } from "@/components/admin/ui/Icons";

export default function DashboardPage() {
  return <>
    <PageHeader title="Bảng điều hành" description="Tổng quan catalog. Các con số đang là chữ minh họa giao diện."
      actions={<Link href="/admin/brand" className="btn btn-sm">Quản lý thương hiệu<IconArrowRight width={14} height={14} /></Link>} />
    <div className="mb-6 grid gap-2.5 @lg:grid-cols-3">
      <StatCard label="Thương hiệu" value="3" sub="Thông tin thương hiệu" icon={<IconStore width={16} height={16} />} href="/admin/brand" />
      <StatCard label="Sản phẩm" value="3" sub="Trang phục và phụ kiện cho thuê" icon={<IconTag width={16} height={16} />} href="/admin/product" />
      <StatCard label="Danh mục" value="3" sub="Nhóm sản phẩm trong catalog" icon={<IconBox width={16} height={16} />} href="/admin/category" />
    </div>
    <Section title="Catalog" description="Truy cập nhanh các trang quản lý.">
      <div className="card divide-y divide-line">
        <CatalogLink href="/admin/brand" title="Thương hiệu" description="Tên, logo, mô tả và trạng thái hiển thị" />
        <CatalogLink href="/admin/product" title="Sản phẩm" description="Thông tin sản phẩm, biến thể và giá thuê" />
        <CatalogLink href="/admin/category" title="Danh mục" description="Phân nhóm sản phẩm và mô tả danh mục" />
      </div>
    </Section>
  </>;
}

function CatalogLink({ href, title, description }) {
  return <Link href={href} className="flex items-center gap-3 px-4 py-4 hover:bg-surface-2">
    <span className="flex-1"><span className="block text-[13px] font-medium">{title}</span><span className="mt-0.5 block text-[12px] text-ink-2">{description}</span></span>
    <span className="text-[11px] text-ink-3">Giao diện tĩnh</span><IconArrowRight width={15} height={15} />
  </Link>;
}
