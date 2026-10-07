import api from "./api";
import { BRANDS } from "@/data/catalog";

let mockBrands = [...BRANDS];

export const brandService = {
  async getBrands() {
    try {
      const res = await api.get("/brands");
      const data = res.data.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return [...mockBrands];
    } catch {
      return [...mockBrands];
    }
  },

  async createBrand(payload) {
    try {
      const res = await api.post("/admin/brands", payload);
      return res.data.data || res.data;
    } catch {
      const item = {
        id: Date.now(),
        slug: payload.slug || `brand-${Date.now()}`,
        ...payload,
      };
      mockBrands.unshift(item);
      return item;
    }
  },

  async updateBrand(id, payload) {
    try {
      const res = await api.patch(`/admin/brands/${id}`, payload);
      return res.data.data || res.data;
    } catch {
      mockBrands = mockBrands.map((b) => (b.id === id || String(b.id) === String(id) ? { ...b, ...payload } : b));
      return mockBrands.find((b) => b.id === id || String(b.id) === String(id));
    }
  },

  async deleteBrand(id) {
    try {
      const res = await api.delete(`/admin/brands/${id}`);
      return res.data;
    } catch {
      mockBrands = mockBrands.filter((b) => b.id !== id && String(b.id) !== String(id));
      return { success: true };
    }
  },
};
