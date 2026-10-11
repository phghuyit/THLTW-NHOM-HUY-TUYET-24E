import api from "./api";

export async function getProducts(signal, page = 1, perPage = 12) {
  const response = await api.get("/admin/products", { signal, params: { page, per_page: perPage } });
  return response.data;
}

export async function getProductOptions(signal) {
  const response = await api.get("/admin/products/options", { signal });
  return response.data;
}

export async function createProduct(data) {
  const response = await api.post("/admin/products", data);
  return response.data;
}

export async function getProduct(id, signal) {
  const response = await api.get(`/admin/products/${id}`, { signal });
  return response.data;
}

export async function updateProduct(id, data) {
  data.set("_method", "PATCH");
  const response = await api.post(`/admin/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
}

export async function getTrashedProducts(signal, page = 1) {
  const response = await api.get("/admin/products/trash", { signal, params: { page } });
  return response.data;
}

export async function restoreProduct(id) {
  const response = await api.patch(`/admin/products/${id}/restore`);
  return response.data;
}

export async function forceDeleteProduct(id) {
  const response = await api.delete(`/admin/products/${id}/force`);
  return response.data;
}
