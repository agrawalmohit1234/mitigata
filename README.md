# MitiGata E-Commerce Dashboard (SDE-3)

## Setup Instructions
- Node version: `18.x` (tested with Node 18 LTS)
- Install dependencies: `npm install`
- Run locally: `npm start`
- Build: `npm run build`

## Design Decisions
- State management: React Context + hooks.
  - Rationale: The app has shared state (filters, compare list, favorites, toasts) that benefits from a single, predictable source of truth without adding the overhead of Redux/Zustand for a mid-size SPA.
  - Context boundaries are scoped (`ProductContext`, `FavoritesContext`, `ToastContext`) to avoid global overreach and to keep renders predictable.

## Performance Optimizations
- `React.memo` on `ProductCard` to avoid unnecessary re-renders.
- `useMemo` for filtered/sorted lists and derived counts (categories/brands).
- `useCallback` for handlers passed into child components.
- Debounced search (300ms) to avoid per-keystroke heavy filtering.
- Throttled price range updates (100ms) to keep slider smooth.
- Pagination to keep render count stable at 24 items per page.
- Request caching in `fetchProducts` to avoid redundant API calls.
- Lazy-loaded modals/drawers with `React.lazy` + `Suspense`.

## Advanced Features (Chosen)
1. **Option C: Optimistic UI (Favorites System)**
   - Instant feedback on heart toggle with rollback on persistence failure.
   - Shows loading spinner during save, with toast success/failure.
   - Chosen to demonstrate UX responsiveness and robust error handling.

2. **Option A: Analytics Dashboard**
   - Custom SVG visualizations (no chart libraries) with animations.
   - Shows business insights like price distribution and stock health.
   - Chosen to demonstrate data-driven UI composition and SVG rendering.

## Architecture Overview
Simple component map:
```
App
  Header
  FilterPanel
  ProductGrid
    ProductCard
  ProductModal
  ComparisonDrawer
  ToastHost
```
Simple state flow:
- `useProducts` fetches and caches products.
- `useFilters` holds filters and URL sync.
- `filterProducts` + `sortProducts` build the list.
- Contexts: `FavoritesContext`, `ProductContext`, `ToastContext`.

## Known Limitations
- Pagination is used instead of full virtual scrolling (to remove flicker). With more time, I would reintroduce virtual scrolling using fixed-height virtualization with stable row measurement.
- No server-side rendering or prefetching; for a production scale app, I’d add route-level code splitting + data prefetch.
- Chart data is recomputed in-memory; for large datasets I’d pre-aggregate on fetch or memoize with a normalized store.

## Time Breakdown (2.5 hours)
1. Layout + core data flow (filters/sort/search): ~45 min
2. Product cards, detail modal, comparison drawer: ~40 min
3. Performance work + pagination: ~25 min
4. Analytics dashboard (SVG charts): ~25 min
5. Favorites system (optimistic + persistence): ~15 min
