import ProductCard from "@/components/product/ProductCard";

export default function ProductsPage() {
  return <main className="flex-1 p-6">
    <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
    <p>3 sản phẩm minh họa giao diện</p>
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <ProductCard name="Áo dài hoa sen" price="350.000" />
      <ProductCard name="Đầm dự tiệc" price="400.000" />
      <ProductCard name="Vest nam" price="500.000" />
    </div>
    <div className="mt-8 text-center">Trang 1 / 1</div>
  </main>;
}

