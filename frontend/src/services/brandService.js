import api from "./api";

export async function getBrands(signal, page = 1, perPage = 12) {
  const response = await api.get("/admin/brands", { signal, params: { page, per_page: perPage } });
  return response.data;
}

export async function createBrand(data) {
  const response = await api.post("/admin/brands", data);
  return response.data;
}

export async function getBrand(id, signal) {
  const response = await api.get(`/admin/brands/${id}`, { signal });
  return response.data;
}

export async function updateBrand(id, data) {
  data.set("_method", "PATCH");
  const response = await api.post(`/admin/brands/${id}`, data);
  return response.data;
}

export async function deleteBrand(id) {
  const response = await api.delete(`/admin/brands/${id}`);
  return response.data;
}

export async function getTrashedBrands(signal, page = 1) {
  const response = await api.get("/admin/brands/trash", { signal, params: { page } });
  return response.data;
}

export async function restoreBrand(id) {
  const response = await api.patch(`/admin/brands/${id}/restore`);
  return response.data;
}

export async function forceDeleteBrand(id) {
  const response = await api.delete(`/admin/brands/${id}/force`);
  return response.data;
}
