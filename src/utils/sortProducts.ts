import type { Product } from "../types/product.types";

export function sortProducts(products: Product[], sort: string) {
  if (!sort) return products;
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "rating-asc":
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case "name-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      return products;
  }
  return sorted;
}
