import React, { useMemo, useState } from "react";
import type { Filters } from "../../types/filter.types";
import { CategoryFilter } from "./CategoryFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { RatingFilter } from "./RatingFilter";
import { StockFilter } from "./StockFilter";
import { BrandFilter } from "./BrandFilter";

interface FilterPanelProps {
  categories: string[];
  brands: string[];
  counts: {
    categories: Record<string, number>;
    brands: Record<string, number>;
  };
  filters: Filters;
  toggleMulti: (key: "categories" | "stock" | "brands", value: string) => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  maxPrice: number;
  activeCount: number;
  onClear: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterPanel({
  categories,
  brands,
  counts,
  filters,
  toggleMulti,
  setFilter,
  maxPrice,
  activeCount,
  onClear,
  isOpen,
  onClose,
}: FilterPanelProps) {
  const [brandSearch, setBrandSearch] = useState("");

  const filteredBrands = useMemo(() => {
    const term = brandSearch.toLowerCase().trim();
    if (!term) return brands;
    return brands.filter((brand) => brand.toLowerCase().includes(term));
  }, [brands, brandSearch]);

  return (
    <aside className={`filter-panel ${isOpen ? "open" : ""}`}>
      <div className="filter-header">
        <h2>Filters</h2>
        <span className="filter-count">{activeCount} active filters</span>
        {onClose && (
          <button
            className="icon-button close-filter"
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
        )}
      </div>

      <CategoryFilter
        categories={categories}
        selected={filters.categories}
        counts={counts.categories}
        toggle={toggleMulti}
      />

      <PriceRangeFilter
        min={0}
        max={maxPrice}
        valueMin={filters.priceMin}
        valueMax={filters.priceMax}
        onChange={(min, max) => {
          setFilter("priceMin", min);
          setFilter("priceMax", max);
        }}
      />

      <DateRangeFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChange={(startDate, endDate) => {
          setFilter("startDate", startDate);
          setFilter("endDate", endDate);
        }}
      />

      <RatingFilter
        value={filters.rating}
        onChange={(value) => setFilter("rating", value)}
      />

      <StockFilter selected={filters.stock} toggle={toggleMulti} />

      <section className="filter-section">
        <h3>Favorites</h3>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={() => setFilter("favoritesOnly", !filters.favoritesOnly)}
          />
          <span>Show Favorites Only</span>
        </label>
      </section>

      <BrandFilter
        brands={filteredBrands}
        selected={filters.brands}
        counts={counts.brands}
        toggle={toggleMulti}
        searchValue={brandSearch}
        onSearchChange={setBrandSearch}
      />

      <button className="btn ghost" onClick={onClear}>
        Clear All Filters
      </button>
    </aside>
  );
}
