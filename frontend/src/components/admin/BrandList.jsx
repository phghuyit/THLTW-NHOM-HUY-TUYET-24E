const brands = [
  {
    id: 1,
    name: "Elise Fashion",
    slug: "elise-fashion",
    logo: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",
    description: "Thương hiệu thời trang thiết kế hàng đầu với các dòng đầm dạ hội, trang phục sự kiện cao cấp.",
    status: "active",
  },
  {
    id: 2,
    name: "Chung Thanh Phong Bridal",
    slug: "chung-thanh-phong-bridal",
    logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
    description: "Thương hiệu váy cưới và đầm dạ tiệc cao cấp của NTK Chung Thanh Phong, tôn vinh nét quyến rũ và lộng lẫy.",
    status: "active",
  },
  {
    id: 3,
    name: "Adam Store",
    slug: "adam-store",
    logo: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80",
    description: "Thương hiệu âu phục và veston nam may sẵn hàng đầu Việt Nam, phong cách lịch lãm và chuẩn phom dáng quý ông.",
    status: "active",
  },
  {
    id: 4,
    name: "Linh Bùi Haute Couture",
    slug: "linh-bui-haute-couture",
    logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80",
    description: "Chuyên các dòng áo dài lụa tơ tằm thêu tay thủ công tinh xảo, áo dài cưới truyền thống và cách tân quý phái.",
    status: "active",
  },
  {
    id: 5,
    name: "Juliette Bridal",
    slug: "juliette-bridal",
    logo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Thương hiệu váy cưới công chúa hoàng gia nhập khẩu với chất liệu ren Pháp và cườm đá lấp lánh.",
    status: "active",
  },
  {
    id: 6,
    name: "Charles & Keith",
    slug: "charles-keith",
    logo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
    description: "Thương hiệu phụ kiện túi xách, clutch dạ tiệc thời thượng được phái đẹp yêu thích.",
    status: "active",
  },
];

export default function BrandList() {
  return (
    <div className="overflow-hidden rounded border border-gray-800 bg-gray-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Logo</th>
            <th className="p-3">Tên brand</th>
            <th className="p-3">Slug</th>
            <th className="p-3">Mô tả</th>
            <th className="p-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} className="border-t border-gray-800">
              <td className="p-3">{brand.id}</td>
              <td className="p-3">
                <img src={brand.logo} alt={brand.name} className="h-12 w-12 rounded object-cover" />
              </td>
              <td className="p-3 font-semibold">{brand.name}</td>
              <td className="p-3 text-gray-400">{brand.slug}</td>
              <td className="p-3">{brand.description}</td>
              <td className="p-3">
                <span className="rounded bg-green-900 px-2 py-1 text-green-300">{brand.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
