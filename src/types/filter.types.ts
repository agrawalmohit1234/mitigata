export interface Filters {
  search: string;
  categories: string[];
  priceMin: number;
  priceMax: number;
  startDate: string;
  endDate: string;
  rating: number;
  stock: string[];
  brands: string[];
  sort: string;
  view: "grid" | "list";
  favoritesOnly: boolean;
}

export interface ActiveFilterChip {
  key: string;
  value?: string;
  label: string;
}
