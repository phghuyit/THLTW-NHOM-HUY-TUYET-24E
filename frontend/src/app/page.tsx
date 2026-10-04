import "./globals.css"
import { getFeaturedProducts, getSaleProducts } from "./lib/product";
import type { Product } from "@/types/product";
import ProductCard from "./components/ProductCard";

export default async function Home() {
  const products = await getFeaturedProducts();
  const saleProducts = await getSaleProducts();
  return (
    <main className="flex-1 p-6">
      <h1>Sản phẩm nổi bật</h1>
      <p>Có {products.length} sản phẩm nổi bật</p>
      <div className="mt-6 grid grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Sản phẩm khuyến mãi</h2>

        <div className="mt-6 grid grid-cols-3 gap-6">
          {saleProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
