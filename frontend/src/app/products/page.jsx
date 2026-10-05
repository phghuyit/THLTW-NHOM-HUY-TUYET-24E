import ProductCard from "../components/ProductCard";
import { products } from "@/data/product";

export default function ProductsPage() {
  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
      <p>Có {products.length} sản phẩm</p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 text-center">Trang 1 / 1</div>
    </main>
  );
}
