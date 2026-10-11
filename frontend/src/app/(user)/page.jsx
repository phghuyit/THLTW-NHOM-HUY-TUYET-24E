import ProductCard from "@/components/product/ProductCard";

export default function Home() {
  return <main className="flex-1 p-6">
    <h1 className="text-2xl font-bold">Sản phẩm nổi bật</h1>
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <ProductCard name="Áo dài hoa sen" price="350.000" />
      <ProductCard name="Đầm dự tiệc" price="400.000" />
      <ProductCard name="Vest nam" price="500.000" />
    </div>
    <section className="mt-12">
      <h2 className="text-2xl font-bold">Sản phẩm khuyến mãi</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <ProductCard name="Áo dài cách tân" price="250.000" oldPrice="300.000" />
        <ProductCard name="Váy hoa" price="280.000" oldPrice="350.000" />
        <ProductCard name="Túi xách" price="100.000" oldPrice="150.000" />
      </div>
    </section>
  </main>;
}

