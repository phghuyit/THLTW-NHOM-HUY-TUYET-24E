import api from "./api";
import { PRODUCTS } from "@/data/products";

export const productService = {
  async getProducts(params = {}) {
    try {
      const res = await api.get("/products", { params });
      const data = res.data.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
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
};
