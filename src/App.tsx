import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { FilterPanel } from "./components/FilterPanel/FilterPanel";
import { ProductGrid } from "./components/ProductGrid/ProductGrid";
import { useProducts } from "./hooks/useProducts";
import { useFilters } from "./hooks/useFilters";
import { filterProducts } from "./utils/filterProducts";
import { sortProducts } from "./utils/sortProducts";
import { ProductProvider, useProductContext } from "./context/ProductContext";
import { ToastProvider, useToasts } from "./context/ToastContext";
import { ToastHost } from "./components/ToastHost";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FavoritesProvider, useFavorites } from "./context/FavoritesContext";
import { Analytics } from "./pages/Analytics";
import type { ActiveFilterChip } from "./types/filter.types";
import type { Product } from "./types/product.types";

const ProductModal = React.lazy(() => import("./components/ProductModal/ProductModal").then((module) => ({ default: module.ProductModal })));
const ComparisonDrawer = React.lazy(() => import("./components/ComparisonDrawer/ComparisonDrawer").then((module) => ({ default: module.ComparisonDrawer })));

function Dashboard() {
  const { products, loading, error, retry } = useProducts(100);
  const maxPrice = useMemo(() => {
    if (!products.length) return 0;
    return Math.max(...products.map((product) => product.price));
  }, [products]);

  const { filters, setFilter, toggleMulti, clearFilters, debouncedSearch, activeFilters } = useFilters(maxPrice);
  const { compareIds, toggleCompare, removeFromCompare, addToCompare } = useProductContext();
  const { favoriteIds, toggleFavorite, savingIds } = useFavorites();
  const { addToast } = useToasts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    if (error) {
      addToast({ type: "error", title: "Failed to load products.", message: "Retry?" });
    }
  }, [error, addToast]);

  const counts = useMemo(() => {
    const categories: Record<string, number> = {};
    const brands: Record<string, number> = {};
    products.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
      brands[product.brand] = (brands[product.brand] || 0) + 1;
    });
    return { categories, brands };
  }, [products]);

  const categories = useMemo(() => Object.keys(counts.categories).sort(), [counts]);
  const brands = useMemo(() => Object.keys(counts.brands).sort(), [counts]);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      ...filters,
      search: debouncedSearch,
      favoriteIds,
    });
  }, [products, filters, debouncedSearch, favoriteIds]);

  const sortedProducts = useMemo(() => sortProducts(filteredProducts, filters.sort), [filteredProducts, filters.sort]);
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, page, pageSize]);

  const isSearching = filters.search !== debouncedSearch;

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.categories,
    filters.brands,
    filters.stock,
    filters.rating,
    filters.priceMin,
    filters.priceMax,
    filters.favoritesOnly,
  ]);

  const handleCompareToggle = useCallback((id: number) => {
    if (!compareIds.includes(id) && compareIds.length >= 3) {
      addToast({ type: "error", title: "Comparison limit", message: "You can compare up to 3 products." });
      return;
    }
    toggleCompare(id);
    const already = compareIds.includes(id);
    addToast({
      type: already ? "info" : "success",
      title: already ? "Removed" : "Added",
      message: already ? "Product removed from comparison." : "Product added to comparison.",
    });
  }, [compareIds, toggleCompare, addToast]);

  const handleModalCompare = useCallback((id: number) => {
    if (compareIds.includes(id)) return;
    if (compareIds.length >= 3) {
      addToast({ type: "error", title: "Comparison limit", message: "You can compare up to 3 products." });
      return;
    }
    addToCompare(id);
    addToast({ type: "success", title: "Added", message: "Product added to comparison." });
  }, [compareIds, addToCompare, addToast]);

  const handleRemoveFilter = useCallback((filter: ActiveFilterChip) => {
    if (filter.key === "search") setFilter("search", "");
    if (filter.key === "categories" && filter.value) {
      toggleMulti("categories", filter.value);
    }
    if (filter.key === "brands" && filter.value) {
      toggleMulti("brands", filter.value);
    }
    if (filter.key === "stock" && filter.value) {
      toggleMulti("stock", filter.value);
    }
    if (filter.key === "rating") setFilter("rating", 0);
    if (filter.key === "price") {
      setFilter("priceMin", 0);
      setFilter("priceMax", maxPrice);
    }
    if (filter.key === "favorites") {
      setFilter("favoritesOnly", false);
    }
  }, [setFilter, toggleMulti, maxPrice]);

  const handleSearchChange = useCallback((value: string) => setFilter("search", value), [setFilter]);
  const handleClearSearch = useCallback(() => setFilter("search", ""), [setFilter]);
  const handleViewChange = useCallback((value: "grid" | "list") => setFilter("view", value), [setFilter]);
  const handleSortChange = useCallback((value: string) => setFilter("sort", value), [setFilter]);
  const handleFilterToggle = useCallback(() => setFiltersOpen((prev) => !prev), []);
  const handleSelectProduct = useCallback((product: Product) => setSelectedProduct(product), []);
  const handleOpenCompare = useCallback(() => setCompareOpen(true), []);
  const handleCloseCompare = useCallback(() => setCompareOpen(false), []);
  const handleCloseModal = useCallback(() => setSelectedProduct(null), []);

  const handleToggleFavorite = useCallback((id: number) => {
    const wasFavorite = favoriteIds.includes(id);
    toggleFavorite(id, () => {
      addToast({ type: "error", title: "Save failed", message: "Could not save favorite. Try again." });
    });
    addToast({
      type: "success",
      title: wasFavorite ? "Removed" : "Saved",
      message: wasFavorite
        ? "Removed from favorites."
        : "Added to favorites.",
    });
  }, [toggleFavorite, addToast, favoriteIds]);

  if (error) {
    return (
      <div className="error-state">
        <h2>Failed to load products.</h2>
        <p>Check your connection and try again.</p>
        <button className="btn primary" onClick={retry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        search={filters.search}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        isSearching={isSearching}
        view={filters.view}
        onViewChange={handleViewChange}
        compareCount={compareIds.length}
        onCompareOpen={handleOpenCompare}
        onFilterToggle={handleFilterToggle}
        favoritesCount={favoriteIds.length}
      />
      <div className="layout">
        {filtersOpen && <div className="filter-backdrop" onClick={handleFilterToggle} />}
        <FilterPanel
          categories={categories}
          brands={brands}
          counts={counts}
          filters={filters}
          toggleMulti={toggleMulti}
          setFilter={setFilter}
          maxPrice={maxPrice}
          activeCount={activeFilters.length}
          onClear={clearFilters}
          isOpen={filtersOpen}
          onClose={filtersOpen ? handleFilterToggle : undefined}
        />
        <ProductGrid
          products={pagedProducts}
          total={products.length}
          view={filters.view}
          sort={filters.sort}
          onSortChange={handleSortChange}
          onSelect={handleSelectProduct}
          onCompareToggle={handleCompareToggle}
          compareIds={compareIds}
          searchTerm={debouncedSearch}
          loading={loading}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          page={page}
          pageSize={pageSize}
          totalFiltered={sortedProducts.length}
          onPageChange={setPage}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          savingFavoriteIds={savingIds}
        />
      </div>

      {compareIds.length > 0 && (
        <button className="fab" onClick={handleOpenCompare}>
          {compareIds.length} selected
        </button>
      )}

      <Suspense fallback={null}>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onCompare={handleModalCompare}
          />
        )}
        {compareOpen && (
          <ComparisonDrawer
            products={products.filter((product) => compareIds.includes(product.id))}
            onClose={handleCloseCompare}
            onRemove={removeFromCompare}
          />
        )}
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <FavoritesProvider>
          <ProductProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
            <ToastHost />
          </ProductProvider>
        </FavoritesProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
