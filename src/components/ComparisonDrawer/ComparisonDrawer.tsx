import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import type { Product } from "../../types/product.types";
import { formatCurrency } from "../../utils/format";

const ensurePortal = () => {
  let portal = document.getElementById("modal-root");
  if (!portal) {
    portal = document.createElement("div");
    portal.id = "modal-root";
    document.body.appendChild(portal);
  }
  return portal;
};

interface ComparisonDrawerProps {
  products: Product[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

export function ComparisonDrawer({ products, onClose, onRemove }: ComparisonDrawerProps) {
  const minPrice = useMemo(() => {
    if (!products.length) return null;
    return Math.min(...products.map((product) => product.price));
  }, [products]);

  const maxRating = useMemo(() => {
    if (!products.length) return null;
    return Math.max(...products.map((product) => product.rating));
  }, [products]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="drawer-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <h2>Compare Products</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close comparison">×</button>
        </div>
        <div className="comparison-grid">
          {Array.from({ length: 3 }).map((_, index) => {
            const product = products[index];
            if (!product) {
              return (
                <div key={index} className="comparison-card empty">
                  <p>Add Product</p>
                </div>
              );
            }

            const isBestPrice = product.price === minPrice;
            const isBestRating = product.rating === maxRating;

            return (
              <div key={product.id} className="comparison-card">
                <img src={product.thumbnail} alt={product.title} />
                <h3>{product.title}</h3>
                <p className={isBestPrice ? "highlight" : ""}>{formatCurrency(product.price)}</p>
                <p className={isBestRating ? "highlight" : ""}>
                  {"★".repeat(Math.round(product.rating))} {product.rating.toFixed(1)}
                </p>
                <p>{product.brand}</p>
                <p>Stock: {product.stock}</p>
                <p className="description">{product.description}</p>
                <button className="btn ghost" onClick={() => onRemove(product.id)}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    ensurePortal()
  );
}
