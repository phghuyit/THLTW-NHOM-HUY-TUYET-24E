import "./globals.css"
import { getFeaturedProducts } from "./lib/product";
import type { Product } from "@/types/product";
import Image from "next/image";

export default async function Home() {
    const products = await getFeaturedProducts();
  return (
      <main className="flex-1 p-6">
      <h1>Sản phẩm nổi bật</h1>
      <p>Có {products.length} sản phẩm nổi bật</p>
      <div className="mt-6 grid grid-cols-3 gap-6">
  {products.map((product: Product) => (
    <div key={product.id} className="border p-4">
      {product.thumbnail && (
        <Image
          src={product.thumbnail}
          alt={product.name}
          width={400}
          height={500}
          unoptimized
          className="mb-4 h-80 w-full object-cover"
        />
      )}
      <h2>{product.name}</h2>
      <p>Giá thuê mỗi ngày: {product.rental_price_per_day} đồng</p>
    </div>
  ))}
</div>
    </main>
  );
}
