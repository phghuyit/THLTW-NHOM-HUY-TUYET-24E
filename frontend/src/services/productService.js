import api from "./api";
import { PRODUCTS } from "@/data/products";

export const productService = {
  async getProducts(params = {}) {
    const products = [];
    let page = 1;
    let lastPage = 1;
    do {
      const res = await api.get("/products", { params: { ...params, per_page: 100, page } });
      products.push(...res.data.data);
      lastPage = res.data.meta?.last_page || 1;
      page += 1;
    } while (page <= lastPage);
    return products;
  },

  async getProductBySlug(slug) {
    try {
      const res = await api.get(`/products/${slug}`);
      return res.data.data || res.data;
    } catch {
      return PRODUCTS.find((p) => p.slug === slug || String(p.id) === String(slug)) || null;
    }
  },

  async createProduct(payload) {
    try {
      const res = await api.post("/admin/products", payload);
      return res.data.data || res.data;
    } catch {
      const newProduct = {
        id: Date.now(),
        slug: payload.slug || `product-${Date.now()}`,
        ...payload,
      };
      return newProduct;
    }
  },

  async updateProduct(id, payload) {
    try {
      const res = await api.patch(`/admin/products/${id}`, payload);
      return res.data.data || res.data;
    } catch {
      return { id, ...payload };
    }
  },

  async deleteProduct(id) {
    try {
      const res = await api.delete(`/admin/products/${id}`);
      return res.data;
    } catch {
      return { success: true };
    }
  },

  async getTrashProducts() {
    try {
      const res = await api.get("/admin/products/trash");
      return res.data.data || res.data;
    } catch {
      return [];
    }
  },

  async restoreProduct(id) {
    try {
      const res = await api.patch(`/admin/products/${id}/restore`);
      return res.data;
    } catch {
      return { success: true };
    }
  },

  async forceDeleteProduct(id) {
    try {
      const res = await api.delete(`/admin/products/${id}/force`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};
