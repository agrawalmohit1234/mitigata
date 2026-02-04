import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product.types";
import { fetchProducts } from "../utils/api";

export function useProducts(limit = 100) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(limit);
      if (signal?.aborted) return;
      setProducts(data.products || []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(err as Error);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [limit]);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    retry: () => loadProducts(),
  };
}
