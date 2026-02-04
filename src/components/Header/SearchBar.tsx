import React from "react";

interface SearchBarProps {
  value: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  isSearching?: boolean;
}

export function SearchBar({ value, onChange, onClear, isSearching }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-label="Search products"
      />
      {value && (
        <button className="icon-button" onClick={onClear} aria-label="Clear search">
          ×
        </button>
      )}
      {isSearching && <span className="searching">Searching...</span>}
    </div>
  );
}
