const categories = [
  { id: 1, name: "Áo dài", slug: "ao-dai", parent_id: null, description: "Các mẫu áo dài truyền thống và hiện đại.", status: "active" },
  { id: 2, name: "Váy đầm", slug: "vay-dam", parent_id: null, description: "Váy đầm dành cho dự tiệc và sự kiện.", status: "active" },
  { id: 3, name: "Trang phục nam", slug: "trang-phuc-nam", parent_id: null, description: "Trang phục nam lịch sự cho nhiều dịp.", status: "active" },
  { id: 4, name: "Phụ kiện", slug: "phu-kien", parent_id: null, description: "Phụ kiện phối cùng trang phục.", status: "active" },
  { id: 5, name: "Áo dài truyền thống", slug: "ao-dai-truyen-thong", parent_id: 1, description: "Danh mục Áo dài truyền thống cho thuê.", status: "active" },
  { id: 6, name: "Áo dài cách tân", slug: "ao-dai-cach-tan", parent_id: 1, description: "Danh mục Áo dài cách tân cho thuê.", status: "active" },
  { id: 7, name: "Váy dự tiệc", slug: "vay-du-tiec", parent_id: 2, description: "Danh mục Váy dự tiệc cho thuê.", status: "active" },
  { id: 8, name: "Váy cưới", slug: "vay-cuoi", parent_id: 2, description: "Danh mục Váy cưới cho thuê.", status: "active" },
  { id: 9, name: "Vest nam", slug: "vest-nam", parent_id: 3, description: "Danh mục Vest nam cho thuê.", status: "active" },
  { id: 10, name: "Túi xách", slug: "tui-xach", parent_id: 4, description: "Danh mục Túi xách cho thuê.", status: "active" },
];

export default function DanhMucList() {
  const getParentName = (parentId) => {
    const parent = categories.find((c) => c.id === parentId);
    return parent ? parent.name : "—";
  };

  return (
    <div className="overflow-hidden rounded border border-gray-800 bg-gray-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Tên danh mục</th>
            <th className="p-3">Slug</th>
            <th className="p-3">Danh mục cha</th>
            <th className="p-3">Mô tả</th>
            <th className="p-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t border-gray-800">
              <td className="p-3">{category.id}</td>
              <td className="p-3 font-semibold">{category.name}</td>
              <td className="p-3 text-gray-400">{category.slug}</td>
              <td className="p-3">{getParentName(category.parent_id)}</td>
              <td className="p-3">{category.description}</td>
              <td className="p-3">
                <span className="rounded bg-green-900 px-2 py-1 text-green-300">{category.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
