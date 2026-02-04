import React from "react";
import type { Product } from "../../types/product.types";
import { ProductCard } from "./ProductCard";
import { ResultsHeader } from "./ResultsHeader";
import type { ActiveFilterChip } from "../../types/filter.types";

interface ProductGridProps {
  products: Product[];
  total: number;
  view: "grid" | "list";
  sort: string;
  onSortChange: (value: string) => void;
  onSelect: (product: Product) => void;
  onCompareToggle: (id: number) => void;
  compareIds: number[];
  searchTerm: string;
  loading: boolean;
  activeFilters: ActiveFilterChip[];
  onRemoveFilter: (filter: ActiveFilterChip) => void;
  page: number;
  pageSize: number;
  totalFiltered: number;
  onPageChange: (page: number) => void;
  favoriteIds: number[];
  onToggleFavorite: (id: number) => void;
  savingFavoriteIds: Set<number>;
}

export function ProductGrid({
  products,
  total,
  view,
  sort,
  onSortChange,
  onSelect,
  onCompareToggle,
  compareIds,
  searchTerm,
  loading,
  activeFilters,
  onRemoveFilter,
  page,
  pageSize,
  totalFiltered,
  onPageChange,
  favoriteIds,
  onToggleFavorite,
  savingFavoriteIds,
}: ProductGridProps) {
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const isEmpty = !loading && totalFiltered === 0;

  return (
    <section className="results">
      <ResultsHeader
        totalFiltered={totalFiltered}
        totalAll={total}
        visible={products.length}
        sort={sort}
        onSortChange={onSortChange}
      />

      <div className="active-filters">
        {activeFilters.map((filter) => (
          <button
            key={`${filter.key}-${filter.label}`}
            className="chip"
            onClick={() => onRemoveFilter(filter)}
          >
            {filter.label} ×
          </button>
        ))}
      </div>

      <div className={`product-grid ${view}`}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={`product-card ${view} skeleton`} />
          ))
          : products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              view={view}
              onSelect={onSelect}
              onCompareToggle={onCompareToggle}
              isCompared={compareIds.includes(product.id)}
              searchTerm={searchTerm}
              isFavorite={favoriteIds.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              isSavingFavorite={savingFavoriteIds.has(product.id)}
            />
          ))}
      </div>
      {isEmpty && <div className="empty-state">No products found matching your criteria.</div>}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn ghost"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn ghost"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
