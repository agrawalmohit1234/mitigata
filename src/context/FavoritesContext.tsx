import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface FavoritesContextValue {
  favoriteIds: number[];
  toggleFavorite: (id: number, onPersistFail?: (error: unknown) => void) => void;
  savingIds: Set<number>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = "mitigata_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // handled in toggle with rollback
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((id: number, onPersistFail?: (error: unknown) => void) => {
    setSavingIds((prev) => new Set(prev).add(id));

    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        if (onPersistFail) onPersistFail(error);
        return prev;
      } finally {
        setTimeout(() => {
          setSavingIds((current) => {
            const updated = new Set(current);
            updated.delete(id);
            return updated;
          });
        }, 180);
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    favoriteIds,
    toggleFavorite,
    savingIds,
  }), [favoriteIds, toggleFavorite, savingIds]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
