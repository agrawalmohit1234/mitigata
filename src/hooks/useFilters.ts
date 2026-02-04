import { useCallback, useEffect, useMemo, useState } from "react";
import type { ActiveFilterChip, Filters } from "../types/filter.types";
import { useDebounce } from "./useDebounce";

const DEFAULT_FILTERS: Filters = {
  search: "",
  categories: [],
  priceMin: 0,
  priceMax: 0,
  rating: 0,
  stock: [],
  brands: [],
  sort: "",
  view: "grid",
  favoritesOnly: false,
};

const ARRAY_KEYS = ["categories", "stock", "brands"] as const;

type ArrayKey = (typeof ARRAY_KEYS)[number];

const toArray = (value: string | null) => {
  if (!value) return [] as string[];
  return value.split(",").filter(Boolean);
};

const parseNumber = (value: string | null, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export function useFilters(maxPrice: number) {
  const [filters, setFilters] = useState<Filters>(() => {
    const params = new URLSearchParams(window.location.search);
    const initial: Filters = { ...DEFAULT_FILTERS };

    initial.search = params.get("q") || "";
    initial.sort = params.get("sort") || "";
    initial.view = (params.get("view") as Filters["view"]) || "grid";
    initial.categories = toArray(params.get("categories"));
    initial.brands = toArray(params.get("brands"));
    initial.stock = toArray(params.get("stock"));
    initial.rating = parseNumber(params.get("rating"), 0);
    initial.priceMin = parseNumber(params.get("min"), 0);
    initial.priceMax = parseNumber(params.get("max"), 0);
    initial.favoritesOnly = params.get("fav") === "1";

    return initial;
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    if (maxPrice > 0 && filters.priceMax === 0) {
      setFilters((prev) => ({ ...prev, priceMax: maxPrice }));
    }
  }, [maxPrice, filters.priceMax]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("q", filters.search);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.view && filters.view !== "grid") params.set("view", filters.view);
    if (filters.rating) params.set("rating", String(filters.rating));
    if (filters.priceMin) params.set("min", String(filters.priceMin));
    if (filters.priceMax && filters.priceMax !== maxPrice) params.set("max", String(filters.priceMax));
    if (filters.favoritesOnly) params.set("fav", "1");

    ARRAY_KEYS.forEach((key) => {
      if (filters[key]?.length) {
        params.set(key, filters[key].join(","));
      }
    });

    const url = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [filters, maxPrice]);

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMulti = useCallback((key: ArrayKey, value: string) => {
    setFilters((prev) => {
      const set = new Set(prev[key]);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      return { ...prev, [key]: Array.from(set) };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      priceMax: maxPrice || prev.priceMax || 0,
    }));
  }, [maxPrice]);

  const activeFilters = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    if (filters.search) chips.push({ key: "search", label: `Search: ${filters.search}` });
    filters.categories.forEach((value) => chips.push({ key: "categories", value, label: value }));
    filters.brands.forEach((value) => chips.push({ key: "brands", value, label: value }));
    filters.stock.forEach((value) => chips.push({ key: "stock", value, label: value }));
    if (filters.rating) chips.push({ key: "rating", label: `${filters.rating}+ stars` });
    if (filters.favoritesOnly) chips.push({ key: "favorites", label: "Favorites" });
    if (filters.priceMin > 0 || (maxPrice && filters.priceMax < maxPrice)) {
      chips.push({
        key: "price",
        label: `$${filters.priceMin} - $${filters.priceMax}`,
      });
    }
    return chips;
  }, [filters, maxPrice]);

  return {
    filters,
    setFilter,
    toggleMulti,
    clearFilters,
    debouncedSearch,
    activeFilters,
  };
}
