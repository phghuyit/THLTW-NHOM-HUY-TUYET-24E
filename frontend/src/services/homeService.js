import api from "./api";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/catalog";

export const homeService = {
  async getBanners() {
    try {
      const res = await api.get("/banners");
      return res.data.data || res.data;
    } catch {
      return [];
    }
  },

  async getNewArrivals() {
    try {
      const res = await api.get("/products");
      const list = res.data.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        const filtered = list.filter((p) => p.isNew || p.is_new);
        return filtered.length > 0 ? filtered.slice(0, 4) : list.slice(0, 4);
      }
      return PRODUCTS.filter((p) => p.isNew).slice(0, 4);
    } catch {
      return PRODUCTS.filter((p) => p.isNew).slice(0, 4);
    }
  },

  async getFeaturedProducts() {
    try {
      const res = await api.get("/products");
      const list = res.data.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.filter((p) => p.is_featured);
      }
      return PRODUCTS.filter((p) => p.is_featured);
    } catch {
      return PRODUCTS.filter((p) => p.is_featured);
    }
  },

  async getTrendingProducts() {
    try {
      const res = await api.get("/products");
      const list = res.data.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.slice(0, 4);
      }
      return [...PRODUCTS].sort((a, b) => b.rentalCount - a.rentalCount).slice(0, 4);
    } catch {
      return [...PRODUCTS].sort((a, b) => b.rentalCount - a.rentalCount).slice(0, 4);
    }
  },

  async getCategories() {
    try {
      const res = await api.get("/categories");
      const list = res.data.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  },
};
