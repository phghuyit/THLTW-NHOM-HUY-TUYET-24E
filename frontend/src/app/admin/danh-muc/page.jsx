import DanhMucList from "@/components/admin/DanhMucList";

export default function DanhMucPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
      <div className="mt-4">
        <DanhMucList />
      </div>
    </div>
  );
}
