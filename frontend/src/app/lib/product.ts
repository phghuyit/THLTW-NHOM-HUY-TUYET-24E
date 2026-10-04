export async function getFeaturedProducts() {
  const response = await fetch(
    "http://127.0.0.1:8000/api/products?featured=1"
  );

  const result = await response.json();

  return result.data;
}