import api from "./api";
import { CATEGORIES } from "@/data/catalog";

let mockCategories = [...CATEGORIES];

export const categoryService = {
  async getCategories() {
    const categories = [];
    let page = 1;
    let lastPage = 1;
    do {
      const res = await api.get("/categories", { params: { per_page: 100, page } });
      categories.push(...res.data.data);
      lastPage = res.data.meta?.last_page || 1;
      page += 1;
    } while (page <= lastPage);
    return categories;
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

  async getTrashCategories() {
    try {
      const res = await api.get("/admin/categories/trash");
      return res.data.data || res.data;
    } catch {
      return [];
    }
  },

  async restoreCategory(id) {
    try {
      const res = await api.patch(`/admin/categories/${id}/restore`);
      return res.data;
    } catch {
      return { success: true };
    }
  },

  async forceDeleteCategory(id) {
    try {
      const res = await api.delete(`/admin/categories/${id}/force`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};
