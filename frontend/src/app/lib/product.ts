export async function getFeaturedProducts() {
  const response = await fetch(
    `${process.env.API_BASE_URL}/products?featured=1`
  );

  const result = await response.json();

  return result.data;
}

export async function getSaleProducts() {
  const response = await fetch(
    `${process.env.API_BASE_URL}/products?sale=1`
  );

  const result = await response.json();

  return result.data;
}

export async function getProducts(page: number = 1) {
  const response = await fetch(
    `${process.env.API_BASE_URL}/products?page=${page}`
  );

  const result = await response.json();

  return result;
}
