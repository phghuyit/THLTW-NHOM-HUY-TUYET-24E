export interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  rental_price_per_day: string | number;
  is_featured: boolean;
}

export interface ProductListResponse {
  data: Product[];
}