import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface ProductContextValue {
  compareIds: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  toggleCompare: (id: number) => void;
  setCompareIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const ProductContext = createContext<ProductContextValue | null>(null);

const STORAGE_KEY = "mitigata_compare";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const addToCompare = useCallback((id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const toggleCompare = useCallback((id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const value = useMemo(() => ({
    compareIds,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    setCompareIds,
  }), [compareIds, addToCompare, removeFromCompare, toggleCompare]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return context;
}
