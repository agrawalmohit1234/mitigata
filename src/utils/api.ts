import type { Product } from "../types/product.types";

const CACHE = new Map<string, { products: Product[] }>();

export async function fetchProducts(limit = 100): Promise<{ products: Product[] }> {
  const url = `https://dummyjson.com/products?limit=${limit}`;
  if (CACHE.has(url)) {
    return CACHE.get(url)!;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = (await response.json()) as { products: Product[] };
  CACHE.set(url, data);
  return data;
}

export function clearApiCache() {
  CACHE.clear();
}
