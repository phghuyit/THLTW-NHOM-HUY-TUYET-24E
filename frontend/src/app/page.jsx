import ProductCard from "./components/ProductCard";
import { products } from "@/data/product";

export default function Home() {
  const featuredProducts = products.filter((product) => product.is_featured);
  const saleProducts = products.filter((product) => product.sale_price_per_day !== null);

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold">Sản phẩm nổi bật</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Sản phẩm khuyến mãi</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
