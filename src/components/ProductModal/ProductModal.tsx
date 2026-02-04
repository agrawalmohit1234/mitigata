import React, { useEffect, useMemo, useRef, useState } from "react";
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

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onCompare: (id: number) => void;
}

export function ProductModal({ product, onClose, onCompare }: ProductModalProps) {
  const [activeImage, setActiveImage] = useState(product?.thumbnail);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveImage(product?.thumbnail);
  }, [product]);

  useEffect(() => {
    if (!product) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  useEffect(() => {
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable?.length) return undefined;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    first.focus();
    return () => document.removeEventListener("keydown", handleTab);
  }, [product]);

  const stockLabel = useMemo(() => {
    if (!product) return "";
    if (product.stock === 0) return "Out of Stock";
    if (product.stock <= 20) return "Low Stock";
    return "In Stock";
  }, [product]);

  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
        aria-label={`${product.title} details`}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
        <div className="modal-content">
          <div className="modal-images">
            <img src={activeImage} alt={product.title} className="modal-main" />
            <div className="modal-thumbs">
              {product.images?.map((image) => (
                <button
                  key={image}
                  className={image === activeImage ? "active" : ""}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt={product.title} />
                </button>
              ))}
            </div>
          </div>
          <div className="modal-details">
            <h2>{product.title}</h2>
            <p className="modal-price">{formatCurrency(product.price)}</p>
            <div className="rating">
              <span className="stars">{"★".repeat(Math.round(product.rating))}</span>
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <p className="muted">Brand: {product.brand}</p>
            <p className="muted">Category: {product.category}</p>
            <p>{product.description}</p>
            <p className="stock">Stock: {stockLabel} ({product.stock})</p>
            <div className="specs">
              <h4>Specifications</h4>
              <ul>
                <li>Discount: {product.discountPercentage?.toFixed(1)}%</li>
                <li>SKU: {product.id}</li>
              </ul>
            </div>
            <button className="btn primary" onClick={() => onCompare(product.id)}>
              Add to Compare
            </button>
          </div>
        </div>
      </div>
    </div>,
    ensurePortal()
  );
}
