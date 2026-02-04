import React, { memo, useMemo } from "react";
import type { Product, StockStatus } from "../../types/product.types";
import { formatCurrency } from "../../utils/format";

const STOCK_BADGE: Record<StockStatus, string> = {
  "In Stock": "stock-ok",
  "Low Stock": "stock-low",
  "Out of Stock": "stock-out",
};

const getStockStatus = (stock: number): StockStatus => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 20) return "Low Stock";
  return "In Stock";
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text: string, term: string) => {
  if (!term) return text;
  const safeTerm = escapeRegExp(term);
  const regex = new RegExp(`(${safeTerm})`, "ig");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : part,
  );
};

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const imgRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const node = imgRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`image-frame ${loaded ? "loaded" : ""}`} ref={imgRef}>
      {isVisible && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  view: "grid" | "list";
  onSelect: (product: Product) => void;
  onCompareToggle: (id: number) => void;
  onCheckout: (id: number) => void;
  isCompared: boolean;
  isCheckout: boolean;
  searchTerm: string;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  isSavingFavorite: boolean;
  disableAddToCart?: boolean;
  disableFavourite?: boolean;
  disableCompare?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  view,
  onSelect,
  onCompareToggle,
  onCheckout,
  isCompared,
  isCheckout,
  searchTerm,
  isFavorite,
  onToggleFavorite,
  isSavingFavorite,
  disableAddToCart,
  disableFavourite,
  disableCompare,
}: ProductCardProps) {
  const stockStatus = useMemo(
    () => getStockStatus(product.stock),
    [product.stock],
  );

  return (
    <article
      className={`product-card ${view}`}
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSelect(product);
        }
      }}
    >
      <LazyImage src={product.thumbnail} alt={product.title} />
      <div className="product-info">
        {!disableFavourite && (
          <button
            className={`heart-button ${isFavorite ? "active" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(product.id);
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isSavingFavorite ? <span className="spinner" /> : "♥"}
          </button>
        )}
        <div className="product-meta">
          <h3>{highlightText(product.title, searchTerm)}</h3>
          {view === "list" && (
            <p className="description">
              {highlightText(product.description, searchTerm)}
            </p>
          )}
          <div className="rating">
            <span className="stars">
              {"★".repeat(Math.round(product.rating))}
            </span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="product-price">
          <span className="price">{formatCurrency(product.price)}</span>
          <span className="brand">{product.brand}</span>
          <span className={`stock-badge ${STOCK_BADGE[stockStatus]}`}>
            {stockStatus}
          </span>
        </div>
        {!disableCompare && (
          <label
            className="compare-checkbox"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onCompareToggle(product.id)}
            />
            Compare
          </label>
        )}
        {!disableAddToCart && (
          <div>
            <button
              disabled={isCheckout}
              onClick={(e) => {
                e.stopPropagation();
                onCheckout(product.id);
              }}
            >
              {isCheckout ? "Already in Cart" : "Add To Cart"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
});
