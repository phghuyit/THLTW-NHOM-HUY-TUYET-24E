import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border p-4">
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
  );
}
