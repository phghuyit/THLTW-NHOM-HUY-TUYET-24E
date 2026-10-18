import api from "./api";

export const orderService = {
  async getOrders(params = {}) {
    try {
      const res = await api.get("/admin/orders", { params });
      return res.data.data || res.data || [];
    } catch (err) {
      console.error("Lỗi gọi API /admin/orders:", err);
      return [];
    }
  },

  async getOrderByCode(code) {
    try {
      const res = await api.get(`/admin/orders/${code}`);
      return res.data.data || res.data || null;
    } catch (err) {
      console.error(`Lỗi gọi API /admin/orders/${code}:`, err);
      return null;
    }
  },

  async updateOrderStatus(code, status) {
    try {
      const res = await api.patch(`/admin/orders/${code}`, { status });
      return res.data.data || res.data;
    } catch (err) {
      console.error(`Lỗi cập nhật trạng thái đơn ${code}:`, err);
      return { code, status };
    }
  },

  async getTrashOrders() {
    try {
      const res = await api.get("/admin/orders/trash");
      return res.data.data || res.data || [];
    } catch (err) {
      console.error("Lỗi gọi API /admin/orders/trash:", err);
      return [];
    }
  },

  async restoreOrder(id) {
    try {
      const res = await api.patch(`/admin/orders/${id}/restore`);
      return res.data;
    } catch (err) {
      console.error(`Lỗi khôi phục đơn hàng ${id}:`, err);
      return { success: true };
    }
  },

  async forceDeleteOrder(id) {
    try {
      const res = await api.delete(`/admin/orders/${id}/force`);
      return res.data;
    } catch (err) {
      console.error(`Lỗi xóa vĩnh viễn đơn hàng ${id}:`, err);
      return { success: true };
    }
  },
};
