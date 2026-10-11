import Image from "next/image";

// Nội dung minh họa được truyền trực tiếp bằng chữ trong JSX của trang.
export default function ProductCard({ name, price, oldPrice }) {
  return <div className="border p-4">
    <Image src="/product-placeholder.svg" alt={name} width={400} height={500} className="mb-4 h-80 w-full object-cover" />
    <h2>{name}</h2>
    {oldPrice && <p className="text-gray-500 line-through">{oldPrice} đồng/ngày</p>}
    <p className={oldPrice ? "font-bold text-red-600" : ""}>{price} đồng/ngày</p>
  </div>;
}

