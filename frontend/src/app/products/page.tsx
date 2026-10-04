import { getProducts } from "../lib/product";
import ProductCard from "../components/ProductCard";
import type { Product } from "@/types/product";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const pageNumber = typeof params.page === "string" ? Number(params.page) : 1;
  const page =
    Number.isSafeInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  const result = await getProducts(page);

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
      <p>Có {result.meta.total} sản phẩm</p>

      <div className="mt-6 grid grid-cols-3 gap-6">
        {result.data.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <nav
        aria-label="Phân trang sản phẩm"
        className="mt-8 flex items-center justify-center gap-4"
      >
        {result.meta.current_page > 1 && (
          <Link
            href={`/products?page=${result.meta.current_page - 1}`}
            className="border px-4 py-2"
          >
            Trang trước
          </Link>
        )}

        <span>
          Trang {result.meta.current_page} / {result.meta.last_page}
        </span>

        {result.meta.current_page < result.meta.last_page && (
          <Link
            href={`/products?page=${result.meta.current_page + 1}`}
            className="border px-4 py-2"
          >
            Trang sau
          </Link>
        )}
      </nav>
    </main>
  );
}
