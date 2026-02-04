interface Review {
  comment: string;
  rating: number;
  date: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  stock: number;
  thumbnail: string;
  images?: string[];
  reviews: Review[];
  discountPercentage?: number;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
