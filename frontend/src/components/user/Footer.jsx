export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-8 py-12 text-gray-800">
      <div className="flex flex-wrap gap-10">
        <div className="flex-1 min-w-48">
          <h2 className="mb-4 text-2xl font-bold">H & T Shop</h2>
          <p className="mb-4 text-gray-500">Thời trang dành cho bạn</p>
          <p className="mb-3">Địa chỉ: Truong Cao dang Cong thuong TP.HCM</p>
          <p className="mb-3">Hotline: 0909090909</p>
          <p className="mb-3">Email: h&t@gmail.com</p>
          <p>Giờ mở cửa: 9:00 - 23:00</p>
        </div>

        <div className="flex-1 min-w-48">
          <h2 className="mb-6 font-bold text-gray-500">MUA SẮM</h2>
          <p className="mb-4">Toàn bộ bộ sưu tập</p>
          <p className="mb-4">Mới về</p>
          <p className="mb-4">Sản phẩm nổi bật</p>
          <p className="mb-4">Đầm & Váy</p>
          <p>Phụ kiện</p>
        </div>

        <div className="flex-1 min-w-48">
          <h2 className="mb-6 font-bold text-gray-500">HỖ TRỢ</h2>
          <p className="mb-4">Hướng dẫn mua hàng</p>
          <p className="mb-4">Chính sách đổi trả</p>
          <p className="mb-4">Câu hỏi thường gặp</p>
          <p>Bảng size & gợi ý size</p>
        </div>

        <div className="flex-1 min-w-48">
          <h2 className="mb-6 font-bold text-gray-500">TÀI KHOẢN</h2>
          <p className="mb-4">Thông tin tài khoản</p>
          <p>Yêu thích</p>
        </div>
      </div>
    </footer>
  );
}
