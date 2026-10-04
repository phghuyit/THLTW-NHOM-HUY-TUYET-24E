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
      {product.sale_price_per_day != null &&
      Number(product.sale_price_per_day) > 0 &&
      Number(product.sale_price_per_day) < Number(product.rental_price_per_day) ? (
        <div>
          <p className="text-gray-500 line-through">
            {product.rental_price_per_day} đồng/ngày
          </p>
          <p className="font-bold text-red-600">
            {product.sale_price_per_day} đồng/ngày
          </p>
        </div>
      ) : (
        <p>{product.rental_price_per_day} đồng/ngày</p>
      )}
    </div>
  );
}
