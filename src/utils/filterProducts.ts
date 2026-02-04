import type { Filters } from "../types/filter.types";
import type { Product } from "../types/product.types";

export function filterProducts(products: Product[], filters: Filters & { favoriteIds?: number[] }) {
  const {
    search,
    categories,
    brands,
    rating,
    stock,
    priceMin,
    priceMax,
    favoritesOnly,
    favoriteIds,
  } = filters;

  const searchValue = search?.toLowerCase().trim();

  return products.filter((product) => {
    if (searchValue) {
      const haystack = `${product.title} ${product.description}`.toLowerCase();
      if (!haystack.includes(searchValue)) return false;
    }

    if (categories?.length && !categories.includes(product.category)) return false;
    if (brands?.length && !brands.includes(product.brand)) return false;
    if (rating && product.rating < rating) return false;

    if (stock?.length) {
      const stockStatus =
        product.stock === 0
          ? "Out of Stock"
          : product.stock <= 20
            ? "Low Stock"
            : "In Stock";
      if (!stock.includes(stockStatus)) return false;
    }

    if (Number.isFinite(priceMin) && product.price < priceMin) return false;
    if (Number.isFinite(priceMax) && priceMax > 0 && product.price > priceMax) return false;
    if (favoritesOnly && !favoriteIds?.includes(product.id)) return false;

    return true;
  });
}
