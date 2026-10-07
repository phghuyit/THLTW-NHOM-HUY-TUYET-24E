import api from "./api";
import { ORDERS } from "@/data/operations";

let mockOrders = [...ORDERS];

export const orderService = {
  async getOrders(params = {}) {
    try {
      const res = await api.get("/admin/orders", { params });
      return res.data.data || res.data;
    } catch {
      return [...mockOrders];
    }
  },

  async getOrderByCode(code) {
    try {
      const res = await api.get(`/admin/orders/${code}`);
      return res.data.data || res.data;
    } catch {
      return mockOrders.find((o) => o.code === code) || null;
    }
  },

  async updateOrderStatus(code, status) {
    try {
      const res = await api.patch(`/admin/orders/${code}`, { status });
      return res.data.data || res.data;
    } catch {
      mockOrders = mockOrders.map((o) => (o.code === code ? { ...o, status } : o));
      return mockOrders.find((o) => o.code === code);
    }
  },
};
