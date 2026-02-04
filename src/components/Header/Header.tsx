import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { CompareButton } from "./CompareButton";
import { CheckoutButton } from "./CheckoutButton";

interface HeaderProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;
  isSearching?: boolean;
  view?: "grid" | "list";
  onViewChange?: (value: "grid" | "list") => void;
  compareCount?: number;
  checkoutCount?: number;
  onCompareOpen?: () => void;
  onCheckoutOpen?: () => void;
  onFilterToggle?: () => void;
  showControls?: boolean;
  favoritesCount?: number;
}

export function Header({
  search = "",
  onSearchChange,
  onClearSearch,
  isSearching,
  view = "grid",
  onViewChange,
  compareCount = 0,
  checkoutCount = 0,
  onCompareOpen,
  onCheckoutOpen,
  onFilterToggle,
  showControls = true,
  favoritesCount = 0,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="eyebrow">E-Commerce</span>
        <h1>
          <Link to="/" className="brand-link">
            Product Dashboard
          </Link>
        </h1>
        <nav className="header-nav">
          <NavLink to="/" end>
            Products
          </NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
        </nav>
      </div>
      {showControls && (
        <div className="header-actions">
          <div className="favorites-count">Favorites ({favoritesCount})</div>
          <button className="btn ghost filter-toggle" onClick={onFilterToggle}>
            Filters
          </button>
          <SearchBar
            value={search}
            onChange={onSearchChange}
            onClear={onClearSearch}
            isSearching={isSearching}
          />
          <ViewToggle value={view} onChange={onViewChange} />
          <CompareButton count={compareCount} onClick={onCompareOpen} />
          <CheckoutButton count={checkoutCount} onClick={onCheckoutOpen} />
        </div>
      )}
    </header>
  );
}
