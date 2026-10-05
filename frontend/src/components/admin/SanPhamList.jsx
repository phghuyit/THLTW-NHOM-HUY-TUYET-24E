const products = [
  {
    id: 1,
    name: "Áo dài truyền thống lụa tơ tằm thêu hoa sen",
    category: "Áo dài truyền thống",
    brand: "Linh Bùi Haute Couture",
    thumbnail: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 350000,
    original_value: 2500000,
    is_featured: true,
  },
  {
    id: 2,
    name: "Áo dài cách tân gấm đỏ hoa văn quý phái",
    category: "Áo dài cách tân",
    brand: "Linh Bùi Haute Couture",
    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 280000,
    original_value: 1800000,
    is_featured: false,
  },
  {
    id: 3,
    name: "Đầm dạ hội đỏ Ruby xẻ tà đính pha lê",
    category: "Váy dự tiệc",
    brand: "Chung Thanh Phong Bridal",
    thumbnail: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 450000,
    original_value: 3600000,
    is_featured: true,
  },
  {
    id: 4,
    name: "Váy dạ hội đuôi cá ánh kim sa vàng Gold",
    category: "Váy dự tiệc",
    brand: "Elise Fashion",
    thumbnail: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 500000,
    original_value: 4200000,
    is_featured: false,
  },
  {
    id: 5,
    name: "Váy cưới công chúa ren Pháp hoàng gia",
    category: "Váy cưới",
    brand: "Juliette Bridal",
    thumbnail: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 1200000,
    original_value: 9500000,
    is_featured: true,
  },
  {
    id: 6,
    name: "Bộ vest nam Classic đen Tuxedo lịch lãm",
    category: "Vest nam",
    brand: "Adam Store",
    thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 400000,
    original_value: 3200000,
    is_featured: true,
  },
  {
    id: 7,
    name: "Bộ vest nam phong cách Hàn Quốc ghi xám sáng",
    category: "Vest nam",
    brand: "Adam Store",
    thumbnail: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 350000,
    original_value: 2800000,
    is_featured: false,
  },
  {
    id: 8,
    name: "Clutch cầm tay dạ tiệc đính ngọc trai quý phái",
    category: "Túi xách",
    brand: "Charles & Keith",
    thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    rental_price_per_day: 80000,
    original_value: 750000,
    is_featured: false,
  },
];

export default function SanPhamList() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="overflow-hidden rounded border border-gray-800 bg-gray-900">
          <div className="relative">
            <img src={product.thumbnail} alt={product.name} className="h-56 w-full object-cover" />
            {product.is_featured && (
              <span className="absolute left-2 top-2 rounded bg-yellow-400 px-2 py-1 text-xs font-semibold">
                Nổi bật
              </span>
            )}
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-400">
              {product.category} · {product.brand}
            </p>
            <h3 className="mt-1 h-12 overflow-hidden font-semibold">{product.name}</h3>
            <p className="mt-2 font-bold text-blue-400">
              {product.rental_price_per_day.toLocaleString("vi-VN")}đ / ngày
            </p>
            <p className="text-sm text-gray-400">
              Giá trị gốc: {product.original_value.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
