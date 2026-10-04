export interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  rental_price_per_day: string | number;
  sale_price_per_day: string | number | null;
  is_featured: boolean;
}

export interface ProductListResponse {
  data: Product[];
}
