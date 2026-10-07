"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { brandService } from "@/services/brandService";
import { ProductGrid } from "@/components/user/ProductGrid";
import { IconFilter, IconSearch } from "@/components/ui/Icons";
import { Skeleton } from "@/components/ui/Primitives";

function ProductsView() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
        brandService.getBrands(),
      ]);
      setProducts(prodRes);
      setCategories(catRes);
      setBrands(brandRes);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "all") {
          const matchCat =
            p.categorySlug === selectedCategory ||
            String(p.category_id) === String(selectedCategory) ||
            p.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase());
          if (!matchCat) return false;
        }

        if (selectedBrand !== "all") {
          const matchBrand =
            String(p.brand_id) === String(selectedBrand) ||
            p.brand?.name?.toLowerCase().includes(selectedBrand.toLowerCase()) ||
            p.brandLine?.toLowerCase().includes(selectedBrand.toLowerCase());
          if (!matchBrand) return false;
        }

        if (search.trim()) {
          const term = search.toLowerCase();
          const matchSearch =
            p.name?.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term) ||
            p.sku?.toLowerCase().includes(term);
          if (!matchSearch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.rental_price_per_day || a.pricePerDay || 0;
        const priceB = b.rental_price_per_day || b.pricePerDay || 0;
        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "featured") return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        return 0;
      });
  }, [products, selectedCategory, selectedBrand, search, sortBy]);

  return (
    <div className="shell py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink font-serif">Tất cả sản phẩm</h1>
        <p className="mt-1 text-sm text-ink-2">Bộ sưu tập trang phục cao cấp cho thuê theo ngày.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded border border-line bg-surface p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink mb-3">
              <IconFilter width={14} height={14} /> Bộ lọc
            </h2>

            <div className="mb-4">
              <label className="field-label">Tìm kiếm</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tên sản phẩm..."
                  className="field pl-8"
                />
                <IconSearch width={13} height={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3" />
              </div>
            </div>

            <div className="mb-4">
              <label className="field-label">Danh mục</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="field"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.slug || c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="field-label">Thương hiệu</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="field"
              >
                <option value="all">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.slug || b.id} value={b.slug || b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Sắp xếp</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="field"
              >
                <option value="default">Mặc định</option>
                <option value="featured">Nổi bật trước</option>
                <option value="price_asc">Giá thuê: Thấp đến Cao</option>
                <option value="price_desc">Giá thuê: Cao đến Thấp</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedBrand("all");
                setSearch("");
                setSortBy("default");
              }}
              className="btn btn-outline btn-sm btn-block mt-4"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between text-xs text-ink-2">
            <span>Tìm thấy {filteredProducts.length} sản phẩm</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </section>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
        </div>
      }
    >
      <ProductsView />
    </Suspense>
  );
}
