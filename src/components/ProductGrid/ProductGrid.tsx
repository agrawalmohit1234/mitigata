import React from "react";
import type { Product } from "../../types/product.types";
import { ProductCard } from "./ProductCard";
import { ResultsHeader } from "./ResultsHeader";
import type { ActiveFilterChip } from "../../types/filter.types";
import { AutoSizer, List, ListRowRenderer } from "react-virtualized";

interface ProductGridProps {
  products: Product[];
  total: number;
  view: "grid" | "list";
  sort: string;
  onSortChange: (value: string) => void;
  onSelect: (product: Product) => void;
  onCompareToggle: (id: number) => void;
  onCheckout: (id: number) => void;
  compareIds: number[];
  checkoutIds: number[];
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
  onCheckout,
  compareIds,
  checkoutIds,
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
  const rowHeight = view === "list" ? 300 : 560;

  return (
    <>
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

        <div className={`product-grid ${view} ${loading ? "" : "virtualized"}`}>
          {loading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className={`product-card ${view} skeleton`} />
            ))
          ) : (
            <div className="virtualized-list">
              <AutoSizer disableHeight>
                {({ width }) => {
                  const columnCount =
                    view === "list"
                      ? 1
                      : width >= 900
                        ? 3
                        : width >= 768
                          ? 2
                          : 1;
                  const rowCount = Math.ceil(products.length / columnCount);

                  const rowRenderer: ListRowRenderer = ({
                    index,
                    key,
                    style,
                  }) => {
                    const start = index * columnCount;
                    const rowItems = products.slice(start, start + columnCount);
                    return (
                      <div key={key} style={style}>
                        <div className={`virtual-row ${view}`}>
                          {rowItems.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              view={view}
                              onSelect={onSelect}
                              onCompareToggle={onCompareToggle}
                              onCheckout={onCheckout}
                              isCompared={compareIds.includes(product.id)}
                              isCheckout={checkoutIds.includes(product.id)}
                              searchTerm={searchTerm}
                              isFavorite={favoriteIds.includes(product.id)}
                              onToggleFavorite={onToggleFavorite}
                              isSavingFavorite={savingFavoriteIds.has(
                                product.id,
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  };

                  const listHeight = view === "list" ? 720 : 820;

                  return (
                    <List
                      width={width}
                      height={listHeight}
                      rowCount={rowCount}
                      rowHeight={rowHeight}
                      rowRenderer={rowRenderer}
                      overscanRowCount={3}
                      style={{ paddingBottom: "320px" }}
                    />
                  );
                }}
              </AutoSizer>
            </div>
          )}
        </div>
        {isEmpty && (
          <div className="empty-state">
            No products found matching your criteria.
          </div>
        )}
        <div style={{ margin: "20px" }}>
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
        </div>
      </section>
    </>
  );
}
