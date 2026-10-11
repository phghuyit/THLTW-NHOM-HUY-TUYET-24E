import api from "./api";

export async function getCategories(signal, page = 1, perPage = 12) {
  const response = await api.get("/admin/categories", { signal, params: { page, per_page: perPage } });
  return response.data;
}

export async function getCategoryParents(signal) {
  const response = await api.get("/admin/categories/parents", { signal });
  return response.data;
}

export async function createCategory(data) {
  const response = await api.post("/admin/categories", data);
  return response.data;
}

export async function getCategory(id, signal) {
  const response = await api.get(`/admin/categories/${id}`, { signal });
  return response.data;
}

export async function updateCategory(id, data) {
  data.set("_method", "PATCH");
  const response = await api.post(`/admin/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
}

export async function getTrashedCategories(signal, page = 1) {
  const response = await api.get("/admin/categories/trash", { signal, params: { page } });
  return response.data;
}

export async function restoreCategory(id) {
  const response = await api.patch(`/admin/categories/${id}/restore`);
  return response.data;
}

export async function forceDeleteCategory(id) {
  const response = await api.delete(`/admin/categories/${id}/force`);
  return response.data;
}
