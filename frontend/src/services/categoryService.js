import api from "./api";
import { CATEGORIES } from "@/data/catalog";

let mockCategories = [...CATEGORIES];

export const categoryService = {
  async getCategories() {
    try {
      const res = await api.get("/categories");
      const data = res.data.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return [...mockCategories];
    } catch {
      return [...mockCategories];
    }
  },

  async createCategory(payload) {
    try {
      const res = await api.post("/admin/categories", payload);
      return res.data.data || res.data;
    } catch {
      const item = {
        id: Date.now(),
        slug: payload.slug || `cat-${Date.now()}`,
        ...payload,
      };
      mockCategories.unshift(item);
      return item;
    }
  },

  async updateCategory(id, payload) {
    try {
      const res = await api.patch(`/admin/categories/${id}`, payload);
      return res.data.data || res.data;
    } catch {
      mockCategories = mockCategories.map((c) => (c.id === id || String(c.id) === String(id) ? { ...c, ...payload } : c));
      return mockCategories.find((c) => c.id === id || String(c.id) === String(id));
    }
  },

  async deleteCategory(id) {
    try {
      const res = await api.delete(`/admin/categories/${id}`);
      return res.data;
    } catch {
      mockCategories = mockCategories.filter((c) => c.id !== id && String(c.id) !== String(id));
      return { success: true };
    }
  },
};
