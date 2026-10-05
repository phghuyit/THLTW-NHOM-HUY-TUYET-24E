import BrandList from "@/components/BrandList";

export default function BrandPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý Brand</h1>
      <div className="mt-4">
        <BrandList />
      </div>
    </div>
  );
}
