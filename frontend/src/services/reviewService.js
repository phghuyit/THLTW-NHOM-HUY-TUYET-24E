import api from "./api";

export const reviewService = {
  async getReviews(params = {}) {
    try {
      const res = await api.get("/reviews", { params });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw)) {
        return raw;
      }
      return [];
    } catch {
      return [];
    }
  },

  async createReview(payload) {
    const res = await api.post("/reviews", payload);
    return res.data?.data || res.data;
  },

  async getAdminReviews(params = {}) {
    try {
      const res = await api.get("/admin/reviews", { params });
      const raw = res.data?.data || res.data;
      if (Array.isArray(raw)) {
        return raw;
      }
      return [];
    } catch {
      return [];
    }
  },

  async updateReviewStatus(id, status) {
    const res = await api.put(`/admin/reviews/${id}/status`, { status });
    return res.data;
  },
};
