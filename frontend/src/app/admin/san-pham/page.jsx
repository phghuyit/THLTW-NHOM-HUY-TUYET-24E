import SanPhamList from "@/components/admin/SanPhamList";

export default function SanPhamPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
      <div className="mt-4">
        <SanPhamList />
      </div>
    </div>
  );
}
